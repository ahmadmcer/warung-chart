import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ShareTechMono_400Regular } from "@expo-google-fonts/share-tech-mono";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    ShareTechMono_400Regular,
    Poppins_400Regular,
  });

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
