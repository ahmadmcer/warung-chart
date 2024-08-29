import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="insert-chart"
              size={24}
              color={color}
            />
          ),
          tabBarActiveTintColor:
            "hsl(220, 80%, 60%)",
          unmountOnBlur: true,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="income"
        options={{
          title: "Pemasukan",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="download"
              size={24}
              color={color}
            />
          ),
          tabBarActiveTintColor:
            "hsl(130, 80%, 40%)",
          unmountOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="outcome"
        options={{
          title: "Pengeluaran",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="upload"
              size={24}
              color={color}
            />
          ),
          tabBarActiveTintColor:
            "hsl(10, 80%, 50%)",
          unmountOnBlur: true,
        }}
      />
    </Tabs>
  );
}
