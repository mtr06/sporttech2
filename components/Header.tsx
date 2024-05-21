import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  MaterialCommunityIcons,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Header = ({ user, router }: any) => {
  const auth = getAuth();
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
              <TouchableOpacity
                onPress={() => {
                  onAuthStateChanged(auth, (user) => {
                    if (user) {
                      router.push({ pathname: "/profile", params: user });
                    } else {
                      router.push({ pathname: "/signin" });
                    }
                  });
                }}
              >
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
