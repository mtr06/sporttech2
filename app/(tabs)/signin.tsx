import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Header from "@/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState<string>("");
  const [passord, setPassword] = useState<string>("");

  const handleLogin = () => {};

  return (
    <View>
      <Header user={params} router={router} />
      {/* Area Content */}
      <View className="mt-4 flex items-center">
        <View>
          <Text className="text-4xl font-bold">Login</Text>
        </View>
        <View className="mt-8">
          <Text className="text-center text-xs">Enter to start Booking</Text>
          <Image
            source={require("../../assets/images/login1.png")}
            className="mt-2"
          />
        </View>
        <View className="mt-12 w-full">
          <View className="mx-6">
            <Text className="text-base">Email</Text>
            <TextInput
              placeholder="Enter email"
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
              className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
            />
          </View>

          <View className="mx-6">
            <Text className="text-base mt-4">Password</Text>
            <TextInput
              placeholder="********"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
            />
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            className="mt-32 mx-6 bg-[#6895D2] py-3 flex items-center rounded-xl"
          >
            <Text className="text-xl text-textButton font-bold text-white">
              Login
            </Text>
          </TouchableOpacity>
          <View className="mt-1 flex flex-row justify-center">
            <Text>Don't have an account?</Text>
            <TouchableOpacity>
              <Text className="text-[#232297] font-semibold"> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
