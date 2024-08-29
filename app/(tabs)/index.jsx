import React, {
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import SafeAreaView from "../../components/SafeAreaView";
import * as SQLite from "expo-sqlite";

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [income, setIncome] = useState([]);
  const [outcome, setOutcome] = useState([]);
  const [day, setDay] = useState([]);
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
      const income = [];
      const outcome = [];
      const day = [];

      if (data.length === 0) {
        income.push(0);
        outcome.push(0);
        day.push(
          new Date().toLocaleDateString("id-ID", {
            weekday: "short",
          })
        );
      } else {
        data.forEach((item) => {
          income.push(item.income / 1000);
          outcome.push(item.outcome / 1000);
          day.push(
            new Date(
              item.date
            ).toLocaleDateString("id-ID", {
              weekday: "short",
            })
          );
        });
      }

      setIncome(income);
      setOutcome(outcome);
      setDay(day);
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

  const deleteTable = async () => {
    try {
      const db = await SQLite.openDatabaseAsync(
        "wallet.db"
      );
      await db.execAsync("DROP TABLE wallet");
    } catch (error) {
      console.error(error);
    }
  };

  const resetData = async () => {
    try {
      const db = await SQLite.openDatabaseAsync(
        "wallet.db"
      );
      await db.execAsync("DELETE FROM wallet");
      await db.execAsync("VACUUM");
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmResetData = () => {
    Alert.alert(
      "Reset Data",
      "Apakah Anda yakin ingin mereset data?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: resetData,
        },
      ]
    );
  };

  const toRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const toIndonesian = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shortAscByDate = (data) => {
    return data.sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );
  };

  const shortDescByDate = (data) => {
    return data.sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );
  };

  const splitDay = (date) => {
    return date.split(", ")[0];
  };

  const splitDate = (date) => {
    return date.split(", ")[1];
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <View
          style={{
            padding: 16,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            backgroundColor: "white",
          }}>
          <LineChart
            data={{
              labels: day,
              datasets: [
                {
                  data: income,
                  color: () =>
                    `hsl(130, 80%, 40%)`,
                  strokeWidth: 2,
                },
                {
                  data: outcome,
                  color: () =>
                    `hsl(10, 80%, 50%)`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={
              Dimensions.get("window").width - 64
            }
            height={220}
            yAxisLabel="Rp "
            yAxisSuffix="rb"
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: `rgba(255, 255, 255, 0)`,
              backgroundGradientTo: `rgba(255, 255, 255, 0)`,
              decimalPlaces: 0,
              useShadowColorFromDataset: true,
              color: () => `hsl(0, 0%, 50%)`,
              labelColor: () => `hsl(0, 0%, 10%)`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "3",
                strokeWidth: "1",
                stroke: "#fff",
              },
            }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: "white",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <FlatList
          data={shortDescByDate(data)}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#f0f0f0",
              }}>
              <View>
                <Text
                  style={{
                    fontFamily:
                      "Poppins_400Regular",
                    fontSize: 16,
                    lineHeight: 18,
                  }}>
                  {splitDay(
                    toIndonesian(
                      new Date(item.date)
                    )
                  )}
                  ,
                </Text>
                <Text
                  style={{
                    fontFamily:
                      "Poppins_400Regular",
                    fontSize: 12,
                    lineHeight: 14,
                  }}>
                  {splitDate(
                    toIndonesian(
                      new Date(item.date)
                    )
                  )}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                }}>
                <Text
                  style={{
                    fontFamily:
                      "ShareTechMono_400Regular",
                    fontSize: 16,
                    color: "hsl(130, 80%, 40%)",
                  }}>
                  +{toRupiah(item.income)}
                </Text>
                <Text
                  style={{
                    fontFamily:
                      "ShareTechMono_400Regular",
                    fontSize: 16,
                    color: "hsl(10, 80%, 50%)",
                  }}>
                  -{toRupiah(item.outcome)}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        {/* <Pressable style={{
          padding: 8,
          backgroundColor: 'hsl(210, 80%, 50%)',
          borderRadius: 8,
          alignItems: 'center',
        }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Lihat Selengkapnya</Text>
        </Pressable> */}
      </View>
      {/* <View
        style={{
          padding: 16,
          backgroundColor: "white",
        }}>
        <Pressable
          style={{
            padding: 8,
            backgroundColor: "hsl(0, 80%, 50%)",
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={confirmResetData}>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Reset Data
          </Text>
        </Pressable>
      </View> */}
    </SafeAreaView>
  );
}
