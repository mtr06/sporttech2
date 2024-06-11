import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  Share,
  Alert,
  Linking,
} from "react-native";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import Swiper from "react-native-swiper";
import { Fontisto, MaterialIcons, Octicons } from "@expo/vector-icons";
import { AbhayaLibre_400Regular } from "@expo-google-fonts/abhaya-libre";

const daysOfWeek = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
const timeSlots = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

interface AvailableSlots {
  [day: string]: {
    [hour: string]: boolean;
  };
}

const getDayName = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  return new Intl.DateTimeFormat("id-ID", options).format(date); // 'id-ID' untuk Bahasa Indonesia
};

const getDayShortName = (dayIndex: number): string => {
  const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
  return dayNames[dayIndex];
};

export default function App() {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>({});
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>("MIN");
  const [harga, setHarga] = useState<number>(0);
  const [nama, setNama] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [gambar, setGambar] = useState<any>({});
  const [currentDay, setCurrentDay] = useState<string>();
  const [indexDay, setIndexDay] = useState<number>();
  const [whatsappNumber, setWhatsappNumber] = useState<number>();
  const [valueRating, setValueRating] = useState<number>();
  const params = useLocalSearchParams();
  const router = useRouter();
  const id: string = params.id as string;

  const renderStarRate = (rating: number) => {
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
    const today = new Date();
    const dayIndex = today.getDay();
    const dayName = getDayShortName(dayIndex);
    setIndexDay(dayIndex);
    setCurrentDay(dayName);
    setSelectedDay(dayName);
    const fetchTimeSlots = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, "lapangan", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().timeAvailable;
          const harga = docSnap.data().harga;
          const nama = docSnap.data().namaLapangan;
          setGambar(docSnap.data().gambar);
          setAvailableSlots(data);
          setAlamat(docSnap.data().alamat);
          setDeskripsi(docSnap.data().deskripsi);
          setHarga(harga);
          setNama(nama);
          setValueRating(docSnap.data().rating);
          setWhatsappNumber(docSnap.data().whatsapp);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchTimeSlots();
  }, [id]);

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
    console.log(gambar);
  };

  const handleSelectTime = (time: string) => {
    if (!selectedDay) return;
    const slot = `${selectedDay}_${time}`;
    setSelectedTimes((prev) => {
      const newSelectedTimes = prev.includes(slot)
        ? prev.filter((t) => t !== slot)
        : [...prev, slot];
      calculatePrice(newSelectedTimes);
      return newSelectedTimes;
    });
  };

  const calculatePrice = (selectedTimes: string[]) => {
    const price = selectedTimes.length * harga;
    setTotalPrice(price);
  };

  const handleBookSlots = () => {
    if (!selectedTimes.length) return;

    router.push({
      pathname: "payment",
      params: { id, nama, harga, totalPrice, selectedTimes },
    });
  };

  const formatCurrency = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

    return formattedAmount;
  };

  const renderDayForSelect = (day: string) => (
    <View key={day}>
      <TouchableOpacity onPress={() => handleSelectDay(day)}>
        <Text
          style={[styles.dayTitle, selectedDay === day && styles.selectedDay]}
        >
          {day}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTimeSlotsForDay = (day: string) => (
    <View key={day}>
      <View className="flex flex-row flex-wrap justify-center gap-4">
        {selectedDay === day &&
          timeSlots.map((time) => {
            const slot = `${day}_${time}`;
            const hour = parseInt(time.split(":")[0], 10);
            const isAvailable =
              availableSlots[day] && availableSlots[day][hour] !== undefined
                ? availableSlots[day][hour]
                : false;
            const isBookable = isAvailable !== false;
            return (
              <TouchableOpacity
                key={slot}
                onPress={() => handleSelectTime(time)}
                disabled={!isBookable}
              >
                <Text
                  style={[
                    styles.timeSlot,
                    {
                      backgroundColor: selectedTimes.includes(slot)
                        ? "#EADD2C"
                        : isAvailable
                        ? "#B6D8B9"
                        : "#CF7575",
                    },
                  ]}
                  className="py-2 border rounded-lg"
                >
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "SportTech | An application that can be used to make online reservations for futsal, badminton, basketball, and tennis courts so that customers do not need to come directly to their place to book a court. \n https://expo.dev/accounts/mthoriqr/projects/sporttech",
        url: "https://expo.dev/accounts/mthoriqr/projects/sporttech",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <ScrollView>
      <View className="mt-2 mx-4">
        <Header user={params} router={router} />
        {/* Iklan */}
        <View className="flex mt-2">
          <Swiper
            style={styles.wrapper}
            showsButtons
            loop
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
          >
            {Object.keys(gambar).map((key, index) => (
              <Image
                key={key}
                source={{ uri: gambar[key] }}
                style={styles.image}
                className="h-[220px] my-auto"
              />
            ))}
          </Swiper>
          <Text></Text>
        </View>
      </View>
      <View className="w-[44%] flex flex-row items-center justify-center self-center">
        {renderStarRate(valueRating || 0)}
      </View>
      <View className="flex w-[100%] flex-row">
        <View className="mx-auto w-[60%]">
          <Text className="text-xl font-semibold text-center text-wrap">
            {nama}
          </Text>
          <Text className="text-center text-wrap">{alamat}</Text>
        </View>
        <View
          className="flex flex-row mx-6 self-center gap-x-3"
          style={{ position: "absolute", right: 0 }}
        >
          <TouchableOpacity className="self-center" onPress={onShare}>
            <Octicons name="share-android" size={26} color="#6895D2" />
          </TouchableOpacity>
          <TouchableOpacity
            className="self-center"
            onPress={() => {
              Linking.openURL(
                `https://wa.me/${whatsappNumber?.toString().substring(1)}`
              ).catch((err) => console.error("Error opening URL:", err));
            }}
          >
            <Fontisto name="whatsapp" size={26} color="#6895D2" />
          </TouchableOpacity>
        </View>
      </View>
      <View
        className="bg-[#E6EDF5] mx-4 py-3 mt-2 drop-shadow-md pb-6"
        style={styles.rectangleView}
      >
        <Text className="text-lg font-bold text-center">Reservasi</Text>
        <View className="mx-3 flex justify-center items-center">
          <View className="px-6 flex flex-row justify-between w-full mb-2">
            {daysOfWeek.map((day) => renderDayForSelect(day))}
          </View>
        </View>
        <View className="mx-4 flex flex-col items-center justify-center">
          {daysOfWeek.map((day) => renderTimeSlotsForDay(day))}
        </View>
      </View>
      <View
        className="bg-[#E6EDF5] mx-4 py-3 mt-3 drop-shadow-md pb-6"
        style={styles.rectangleView}
      >
        <Text className="text-lg font-bold text-center">Deskripsi</Text>
        <Text className="mx-6 mt-2 text-md text-justify">{deskripsi}</Text>
      </View>
      <View className="py-3 mt-4 bg-[#B6D8B9] flex flex-row justify-between">
        <View className="mx-6">
          <Text className="text-sm">Total Pembayaran</Text>
          <Text className="text-md self-center font-bold">
            {formatCurrency(totalPrice)}
          </Text>
        </View>
        <View className="mx-6 self-center">
          <TouchableOpacity
            className="bg-[#FDE767] px-8 rounded-xl"
            onPress={handleBookSlots}
          >
            <Text className="text-lg font-semibold">Bayar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rectangleView: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    borderRadius: 10,
    backgroundColor: "#D4E8FF",
  },
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 3,
    textAlign: "center",
  },
  calendar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayColumn: {
    flex: 1,
    alignItems: "center",
  },
  dayTitle: {
    color: "#CF7575",
  },
  timeSlot: {
    padding: 10,
    width: 60,
    textAlign: "center",
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 24,
    marginTop: 20,
    textAlign: "center",
  },
  selectedDay: {
    color: "#000",
    fontWeight: "bold",
  },
  blankSpace: {
    height: 25,
  },
  wrapper: {
    height: 220,
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
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 10,
  },
});
