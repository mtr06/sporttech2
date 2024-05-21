import {
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Header from "@/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const auth = getAuth();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          router.push({ pathname: "/", params: params });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`${errorCode}: ${errorMessage}`);
      });
  };

  return (
    <ScrollView>
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
              onChangeText={(email) => setEmail(email)}
              className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
            />
          </View>
          <View className="mx-6">
            <Text className="text-base mt-4">Password</Text>
            <TextInput
              placeholder="********"
              secureTextEntry
              onChangeText={(password) => setPassword(password)}
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
            <TouchableOpacity
              onPress={() => {
                router.push({ pathname: "/signup" });
              }}
            >
              <Text className="text-[#232297] font-semibold"> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
