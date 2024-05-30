import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import Header from "@/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import Swiper from "react-native-swiper";

import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  DocumentData,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebaseConfig";

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
  const [jenisLapangan, setJenisLapangan] = useState<any>("Futsal");
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [lapangan, setLapangan] = useState<any>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const user = getAuth().currentUser;
  const params = useLocalSearchParams();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchLapangan = () => {
    const q = query(collection(db, "lapangan"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const lapanganData: any = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        lapanganData[id] = data;
        console.log(doc.data());
      });
      setLapangan(lapanganData);
    });
    setLoading(false);
    return unsub;
  };

  useEffect(() => {
    fetchLapangan();
  }, [user]);

  if (loading) {
    return (
      <Text className="w-full align-middle text-center text-xl font-bold">
        Loading...
      </Text>
    );
  }

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
            setJenisLapangan("Futsal");
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
            setJenisLapangan("Badminton");
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
            setJenisLapangan("Basket");
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
            setJenisLapangan("Tennis");
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
      <ScrollView className="mx-2 mt-2 h-fit">
        {/* Berdasarkan query */}
        {Object.keys(lapangan).map((id) =>
          lapangan[id].kategori === jenisLapangan ? (
            <View
              key={id}
              className="mt-2 px-2 flex flex-row h-[120px] bg-[#C9E2FF] rounded-xl border-2 border-slate-400"
            >
              {/* Image */}
              <Image
                source={
                  lapangan[id].gambar[1] != ""
                    ? { uri: lapangan[id].gambar[1] }
                    : lapangan[id].gambar[2] != ""
                    ? { uri: lapangan[id].gambar[2] }
                    : lapangan[id].gambar[3] != ""
                    ? { uri: lapangan[id].gambar[3] }
                    : { uri: lapangan[id].gambar[4] }
                }
                className="my-auto rounded-lg h-[100px] w-[23%]"
              />
              {/* Data */}
              <View className="flex flex-col self-center mx-auto w-[71%]">
                {/* Nama Lapangan */}
                <Text className="text-lg font-bold text-start">
                  {lapangan[id].namaLapangan}
                </Text>
                {/* Alamat */}
                <Text className="text-xs text-start">
                  {lapangan[id].alamat}
                </Text>
                {/* Harga */}
                <Text className="text-xs text-start">
                  Rp {lapangan[id].harga}/jam
                </Text>
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
          ) : (
            ""
          )
        )}
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
function fetchOwnerData() {
  throw new Error("Function not implemented.");
}

function setProfile(arg0: DocumentData) {
  throw new Error("Function not implemented.");
}
