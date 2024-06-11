import {
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Header from "@/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const handleSignup = async () => {
    const fullName = `${firstName} ${lastName}`;
    console.log(fullName);

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomReferral = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomReferral += characters.charAt(randomIndex);
    }
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      await updateProfile(getAuth().currentUser!!, {
        displayName: fullName,
        photoURL: "",
      });
      await setDoc(doc(db, "customer", getAuth().currentUser!!.uid), {
        id: getAuth().currentUser!!.uid,
        nama: fullName,
        email: getAuth().currentUser!!.email,
        fotoProfil: getAuth().currentUser!!.photoURL,
        phoneNumber: phoneNumber,
        referralCode: randomReferral,
        countReferral: 0,
        role: "Customer",
      }).then(() => {
        alert("Registrasi Berhasil!");
        router.push({ pathname: "/profile" });
      });
    } catch (e: any) {
      Alert.alert("Registrasi Error!", e, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  const isValid = () => {
    return (
      firstName != "" &&
      lastName != "" &&
      email != "" &&
      password != "" &&
      phoneNumber != ""
    );
  };

  return (
    <ScrollView>
      <Header user={params} router={router} />
      {/* Area Content */}
      <View className="mt-4 flex items-center">
        <View>
          <Text className="text-4xl font-bold">Sign Up</Text>
        </View>
        <View className="mt-8">
          <Text className="text-center text-xs">Create your account here</Text>
          <Image
            source={require("../../assets/images/signup.png")}
            className="mt-2"
          />
        </View>
        <View className="mt-1 w-full">
          <View className="mx-6">
            <Text className="text-base">Full Name</Text>
            <View className="flex-row">
              <TextInput
                placeholder="First name"
                onChangeText={(firstName) => setFirstName(firstName)}
                className="mt-2 w-[47%] text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
              <TextInput
                placeholder="Last name"
                onChangeText={(lastName) => setLastName(lastName)}
                className="ml-[6%] mt-2 w-[47%] text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
          </View>
          <View className="mx-6 mt-2">
            <Text className="text-base">Email</Text>
            <TextInput
              placeholder="Enter email"
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
              className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
            />
          </View>
          <View className="mx-6 mt-2">
            <Text className="text-base">Password</Text>
            <TextInput
              placeholder="********"
              secureTextEntry
              onChangeText={(password) => setPassword(password)}
              className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
            />
          </View>
          <View className="mx-6 mt-2">
            <Text className="text-base">Phone Number</Text>
            <TextInput
              placeholder="Enter phone number"
              keyboardType="numeric"
              onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
              className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
            />
          </View>
          <View className="mx-6 mt-2">
            <Text className="text-base">Referral Code</Text>
            <TextInput
              placeholder="Enter referral code"
              onChangeText={(referralCode) => setReferralCode(referralCode)}
              className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!isValid()) {
                Alert.alert(
                  "Invalid Input!",
                  "Pastikan untuk mengisi semua input!",
                  [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                );
              } else {
                handleSignup();
              }
            }}
            className="mt-8 mx-6 bg-[#6895D2] py-3 flex items-center rounded-xl"
          >
            <Text className="text-xl text-textButton font-bold text-white">
              Register
            </Text>
          </TouchableOpacity>
          <View className="mt-1 mb-2 flex flex-row justify-center">
            <Text>Already have an account?</Text>
            <TouchableOpacity>
              <Text className="text-[#232297] font-semibold"> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
