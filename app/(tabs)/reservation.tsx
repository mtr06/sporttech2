import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "@/components/Header";
import Swiper from "react-native-swiper";

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
  const params = useLocalSearchParams();
  const router = useRouter();
  const id: string = params.id as string;

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

  return (
    <ScrollView>
      <View className="mt-2 mx-4">
        <Header user={params} router={router} />
        {/* Iklan */}
        <View className="flex">
          <Swiper
            style={styles.wrapper}
            showsButtons
            loop
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
          >
            <Image
              source={{ uri: gambar[1] }}
              style={styles.image}
              className="h-[220px] my-auto"
            />
            <Image
              source={{ uri: gambar[2] }}
              style={styles.image}
              className="h-[220px] my-auto"
            />
            <Image
              source={{ uri: gambar[3] }}
              style={styles.image}
              className="h-[220px] my-auto"
            />
            <Image
              source={{ uri: gambar[4] }}
              style={styles.image}
              className="h-[220px] my-auto"
            />
          </Swiper>
          <Text></Text>
        </View>
      </View>
      <Text style={styles.title}>{nama}</Text>
      <Text className="text-center">{alamat}</Text>
      <Text className="mt-4 text-lg font-bold text-center">Reservasi</Text>
      <View className="mx-3 flex justify-center items-center">
        <View className="mt-1 flex flex-row justify-between gap-x-3 w-full">
          {daysOfWeek.map((day) => renderDayForSelect(day))}
        </View>
      </View>
      <View className="mx-4 flex flex-col items-center justify-center">
        {daysOfWeek.map((day) => renderTimeSlotsForDay(day))}
      </View>
      <Text className="mt-6 text-lg font-bold text-center">Deskripsi</Text>
      <Text className="mx-6 mt-2 text-md text-justify">{deskripsi}</Text>
      <Text style={styles.totalPrice}>Total Price: Rp {totalPrice}</Text>
      <Button title="Book Slots" onPress={handleBookSlots} />
      <View style={styles.blankSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
    marginBottom: 10,
    color: "#CF7575",
  },
  timeSlot: {
    padding: 10,
    marginVertical: 5,
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
    height: 50,
  },
  wrapper: {
    height: 230,
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
