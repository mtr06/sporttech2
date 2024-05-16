import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import {
  MaterialCommunityIcons,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";

const Header = (router: any) => {
  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerRight: () => (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View>
              <TouchableOpacity onPress={() => router}>
                <MaterialIcons
                  name="notifications-active"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => router}>
                <FontAwesome6 name="user-circle" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ),
        headerLeft: () => (
          <View className="flex flex-row items-center gap-x-4">
            <TouchableOpacity onPress={() => router}>
              <MaterialCommunityIcons
                name="home-outline"
                size={32}
                color="white"
              />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
  );
};

export default Header;
