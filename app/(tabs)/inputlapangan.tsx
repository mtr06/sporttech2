import {
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Header from "@/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome6, SimpleLineIcons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import { getAuth, signOut } from "firebase/auth";
import { db } from "@/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export default function Inputlapangan() {
  const [venueName, setVenueName] = useState<String>("");
  const [venueDescription, setVenueDescription] = useState<String>("");
  const [venuePrice, setVenuePrice] = useState<any>(0);
  const [whatsappNumber, setWhatsappNumber] = useState<String>("");
  const [day, setDay] = useState<string>("MIN");
  const [next, setNext] = useState<boolean>(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [timeAvailable, setTimeAvailable] = useState<any>({
    MIN: {
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
    },
    SEN: {
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
    },
    SEL: {
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
    },
    RAB: {
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
    },
    KAM: {
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
    },
    JUM: {
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
    },
    SAB: {
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
      16: false,
      17: false,
      18: false,
      19: false,
      20: false,
      21: false,
      22: false,
    },
  });

  const toggleTimeSlot = (day: string, hour: number) => {
    setTimeAvailable((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [hour]: !prev[day][hour],
      },
    }));
  };

  const TimeSlot = ({ day }: { day: string }) => (
    <View className="flex flex-row flex-wrap justify-center gap-2">
      {Object.keys(timeAvailable[day]).map((hour) => (
        <TouchableOpacity
          key={hour}
          onPress={() => toggleTimeSlot(day, Number(hour))}
          className={`px-4 py-2 border rounded-lg ${
            timeAvailable[day][Number(hour)] ? "bg-green-500" : "bg-[#CF7575]"
          }`}
        >
          <Text className="text-center font-bold">
            {Number(hour) < 10 ? `0${hour}:00` : `${hour}:00`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Ensure the user is authenticated before proceeding
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push({ pathname: "/signin" });
    }
  }, [user]);

  return (
    <ScrollView>
      <Header user={params} router={router} />
      {/* Area Content */}
      <View className="mt-4 flex items-center">
        <View>
          <Text className="text-4xl font-bold">Isi Data Lapangan</Text>
        </View>
        {/* <View className="mt-8">
          <Text className="text-center text-xs">Enter to start Booking</Text>
          <Image
            source={require("../../assets/images/login1.png")}
            className="mt-2"
          />
        </View> */}
        {!next ? (
          <View className="mt-4 w-full">
            <View className="mx-6">
              <Text className="text-base">Nama Lapangan</Text>
              <TextInput
                placeholder="Enter Venue Name"
                onChangeText={(text) => setVenueName(text)}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Deskripsi Lapangan</Text>
              <TextInput
                placeholder="Enter Description"
                onChangeText={(text) => setVenueDescription(text)}
                multiline={true}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl h-[100px]"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Harga per jam</Text>
              <TextInput
                placeholder="For example : 85000"
                keyboardType="numeric"
                onChangeText={(text) => setVenuePrice(text)}
                value={venuePrice}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Nomor Whatsapp</Text>
              <TextInput
                placeholder="Whatsapp Number"
                keyboardType="numeric"
                onChangeText={(text) => setVenueDescription(text)}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
            <View className="mx-6 bg-[#E6EDF5] mt-3 rounded-xl border-[1px]">
              <View className="mx-2 my-2 flex justify-center items-center">
                <Text className="font-bold">Ketersediaan Waktu</Text>
                <View className="mt-1 flex-row justify-between gap-x-3">
                  <TouchableOpacity onPress={() => setDay("MIN")}>
                    <Text
                      className={`${
                        day === "MIN" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      MIN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("SEN")}>
                    <Text
                      className={`${
                        day === "SEN" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      SEN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("SEL")}>
                    <Text
                      className={`${
                        day === "SEL" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      SEL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("RAB")}>
                    <Text
                      className={`${
                        day === "RAB" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      RAB
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("KAM")}>
                    <Text
                      className={`${
                        day === "KAM" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      KAM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("JUM")}>
                    <Text
                      className={`${
                        day === "JUM" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      JUM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("SAB")}>
                    <Text
                      className={`${
                        day === "SAB" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      SAB
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-2 mb-2">
                  <TimeSlot day={day} />
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setNext(true);
              }}
              className="mt-3 mb-2 mx-6 bg-[#6895D2] py-3 flex items-center rounded-xl"
            >
              <Text className="text-xl text-textButton font-bold text-white">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-4 w-full">
            <View className="mx-6">
              <Text className="text-base">Unggah Foto Lapangan Anda</Text>
              <Text className="text-xs text-[#A7A2A2] mx-auto">
                Maks : 4 Foto
              </Text>
              <View className="flex flex-row justify-between mt-2">
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    borderWidth: 2,
                    borderColor: "#5f88c1",
                  }}
                  className="w-[48%] h-[100px] rounded-2xl border-dashed justify-center items-center"
                >
                  <SimpleLineIcons
                    name="cloud-upload"
                    size={28}
                    color="#5f88c1"
                    className="self-center"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    borderWidth: 2,
                    borderColor: "#5f88c1",
                  }}
                  className="w-[48%] h-[100px] rounded-2xl border-dashed justify-center items-center"
                >
                  <SimpleLineIcons
                    name="cloud-upload"
                    size={28}
                    color="#5f88c1"
                    className="self-center"
                  />
                </TouchableOpacity>
              </View>
              <View className="flex flex-row justify-between mt-2">
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    borderWidth: 2,
                    borderColor: "#5f88c1",
                  }}
                  className="w-[48%] h-[100px] rounded-2xl border-dashed justify-center items-center"
                >
                  <SimpleLineIcons
                    name="cloud-upload"
                    size={28}
                    color="#5f88c1"
                    className="self-center"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={{
                    borderWidth: 2,
                    borderColor: "#5f88c1",
                  }}
                  className="w-[48%] h-[100px] rounded-2xl border-dashed justify-center items-center"
                >
                  <SimpleLineIcons
                    name="cloud-upload"
                    size={28}
                    color="#5f88c1"
                    className="self-center"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Deskripsi Lapangan</Text>
              <TextInput
                placeholder="Enter Description"
                onChangeText={(text) => setVenueDescription(text)}
                multiline={true}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl h-[100px]"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Harga per jam</Text>
              <TextInput
                placeholder="For example : 85000"
                keyboardType="numeric"
                onChangeText={(text) => setVenuePrice(text)}
                value={venuePrice}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Nomor Whatsapp</Text>
              <TextInput
                placeholder="Whatsapp Number"
                keyboardType="numeric"
                onChangeText={(text) => setVenueDescription(text)}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
            <View className="mx-6 bg-[#E6EDF5] mt-3 rounded-xl border-[1px]">
              <View className="mx-2 my-2 flex justify-center items-center">
                <Text className="font-bold">Ketersediaan Waktu</Text>
                <View className="mt-1 flex-row justify-between gap-x-3">
                  <TouchableOpacity onPress={() => setDay("MIN")}>
                    <Text
                      className={`${
                        day === "MIN" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      MIN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("SEN")}>
                    <Text
                      className={`${
                        day === "SEN" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      SEN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("SEL")}>
                    <Text
                      className={`${
                        day === "SEL" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      SEL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("RAB")}>
                    <Text
                      className={`${
                        day === "RAB" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      RAB
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("KAM")}>
                    <Text
                      className={`${
                        day === "KAM" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      KAM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("JUM")}>
                    <Text
                      className={`${
                        day === "JUM" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      JUM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setDay("SAB")}>
                    <Text
                      className={`${
                        day === "SAB" ? "text-black" : "text-[#CF7575]"
                      }`}
                    >
                      SAB
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-2 mb-2">
                  <TimeSlot day={day} />
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setNext(true);
              }}
              className="mt-3 mb-2 mx-6 bg-[#6895D2] py-3 flex items-center rounded-xl"
            >
              <Text className="text-xl text-textButton font-bold text-white">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
