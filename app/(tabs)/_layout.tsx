import { Stack } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View, Text } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        freezeOnBlur: true,
        headerStyle: { backgroundColor: "#6895D2" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="inputlapangan"
        options={{
          title: "Fill Your Venue",
        }}
      />
      <Stack.Screen
        name="reservation"
        options={{
          title: "Reservation Lapangan",
        }}
      />
      <Stack.Screen
        name="pasangiklan"
        options={{
          title: "Pasang Iklan",
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: "Payment",
        }}
      />
      <Stack.Screen
        name="paymentconfirmation"
        options={{
          title: "Payment Confirmation",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="suntinglapangan"
        options={{
          title: "Settings Lapangan",
        }}
      />
      <Stack.Screen
        name="signin"
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
}
