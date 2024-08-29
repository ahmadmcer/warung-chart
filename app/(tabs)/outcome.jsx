import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  VirtualizedList,
  TextInput,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import CurrencyInput from "react-native-currency-input";
import * as SQLite from "expo-sqlite";

export default function OutcomeScreen() {
  const [data, setData] = useState([]);
  const [valueOutcome, setValueOutcome] =
    useState(0);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const fetchDataAndCheckDatabase =
      async () => {
        await checkDatabase();
        fetchData();
      };

    fetchDataAndCheckDatabase();
  }, []);

  const fetchData = async () => {
    try {
      const db = await SQLite.openDatabaseAsync(
        "wallet.db"
      );
      const query = await db.getAllAsync(
        "SELECT * FROM wallet"
      );
      const data = shortAscByDate(query);

      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync(
        "wallet.db"
      );
      const result = await db.getFirstAsync(
        'SELECT name FROM sqlite_master WHERE type="table" AND name="wallet"'
      );

      if (!result) {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE wallet (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            income INTEGER,
            outcome INTEGER
          );
        `);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveAmount = async () => {
    try {
      const db = await SQLite.openDatabaseAsync(
        "wallet.db"
      );
      const tempData = await db.getFirstAsync(
        `SELECT * FROM wallet WHERE date = '${date}'`
      );
      if (!tempData) {
        await db.execAsync(
          `INSERT INTO wallet (date, income, outcome) VALUES ('${date}', 0, ${valueOutcome})`
        );
      } else {
        await db.execAsync(
          `UPDATE wallet SET outcome = ${valueOutcome} WHERE date = '${date}'`
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      fetchData();
      setValueOutcome(0);
      setDate(
        new Date().toISOString().split("T")[0]
      );
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(
      new Date(currentDate)
        .toISOString()
        .split("T")[0]
    );
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: new Date(date),
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const toRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const toIndonesian = (date) => {
    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const shortAscByDate = (data) => {
    return data.sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );
  };

  const sortDescByDate = (data) => {
    return data.sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}>
      <View
        style={{
          flex: 3,
        }}>
        <VirtualizedList
          data={sortDescByDate(data)}
          initialNumToRender={8}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor:
                  "hsl(0, 0%, 90%)",
              }}>
              <View
                style={{
                  flexDirection: "column",
                }}>
                <Text
                  style={{
                    fontFamily:
                      "Poppins_400Regular",
                    fontSize: 16,
                    lineHeight: 18,
                  }}>
                  {
                    toIndonesian(
                      new Date(item.date)
                    ).split(", ")[0]
                  }
                  ,
                </Text>
                <Text
                  style={{
                    fontFamily:
                      "Poppins_400Regular",
                    fontSize: 12,
                    lineHeight: 14,
                  }}>
                  {
                    toIndonesian(
                      new Date(item.date)
                    ).split(", ")[1]
                  }
                </Text>
              </View>
              <Text
                style={{
                  color: "hsl(10, 80%, 50%)",
                  fontSize: 20,
                  fontFamily:
                    "ShareTechMono_400Regular",
                }}>
                {toRupiah(item.outcome)}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          getItemCount={() => data.length}
          getItem={(data, index) => data[index]}
        />
      </View>
      <View
        style={{
          padding: 16,
          backgroundColor: "white",
          borderTopWidth: 2,
          borderTopColor: "hsl(0, 0%, 90%)",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Pressable onPress={showDatepicker}>
          <TextInput
            style={{
              color: "black",
              fontSize: 16,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "hsl(0, 0%, 80%)",
            }}
            value={toIndonesian(date)}
            editable={false}
          />
        </Pressable>
        <CurrencyInput
          value={valueOutcome}
          onChangeValue={setValueOutcome}
          prefix="Rp "
          delimiter="."
          separator=","
          precision={0}
          style={{
            fontSize: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "hsl(0, 0%, 80%)",
            marginTop: 8,
          }}
        />
        <Pressable
          onPress={saveAmount}
          style={{
            padding: 8,
            backgroundColor: "hsl(210, 80%, 50%)",
            borderRadius: 8,
            alignItems: "center",
            marginTop: 8,
          }}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}>
            Simpan
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
