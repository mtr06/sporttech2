import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import Header from "@/components/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import Swiper from "react-native-swiper";

import {
  FontAwesome,
  Ionicons,
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
  const [iklan, setIklan] = useState<any>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [rating, setRating] = useState<number>();
  const [harga, setHarga] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isScroll, setIsScroll] = useState<boolean>(false);
  const router = useRouter();
  const user = getAuth().currentUser;
  const params = useLocalSearchParams();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setIsScroll(false);
    }, 1000);
  }, []);

  const fetchIklan = () => {
    const q = query(collection(db, "iklanPromosi"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const iklanData: any = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        iklanData[id] = data;
        console.log(doc.data());
      });
      setIklan(iklanData);
    });
    return unsub;
  };

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

  const resultsSearch = () => {
    return Object.values(lapangan).filter(
      (item: any) =>
        (!jenisLapangan || item.kategori == jenisLapangan) &&
        (rating ? item.rating >= rating : true) &&
        (harga
          ? harga == 1
            ? item.harga <= 50000
            : harga == 2
            ? item.harga <= 100000 && item.harga > 50000
            : harga == 3
            ? item.harga <= 150000 && item.harga > 100000
            : item.harga >= 150000
          : true) &&
        (item.namaLapangan.toLowerCase().includes(search.toLowerCase()) ||
          item.alamat.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const filterKategori = () => {
    return Object.values(lapangan).filter(
      (item: any) =>
        (!jenisLapangan || item.kategori == jenisLapangan) &&
        (rating ? item.rating >= rating : true) &&
        (harga
          ? harga == 1
            ? item.harga <= 50000
            : harga == 2
            ? item.harga <= 100000 && item.harga > 50000
            : harga == 3
            ? item.harga <= 150000 && item.harga > 100000
            : item.harga >= 150000
          : true)
    );
  };

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

    return formattedAmount;
  };

  const renderStarRate = (rating: number) => {
    console.log(iklan);
    console.log(rating);
    const starRate = [];
    if (rating == 5) {
      for (let i = 0; i < 5; i++) {
        starRate.push(
          <MaterialIcons key={i} name="star-rate" size={18} color="#DFB300" />
        );
      }
    } else if (rating == 0) {
      for (let i = 0; i < 5; i++) {
        starRate.push(
          <MaterialIcons key={i} name="star-border" size={18} color="#DFB300" />
        );
      }
    } else {
      for (let i = 1; i <= rating; i++) {
        starRate.push(
          <MaterialIcons key={i} name="star-rate" size={18} color="#DFB300" />
        );
      }
      if (rating - Math.floor(rating) > 0) {
        starRate.push(
          <MaterialIcons
            key={Math.floor(rating) + 1}
            name="star-half"
            size={18}
            color="#DFB300"
          />
        );
      }
      for (let i = 1; i <= 5 - rating; i++) {
        starRate.push(
          <MaterialIcons
            key={i + Math.floor(rating) + 1}
            name="star-border"
            size={18}
            color="#DFB300"
          />
        );
      }
    }
    return starRate;
  };

  useEffect(() => {
    fetchIklan();
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
      {isScroll ? (
        ""
      ) : (
        <View className="flex mt-2 h-[30%]">
          <Swiper
            style={styles.wrapper}
            showsButtons
            loop
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
          >
            {Object.values(iklan).map((item: any) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/reservation",
                    params: { id: item.idLapangan },
                  })
                }
              >
                <Image
                  source={{ uri: item.gambarIklan }}
                  style={styles.image}
                  className="mx-2 h-full"
                />
              </TouchableOpacity>
            ))}
          </Swiper>
          <Text></Text>
        </View>
      )}
      {/* Search & Filter */}
      {isFilter ? (
        <View
          className={`${
            isScroll ? "mt-4" : ""
          } bg-[#E6EDF5] flex flex-col rounded-xl border-[1px]`}
        >
          <View className="mx-2 mt-1 flex flex-row items-center justify-end">
            <Text className="text-2xl font-bold mx-auto">Filter</Text>
            <TouchableOpacity
              onPress={() => {
                setRating(NaN);
                setHarga(NaN);
                setIsFilter(false);
              }}
            >
              <Ionicons name="close" size={32} color="black" className="r-0" />
            </TouchableOpacity>
          </View>
          <View className="mx-3">
            <Text className="text-lg font-bold">Bintang</Text>
            <View className="my-2 flex flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => (rating == 1 ? setRating(NaN) : setRating(1))}
                className={`${
                  rating === 1 ? "bg-[#24A0ED]" : "bg-white"
                } border-[1.2px] px-3 py-1 flex flex-row rounded-xl`}
              >
                <MaterialIcons name="star-rate" size={18} color="#DFB300" />
                <Text>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => (rating == 2 ? setRating(NaN) : setRating(2))}
                className={`${
                  rating === 2 ? "bg-[#24A0ED]" : "bg-white"
                } border-[1.2px] px-3 py-1 flex flex-row rounded-xl`}
              >
                <MaterialIcons name="star-rate" size={18} color="#DFB300" />
                <Text>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => (rating == 3 ? setRating(NaN) : setRating(3))}
                className={`${
                  rating === 3 ? "bg-[#24A0ED]" : "bg-white"
                } border-[1.2px] px-3 py-1 flex flex-row rounded-xl`}
              >
                <MaterialIcons name="star-rate" size={18} color="#DFB300" />
                <Text>3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => (rating == 4 ? setRating(NaN) : setRating(4))}
                className={`${
                  rating === 4 ? "bg-[#24A0ED]" : "bg-white"
                } border-[1.2px] px-3 py-1 flex flex-row rounded-xl`}
              >
                <MaterialIcons name="star-rate" size={18} color="#DFB300" />
                <Text>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => (rating == 5 ? setRating(NaN) : setRating(5))}
                className={`${
                  rating === 5 ? "bg-[#24A0ED]" : "bg-white"
                } border-[1.2px] px-3 py-1 flex flex-row rounded-xl`}
              >
                <MaterialIcons name="star-rate" size={18} color="#DFB300" />
                <Text>5</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-lg font-bold">Harga</Text>
            <View className="px-2 py-1 rounded-lg flex flex-row mt-2 bg-white">
              <Text className="text-md text-[#757575] self-center">
                Rp 0 - Rp 50.000
              </Text>
              <TouchableOpacity
                onPress={() => (harga == 1 ? setHarga(NaN) : setHarga(1))}
                className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
              >
                {harga === 1 ? (
                  <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                ) : (
                  ""
                )}
              </TouchableOpacity>
            </View>
            <View className="px-2 py-1 rounded-lg flex flex-row mt-2 bg-white">
              <Text className="text-md text-[#757575] self-center">
                Rp 50.000 - Rp 100.000
              </Text>
              <TouchableOpacity
                onPress={() => (harga == 2 ? setHarga(NaN) : setHarga(2))}
                className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
              >
                {harga === 2 ? (
                  <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                ) : (
                  ""
                )}
              </TouchableOpacity>
            </View>
            <View className="px-2 py-1 rounded-lg flex flex-row mt-2 bg-white">
              <Text className="text-md text-[#757575] self-center">
                Rp 100.000 - Rp 150.000
              </Text>
              <TouchableOpacity
                onPress={() => (harga == 3 ? setHarga(NaN) : setHarga(3))}
                className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
              >
                {harga === 3 ? (
                  <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                ) : (
                  ""
                )}
              </TouchableOpacity>
            </View>
            <View className="px-2 py-1 rounded-lg flex flex-row mt-2 bg-white">
              <Text className="text-md text-[#757575] self-center">
                {">"} Rp 150.000
              </Text>
              <TouchableOpacity
                onPress={() => (harga == 4 ? setHarga(NaN) : setHarga(4))}
                className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
              >
                {harga === 4 ? (
                  <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                ) : (
                  ""
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setRating(NaN);
                setHarga(NaN);
              }}
              className=" bg-[#808080]/50 rounded-lg py-1 mt-6 items-center justify-center"
            >
              <Text className="text-xl font-bold">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFilter(false)}
              className="mb-[22%] bg-[#FDE767] rounded-lg py-1 mt-3 items-center justify-center"
            >
              <Text className="text-xl font-bold">Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View
            className={`${
              isScroll ? "mt-4" : ""
            } flex-row justify-between mx-1`}
          >
            <View className="border-2 border-slate-600 rounded-lg w-[87.5%]">
              <View className="flex-row mx-1 my-1 w-full">
                <TouchableOpacity
                  onPress={() => setIsSearch(search !== "")}
                  className="self-center"
                >
                  <FontAwesome name="search" size={24} color="rgba(0,0,0,.6)" />
                </TouchableOpacity>
                <TextInput
                  placeholder="Search"
                  onChangeText={(text) => {
                    setSearch(text);
                    setIsSearch(text !== "");
                  }}
                  className="mx-2 text-lg w-[80%] self-center"
                ></TextInput>
              </View>
            </View>
            <View className="w-[10%] self-center items-center">
              <TouchableOpacity
                onPress={() => setIsFilter(true)}
                className={`${
                  rating
                    ? "bg-[#70E2DF] border-2"
                    : harga
                    ? "bg-[#70E2DF] border-2"
                    : ""
                } rounded-lg`}
              >
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
          <ScrollView
            className="mx-2 mt-2 h-fit"
            onScroll={() => setIsScroll(true)}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Berdasarkan query */}
            {isSearch
              ? resultsSearch().map((item: any) => (
                  <View
                    key={item.id}
                    className="mt-2 px-2 flex flex-row h-[120px] bg-[#C9E2FF] rounded-xl border-2 border-slate-400"
                  >
                    {/* Image */}
                    <Image
                      source={
                        item.gambar[1]
                          ? { uri: item.gambar[1] }
                          : item.gambar[2]
                          ? { uri: item.gambar[2] }
                          : item.gambar[3]
                          ? { uri: item.gambar[3] }
                          : { uri: item.gambar[4] }
                      }
                      className="my-auto rounded-lg h-[100px] w-[23%]"
                    />
                    {/* Data */}
                    <View className="flex flex-col self-center mx-auto w-[71%]">
                      {/* Nama Lapangan */}
                      <Text className="text-lg font-bold text-start">
                        {item.namaLapangan}
                      </Text>
                      {/* Alamat */}
                      <Text className="text-xs text-start">{item.alamat}</Text>
                      {/* Harga */}
                      <Text className="text-xs text-start">
                        {formatCurrency(item.harga)}
                        /jam
                      </Text>
                      <View className="w-[44%] flex flex-row items-center justify-center self-end">
                        {renderStarRate(item.rating)}
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/reservation",
                            params: { id: item.id },
                          })
                        }
                        className="self-end bg-[#FDE767] w-[44%] h-[22%] rounded-xl items-center"
                      >
                        <Text className="font-bold text-center">
                          Book Now !
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              : filterKategori().map((item: any) => (
                  <View
                    key={item.id}
                    className="mt-2 px-2 flex flex-row h-[120px] bg-[#C9E2FF] rounded-xl border-2 border-slate-400"
                  >
                    {/* Image */}
                    <Image
                      source={
                        item.gambar[1]
                          ? { uri: item.gambar[1] }
                          : item.gambar[2]
                          ? { uri: item.gambar[2] }
                          : item.gambar[3]
                          ? { uri: item.gambar[3] }
                          : { uri: item.gambar[4] }
                      }
                      className="my-auto rounded-lg h-[100px] w-[23%]"
                    />
                    {/* Data */}
                    <View className="flex flex-col self-center mx-auto w-[71%]">
                      {/* Nama Lapangan */}
                      <Text className="text-lg font-bold text-start">
                        {item.namaLapangan}
                      </Text>
                      {/* Alamat */}
                      <Text className="text-xs text-start">{item.alamat}</Text>
                      {/* Harga */}
                      <Text className="text-xs text-start">
                        {formatCurrency(item.harga)}
                        /jam
                      </Text>
                      <View className="w-[44%] flex flex-row items-center justify-center self-end">
                        {/* <MaterialIcons name="star-rate" size={18} color="#DFB300" />
                    <MaterialIcons name="star-rate" size={18} color="#DFB300" />
                    <MaterialIcons name="star-rate" size={18} color="#DFB300" />
                    <MaterialIcons name="star-half" size={18} color="#DFB300" />
                    <MaterialIcons
                      name="star-border"
                      size={18}
                      color="#DFB300"
                    /> */}
                        {renderStarRate(item.rating)}
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/reservation",
                            params: { id: item.id },
                          })
                        }
                        className="self-end bg-[#FDE767] w-[44%] h-[22%] rounded-xl items-center"
                      >
                        <Text className="font-bold text-center">
                          Book Now !
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
          </ScrollView>
        </>
      )}
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
    width: 18,
    height: 18,
    ...StyleSheet.absoluteFillObject,
  },
});
function fetchOwnerData() {
  throw new Error("Function not implemented.");
}

function setProfile(arg0: DocumentData) {
  throw new Error("Function not implemented.");
}
