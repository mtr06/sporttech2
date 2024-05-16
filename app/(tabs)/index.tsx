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
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";

const images = [
  { id: "1", src: require("../../assets/images/iklan1.png") },
  { id: "2", src: require("../../assets/images/iklan2.png") },
  { id: "3", src: require("../../assets/images/iklan3.png") },
];

export default function HomeScreen() {
  const [isPressedFutsal, setIsPressedFutsal] = useState<boolean>(true);
  const [isPressedBadminton, setIsPressedBadminton] = useState<boolean>(false);
  const [isPressedBasket, setIsPressedBasket] = useState<boolean>(false);
  const [isPressedTennis, setIsPressedTennis] = useState<boolean>(false);
  const router = useRouter();
  return (
    <View className="flex flex-1 mx-2">
      <Header router={router} />
      {/* Iklan */}
      <View className="flex mt-2 h-[30%]">
        <Swiper
          style={styles.wrapper}
          showsButtons
          loop
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
        >
          {images.map((image, index) => (
            <View style={styles.slide} key={index}>
              <Image
                source={image.src}
                style={styles.image}
                className="h-full"
              />
            </View>
          ))}
        </Swiper>
        <Text></Text>
      </View>
      {/* Search & Filter */}
      <View className="flex-row justify-between mx-1">
        <View className="border-2 border-slate-600 rounded-lg w-[87.5%]">
          <View className="flex-row mx-1 my-1 w-full">
            <TouchableOpacity onPress={() => router} className="self-center">
              <FontAwesome name="search" size={24} color="rgba(0,0,0,.6)" />
            </TouchableOpacity>
            <TextInput
              placeholder="Search"
              className="mx-2 text-lg self-center"
            ></TextInput>
          </View>
        </View>
        <View className="w-[10%] self-center items-center">
          <TouchableOpacity onPress={() => router}>
            <MaterialCommunityIcons
              name="filter-outline"
              size={32}
              color="rgba(0,0,0,.7)"
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Kategori */}
      <View className="mt-3 flex flex-row justify-between mx-2">
        <TouchableOpacity
          onPress={() => {
            setIsPressedFutsal(true);
            setIsPressedBadminton(false);
            setIsPressedBasket(false);
            setIsPressedTennis(false);
          }}
          style={{
            backgroundColor: isPressedFutsal ? "#70E2DF" : "transparent",
          }}
          className="min-w-[20%] rounded-xl"
        >
          <Text className="text-lg text-textButton font-bold text-center">
            Futsal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsPressedFutsal(false);
            setIsPressedBadminton(true);
            setIsPressedBasket(false);
            setIsPressedTennis(false);
          }}
          style={{
            backgroundColor: isPressedBadminton ? "#70E2DF" : "transparent",
          }}
          className="min-w-[27%] rounded-xl"
        >
          <Text className="text-lg text-textButton font-bold text-center">
            Badminton
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsPressedFutsal(false);
            setIsPressedBadminton(false);
            setIsPressedBasket(true);
            setIsPressedTennis(false);
          }}
          style={{
            backgroundColor: isPressedBasket ? "#70E2DF" : "transparent",
          }}
          className="min-w-[20%] rounded-xl"
        >
          <Text className="text-lg text-textButton font-bold text-center">
            Basket
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsPressedFutsal(false);
            setIsPressedBadminton(false);
            setIsPressedBasket(false);
            setIsPressedTennis(true);
          }}
          style={{
            backgroundColor: isPressedTennis ? "#70E2DF" : "transparent",
          }}
          className="min-w-[20%] rounded-xl"
        >
          <Text className="text-lg text-textButton font-bold text-center">
            Tennis
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="h-fit">
        <View className="mt-2 flex flex-row h-[120px] bg-[#E6EDF5] shadow-lg shadow-slate-800 rounded-xl">
          {/* Image */}
          <Image
            source={require("../../assets/images/futsal1.png")}
            className="mx-1 my-auto rounded-lg h-[100px] w-[24%]"
          />
          {/* Data */}
          <View className="flex flex-col self-center w-[72%]">
            {/* Nama Lapangan */}
            <Text className="text-lg font-bold text-center">
              Lapangan Garuda
            </Text>
            {/* Alamat */}
            <Text className="text-xs text-center">
              Jalan Garuda Nusantara, Dago, Bandung
            </Text>
            {/* Harga */}
            <Text className="text-xs text-center">Rp 100.000/jam</Text>
            <View className="flex flex-row self-end mx-3">
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
            </View>
            <TouchableOpacity
              onPress={() => router}
              className="self-end bg-[#FDE767] w-[41%] h-[22%] rounded-xl items-center"
            >
              <Text className="font-bold text-center">Book Now !</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-2 flex flex-row h-[120px] bg-[#E6EDF5] shadow-lg shadow-slate-800 rounded-xl">
          {/* Image */}
          <Image
            source={require("../../assets/images/futsal2.png")}
            className="mx-1 my-auto rounded-lg h-[100px] w-[24%]"
          />
          {/* Data */}
          <View className="flex flex-col self-center mx-auto">
            {/* Nama Lapangan */}
            <Text className="text-lg font-bold text-center">
              Futsal Senayan
            </Text>
            {/* Alamat */}
            <Text className="text-xs text-center">
              Jalan Patal Senayan, Kebayoran, Jakarta Selatan
            </Text>
            {/* Harga */}
            <View className="flex-row justify-center gap-x-2">
              <Text
                className="text-xs text-center"
                style={{
                  textDecorationLine: "line-through",
                }}
              >
                Rp 150.000/jam
              </Text>
              <Text className="text-xs text-center">Rp 135.000/jam</Text>
            </View>

            <View className="flex flex-row self-end mx-3">
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#626262" />
            </View>
            <TouchableOpacity
              onPress={() => router}
              className="self-end bg-[#FDE767] w-[44%] h-[22%] rounded-xl items-center"
            >
              <Text className="font-bold text-center">Book Now !</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-2 flex flex-row h-[120px] bg-[#E6EDF5] shadow-lg shadow-slate-800 rounded-xl">
          {/* Image */}
          <Image
            source={require("../../assets/images/futsal3.png")}
            className="mx-1 my-auto rounded-lg h-[100px] w-[23%]"
          />
          {/* Data */}
          <View className="flex flex-col self-center mx-auto w-[71%]">
            {/* Nama Lapangan */}
            <Text className="text-lg font-bold text-center">
              Lapangan Futsal Meruya
            </Text>
            {/* Alamat */}
            <Text className="text-xs text-center">
              Jalan Meruya Selatan, Kembangan, Jakarta Barat
            </Text>
            {/* Harga */}
            <Text className="text-xs text-center">Rp 50.000/jam</Text>
            <View className="flex flex-row self-end mx-3">
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#626262" />
            </View>
            <TouchableOpacity
              onPress={() => router}
              className="self-end bg-[#FDE767] w-[44%] h-[22%] rounded-xl items-center"
            >
              <Text className="font-bold text-center">Book Now !</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="my-2 flex flex-row h-[120px] bg-[#E6EDF5] shadow-lg shadow-slate-800 rounded-xl">
          {/* Image */}
          <Image
            source={require("../../assets/images/futsal1.png")}
            className="mx-1 my-auto rounded-lg h-[100px]"
          />
          {/* Data */}
          <View className="flex flex-col self-center mx-auto">
            {/* Nama Lapangan */}
            <Text className="text-lg font-bold text-center">Go Futsal</Text>
            {/* Alamat */}
            <Text className="text-xs text-center">
              Jalan Palmerah Utara no 10, Grogol Utara, Jaka...
            </Text>
            {/* Harga */}
            <Text className="text-xs text-center">Rp 100.000/jam</Text>
            <View className="flex flex-row self-end mx-3">
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#DFB300" />
              <MaterialIcons name="star-rate" size={18} color="#626262" />
            </View>
            <TouchableOpacity
              onPress={() => router}
              className="self-end bg-[#FDE767] w-[44%] h-[22%] rounded-xl items-center"
            >
              <Text className="font-bold text-center">Book Now !</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 10,
  },
  dot: {
    backgroundColor: "rgba(255,255,255,.2)",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
  },
  starContainer: {},
  blackStar: {
    backgroundColor: "#E6EDF5",
    position: "absolute",
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
});
