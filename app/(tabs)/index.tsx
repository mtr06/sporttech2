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

const images = [
  { id: "1", src: require("../../assets/images/iklan1.png") },
  { id: "2", src: require("../../assets/images/iklan2.png") },
  { id: "3", src: require("../../assets/images/iklan3.png") },
];

const lapangan = [
  {
    type: "futsal",
    id: "1",
    src: require("../../assets/images/futsal1.png"),
    nama: "Futsal Garuda",
    alamat: "Jalan Garuda Nusantara, Dago, Bandung",
    isPromo: false,
    hargaAsli: 100000,
    hargaPromo: 0,
    rating: 5,
  },
  {
    type: "futsal",
    id: "2",
    src: require("../../assets/images/futsal2.png"),
    nama: "Futsal Senayan",
    alamat: "Jalan Patal Senayan, Kebayoran, Jakarta Selatan",
    isPromo: true,
    hargaAsli: 150000,
    hargaPromo: 135000,
    rating: 4,
  },
  {
    type: "futsal",
    id: "3",
    src: require("../../assets/images/futsal3.png"),
    nama: "Lapangan Futsal Meruya",
    alamat: "Jalan Meruya Selatan, Kembangan, Jakarta Barat",
    isPromo: false,
    hargaAsli: 50000,
    hargaPromo: 0,
    rating: 4,
  },
  {
    type: "futsal",
    id: "4",
    src: require("../../assets/images/futsal4.png"),
    nama: "Go Futsal",
    alamat: "Jalan Palmerah Utara no 10, Grogol Utara,...",
    isPromo: false,
    hargaAsli: 85000,
    hargaPromo: 0,
    rating: 4,
  },
  {
    type: "badminton",
    id: "1",
    src: require("../../assets/images/badminton1.png"),
    nama: "Tangkas",
    alamat: "Jalan Tanjung Duren Utara, Grogol, Jakar...",
    isPromo: false,
    hargaAsli: 89000,
    hargaPromo: 0,
    rating: 5,
  },
  {
    type: "badminton",
    id: "2",
    src: require("../../assets/images/badminton2.png"),
    nama: "Box to Box",
    alamat: "Jalan Pluit Raya no 23, Tanjung Priok,...",
    isPromo: false,
    hargaAsli: 90000,
    hargaPromo: 0,
    rating: 4.5,
  },
  {
    type: "badminton",
    id: "3",
    src: require("../../assets/images/badminton3.png"),
    nama: "Gor Cisitu",
    alamat: "Jalan Cisitu Raya no 22, Cisitu Lama, ...",
    isPromo: false,
    hargaAsli: 80000,
    hargaPromo: 0,
    rating: 4,
  },
  {
    type: "badminton",
    id: "4",
    src: require("../../assets/images/badminton4.png"),
    nama: "Gor PDAM",
    alamat: "Jalan Ganesha no 88, Dago, Bandung",
    isPromo: false,
    hargaAsli: 70000,
    hargaPromo: 0,
    rating: 4,
  },
  {
    type: "basket",
    id: "1",
    src: require("../../assets/images/basket1.png"),
    nama: "Lapangan Basket Garuda",
    alamat: "Jalan Tanah Abang 45, Kota, Jakarta P...",
    isPromo: false,
    hargaAsli: 150000,
    hargaPromo: 0,
    rating: 5,
  },
  {
    type: "basket",
    id: "2",
    src: require("../../assets/images/basket2.png"),
    nama: "Sport Center Gading",
    alamat: "Jalan Gading Kirana no 10, Kelapa Ga...",
    isPromo: false,
    hargaAsli: 100000,
    hargaPromo: 0,
    rating: 4,
  },
  {
    type: "basket",
    id: "3",
    src: require("../../assets/images/basket3.png"),
    nama: "Art Basket",
    alamat: "Jalan Saparua, Dago, Bandung",
    isPromo: false,
    hargaAsli: 80000,
    hargaPromo: 0,
    rating: 4,
  },
  {
    type: "basket",
    id: "4",
    src: require("../../assets/images/basket4.png"),
    nama: "Indoor Basket Bandung",
    alamat: "Jalan Pasir Kaliki 88, Cimahi Utara,...",
    isPromo: false,
    hargaAsli: 100000,
    hargaPromo: 0,
    rating: 4,
  },
  {
    type: "tennis",
    id: "1",
    src: require("../../assets/images/tennis1.png"),
    nama: "Lapangan Tennis Senayan",
    alamat: "Jalan Sumatra Selatan no 46, Grogol ...",
    isPromo: false,
    hargaAsli: 100000,
    hargaPromo: 0,
    rating: 5,
  },
  {
    type: "tennis",
    id: "2",
    src: require("../../assets/images/tennis2.png"),
    nama: "Tennis Puri",
    alamat: "Puri Indah Mall lt. LG, Kembangan, Ja...",
    isPromo: false,
    hargaAsli: 100000,
    hargaPromo: 0,
    rating: 4.5,
  },
  {
    type: "tennis",
    id: "3",
    src: require("../../assets/images/tennis3.png"),
    nama: "Sport Center Pondok Indah",
    alamat: "Jalan Pondok Indah Raya 23, Jakarta Se...",
    isPromo: false,
    hargaAsli: 150000,
    hargaPromo: 0,
    rating: 4,
  },
  {
    type: "tennis",
    id: "4",
    src: require("../../assets/images/tennis4.png"),
    nama: "SCBD Tennis Club",
    alamat: "Jalan Kuningan Raya 77, Semanggi, Jak...",
    isPromo: false,
    hargaAsli: 250000,
    hargaPromo: 0,
    rating: 4,
  },
];

export default function HomeScreen() {
  const [isPressedFutsal, setIsPressedFutsal] = useState<boolean>(true);
  const [isPressedBadminton, setIsPressedBadminton] = useState<boolean>(false);
  const [isPressedBasket, setIsPressedBasket] = useState<boolean>(false);
  const [isPressedTennis, setIsPressedTennis] = useState<boolean>(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  
  return (
    <View className="flex flex-1 mx-2">
      <Header user={params} router={router} />
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
      <ScrollView className="mt-2 h-fit">
      {lapangan.map((item) => (
        <View key={`${item.type}-${item.id}`} className="my-2 flex flex-row h-[120px] bg-[#E6EDF5] shadow-lg shadow-slate-800 rounded-xl">
          {/* Image */}
          <Image
            source={item.src}
            className="mx-1 my-auto rounded-lg h-[100px]"
          />
          {/* Data */}
          <View className="flex flex-col self-center mx-auto">
            {/* Nama Lapangan */}
            <Text className="text-lg font-bold text-center">{item.nama}</Text>
            {/* Alamat */}
            <Text className="text-xs text-center">{item.alamat}</Text>
            {/* Harga */}
            <Text className="text-xs text-center">Rp {item.hargaAsli.toLocaleString()}/jam</Text>
            <View className="flex flex-row self-end mx-3">
              {Array.from({ length: 5 }, (_, i) => (
                <MaterialIcons
                  key={i}
                  name="star-rate"
                  size={18}
                  color={i < item.rating ? "#DFB300" : "#626262"}
                />
              ))}
            </View>
            <TouchableOpacity
            onPress={() => {
              console.log(item.id); // Log the item.id
              router.push({ pathname: "/reservation", params: { id: item.id } });
            }}
              className="self-end bg-[#FDE767] w-[44%] h-[22%] rounded-xl items-center"
            >
              <Text className="font-bold text-center">Book00000000 !</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
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
              onPress={() => router.push({ pathname: "/reservation", params: { id: "1" } })}
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
