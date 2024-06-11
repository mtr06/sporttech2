import {
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Alert,
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
  updateDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

interface timeAvailableInterface {
  [day: string]: {
    [hour: string]: boolean;
  };
}

export default function SuntingLapangan() {
  const [venueName, setVenueName] = useState<String>("");
  const [venueAddress, setVenueAddress] = useState<String>("");
  const [venueDescription, setVenueDescription] = useState<String>("");
  const [venuePrice, setVenuePrice] = useState<any>(0);
  const [whatsappNumber, setWhatsappNumber] = useState<String>("");
  const [day, setDay] = useState<string>("MIN");
  const [next, setNext] = useState<boolean>(false);
  const [tipeLapangan, setTipeLapangan] = useState<string>("");
  const [metodePembayaran, setMetodePembayaran] = useState<string>("");
  const [nomorAkun, setNomorAkun] = useState<string>("");
  const [image, setImage] = useState<any>({ 1: "", 2: "", 3: "", 4: "" });
  const [imageData, setImageData] = useState<any>({});
  const [uploading1, setUploading1] = useState(false);
  const [progress1, setProgress1] = useState(0);
  const [uploading2, setUploading2] = useState(false);
  const [progress2, setProgress2] = useState(0);
  const [uploading3, setUploading3] = useState(false);
  const [progress3, setProgress3] = useState(0);
  const [uploading4, setUploading4] = useState(false);
  const [progress4, setProgress4] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [timeAvailable, setTimeAvailable] = useState<timeAvailableInterface>({
    MIN: {},
    SEN: {},
    SEL: {},
    RAB: {},
    KAM: {},
    JUM: {},
    SAB: {},
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

  const toggleDayTimeSlot = (day: string) => {
    Object.keys(timeAvailable[day]).map((hour) => {
      setTimeAvailable((prev: any) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [hour]: true,
        },
      }));
    });
  };

  const toggleDayTimeSlotClose = (day: string) => {
    Object.keys(timeAvailable[day]).map((hour) => {
      setTimeAvailable((prev: any) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [hour]: false,
        },
      }));
    });
  };

  const toggleAllDayTimeSlot = () => {
    ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].map((day) => {
      Object.keys(timeAvailable[day]).map((hour) => {
        setTimeAvailable((prev: any) => ({
          ...prev,
          [day]: {
            ...prev[day],
            [hour]: true,
          },
        }));
      });
    });
  };

  const toggleAllDayTimeSlotClose = () => {
    ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"].map((day) => {
      Object.keys(timeAvailable[day]).map((hour) => {
        setTimeAvailable((prev: any) => ({
          ...prev,
          [day]: {
            ...prev[day],
            [hour]: false,
          },
        }));
      });
    });
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

  const isValid1 = () => {
    console.log(venueName);
    console.log(venueDescription);
    console.log(venuePrice);
    console.log(whatsappNumber);
    return (
      venueName != "" &&
      venueDescription != "" &&
      venuePrice != "" &&
      whatsappNumber != ""
    );
  };

  const isValid2 = () => {
    console.log(tipeLapangan);
    console.log(metodePembayaran);
    console.log(nomorAkun);
    return (
      (image[1] != "" || image[2] != "" || image[3] != "" || image[4] != "") &&
      tipeLapangan != "" &&
      metodePembayaran != "" &&
      nomorAkun != ""
    );
  };

  const uploadProfile = async (i: number, uri: any) => {
    if (uri != "") {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = getAuth().currentUser!!.uid;
      const storageRef = ref(getStorage(), `image-lapangan/${userId}-${i}`);

      if (i == 1) {
        setUploading1(true);
      } else if (i == 2) {
        setUploading2(true);
      } else if (i == 3) {
        setUploading3(true);
      } else if (i == 4) {
        setUploading4(true);
      }

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress indicator can be implemented here if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (i == 1) {
            setProgress1(progress);
          } else if (i == 2) {
            setProgress2(progress);
          } else if (i == 3) {
            setProgress3(progress);
          } else if (i == 4) {
            setProgress4(progress);
          }
        },
        (error) => {
          console.error("Upload failed:", error);
          if (i == 1) {
            setUploading1(false);
          } else if (i == 2) {
            setUploading2(false);
          } else if (i == 3) {
            setUploading3(false);
          } else if (i == 4) {
            setUploading4(false);
          }
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL:", downloadURL);

          // Simpan URL imageData
          setImageData((prev: any) => ({
            ...prev,
            [i]: downloadURL,
          }));

          console.log(imageData[i]);

          if (i == 1) {
            setUploading1(false);
            setProgress1(0);
          } else if (i == 2) {
            setUploading2(false);
            setProgress2(0);
          } else if (i == 3) {
            setUploading3(false);
            setProgress3(0);
          } else if (i == 4) {
            setUploading4(false);
            setProgress4(0);
          }
        }
      );
    }
  };

  const pickImage = async (i: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      setImage((prev: any) => ({
        ...prev,
        [i]: result.assets[0].uri,
      }));
      uploadProfile(i, result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    {
      console.log("SAVING!");
      try {
        await updateDoc(doc(db, "venueOwner", getAuth().currentUser!!.uid), {
          id: getAuth().currentUser!!.uid,
          akunPembayaran: metodePembayaran,
          nomorAkun: nomorAkun,
        }).then(() => {
          console.log("Adding Venue Owner Data!");
          // router.push({ pathname: "/index", params: user });
        });
        await updateDoc(doc(db, "lapangan", getAuth().currentUser!!.uid), {
          id: getAuth().currentUser!!.uid,
          alamat: venueAddress,
          deskripsi: venueDescription,
          gambar: imageData,
          harga: venuePrice,
          isOpen: true,
          kategori: tipeLapangan,
          namaLapangan: venueName,
          rating: 0,
          countRating: 0,
          whatsapp: whatsappNumber,
          timeAvailable: timeAvailable,
        }).then(() => {
          console.log("Adding Lapangan Data!");
          // router.push({ pathname: "/index", params: user });
        });
      } catch (e) {
        alert(e);
      }
      await router.push({ pathname: "/profile" });
    }
  };

  // Ensure the user is authenticated before proceeding
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchLapangan = () => {
    const q = query(
      collection(db, "lapangan"),
      where("id", "==", getAuth().currentUser!!.uid)
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setVenueAddress(doc.data().alamat);
        setVenueDescription(doc.data().deskripsi);
        for (let i = 1; i <= 4; i++) {
          if (doc.data().gambar[i]) {
            setImage((prev: any) => ({
              ...prev,
              [i]: doc.data().gambar[i],
            }));
          } else {
            setImage((prev: any) => ({
              ...prev,
              [i]: "",
            }));
          }
        }

        setImageData(doc.data().gambar);
        setVenuePrice(doc.data().harga);
        setTipeLapangan(doc.data().kategori);
        setVenueName(doc.data().namaLapangan);
        setTimeAvailable(doc.data().timeAvailable);
        setWhatsappNumber(doc.data().whatsapp);
        console.log(doc.data());
      });
    });
    return unsub;
  };

  const fetchOwnerData = () => {
    const q = query(
      collection(db, "venueOwner"),
      where("id", "==", getAuth().currentUser!!.uid)
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setMetodePembayaran(doc.data().akunPembayaran);
        setNomorAkun(doc.data().nomorAkun);
        console.log(doc.data());
      });
    });
    setLoading(false);
    return unsub;
  };

  useEffect(() => {
    if (!user) {
      router.push({ pathname: "/signin" });
    } else {
      fetchLapangan();
      fetchOwnerData();
    }
  }, [user]);

  if (loading) {
    return (
      <View>
        <Header user={params} router={router} />
        <Text className="w-full align-middle text-center text-xl font-bold">
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Header user={params} router={router} />
      {/* Area Content */}
      <View className="mt-4 flex items-center">
        <View>
          <Text className="text-4xl font-bold">Atur Data Lapangan</Text>
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
                placeholder={`${venueName}`}
                onChangeText={(text) => setVenueName(text)}
                value={`${venueName}`}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Alamat</Text>
              <TextInput
                placeholder={`${venueAddress}`}
                onChangeText={(text) => setVenueAddress(text)}
                value={`${venueAddress}`}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Deskripsi Lapangan</Text>
              <TextInput
                placeholder={`${venueDescription}`}
                onChangeText={(text) => setVenueDescription(text)}
                multiline={true}
                value={`${venueDescription}`}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl h-[100px]"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Harga per jam</Text>
              <TextInput
                placeholder={`${venuePrice}`}
                keyboardType="numeric"
                onChangeText={(text) => setVenuePrice(text)}
                value={venuePrice}
                className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
              />
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Nomor Whatsapp</Text>
              <TextInput
                placeholder={`${whatsappNumber}`}
                keyboardType="numeric"
                onChangeText={(text) => setWhatsappNumber(text)}
                value={`${whatsappNumber}`}
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
            <View className="mt-3 mx-6 flex flex-row justify-between">
              <TouchableOpacity
                onPress={() => {
                  toggleDayTimeSlot(day);
                }}
                className="w-[24%] bg-[#6895D2] flex items-center rounded-xl"
              >
                <Text className="py-2 text-md text-textButton font-bold text-white text-center">
                  Aktivasi Harian
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleDayTimeSlotClose(day);
                }}
                className="w-[24%] bg-[#6895D2] flex items-center rounded-xl"
              >
                <Text className="py-2 text-md text-textButton font-bold text-white text-center">
                  Close{"\n"}Harian
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleAllDayTimeSlot();
                }}
                className="w-[24%] bg-[#6895D2] flex items-center rounded-xl"
              >
                <Text className="py-2 text-md text-textButton font-bold text-white text-center">
                  Aktivasi Mingguan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  toggleAllDayTimeSlotClose();
                }}
                className="w-[24%] bg-[#6895D2] flex items-center rounded-xl"
              >
                <Text className="py-2 text-md text-textButton font-bold text-white text-center">
                  Close Mingguan
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (isValid1()) {
                  setNext(true);
                } else {
                  Alert.alert(
                    "Invalid Input!",
                    "Pastikan untuk mengisi semua input!",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                  );
                }
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
                {uploading1 ? (
                  <View className="justify-center items-center w-[48%] h-[100px] rounded-2xl border-dashed">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="text-lg font-bold text-center">
                      {Math.round(progress1)}% uploaded
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      pickImage(1);
                    }}
                    style={{
                      borderWidth: 2,
                      borderColor: "#5f88c1",
                    }}
                    className="w-[48%] h-[100px] rounded-2xl border-dashed justify-center items-center"
                  >
                    {image[1] !== "" ? (
                      <Image
                        source={{ uri: image[1] }}
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-2xl"
                      />
                    ) : (
                      <SimpleLineIcons
                        name="cloud-upload"
                        size={28}
                        color="#5f88c1"
                        className="self-center"
                      />
                    )}
                  </TouchableOpacity>
                )}
                {uploading2 ? (
                  <View className="justify-center items-center w-[48%] h-[100px] rounded-2xl border-dashed">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="text-lg font-bold text-center">
                      {Math.round(progress2)}% uploaded
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      pickImage(2);
                    }}
                    style={{
                      borderWidth: 2,
                      borderColor: "#5f88c1",
                    }}
                    className="w-[48%] h-[100px] rounded-2xl border-dashed justify-center items-center"
                  >
                    {image[2] !== "" ? (
                      <Image
                        source={{ uri: image[2] }}
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-2xl"
                      />
                    ) : (
                      <SimpleLineIcons
                        name="cloud-upload"
                        size={28}
                        color="#5f88c1"
                        className="self-center"
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
              <View className="flex flex-row justify-between mt-2">
                {uploading3 ? (
                  <View className="justify-center items-center w-[48%] h-[100px] rounded-2xl border-dashed">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="text-lg font-bold text-center">
                      {Math.round(progress3)}% uploaded
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      pickImage(3);
                    }}
                    style={{
                      borderWidth: 2,
                      borderColor: "#5f88c1",
                    }}
                    className="w-[48%] h-[100px] rounded-2xl border-dashed justify-center items-center"
                  >
                    {image[3] !== "" ? (
                      <Image
                        source={{ uri: image[3] }}
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-2xl"
                      />
                    ) : (
                      <SimpleLineIcons
                        name="cloud-upload"
                        size={28}
                        color="#5f88c1"
                        className="self-center"
                      />
                    )}
                  </TouchableOpacity>
                )}
                {uploading4 ? (
                  <View className="justify-center items-center w-[48%] h-[100px] rounded-2xl border-dashed">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="text-lg font-bold text-center">
                      {Math.round(progress4)}% uploaded
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      pickImage(4);
                    }}
                    style={{
                      borderWidth: 2,
                      borderColor: "#5f88c1",
                    }}
                    className="w-[48%] h-[100px] rounded-2xl border-dashed justify-center items-center"
                  >
                    {image[4] !== "" ? (
                      <Image
                        source={{ uri: image[4] }}
                        style={{ width: "100%", height: "100%" }}
                        className="rounded-2xl"
                      />
                    ) : (
                      <SimpleLineIcons
                        name="cloud-upload"
                        size={28}
                        color="#5f88c1"
                        className="self-center"
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View className="mx-6">
              <Text className="text-base mt-2">Pilih Jenis Lapangan</Text>
              <View className="flex flex-row w-full mt-2">
                <Image
                  source={require("../../assets/images/FutsalIcon.png")}
                  style={{ width: 28, height: 28, resizeMode: "contain" }}
                />
                <Text className="ml-3 text-lg text-[#757575] self-center">
                  Futsal
                </Text>
                <TouchableOpacity
                  onPress={() => setTipeLapangan("Futsal")}
                  className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
                >
                  {tipeLapangan === "Futsal" ? (
                    <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                  ) : (
                    ""
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex flex-row w-full mt-2">
                <Image
                  source={require("../../assets/images/BadmintonIcon.png")}
                  style={{
                    width: 28,
                    height: 28,
                    resizeMode: "contain",
                    transform: [{ rotate: "25deg" }],
                  }}
                />
                <Text className="ml-3 text-lg text-[#757575] self-center">
                  Badminton
                </Text>
                <TouchableOpacity
                  onPress={() => setTipeLapangan("Badminton")}
                  className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
                >
                  {tipeLapangan === "Badminton" ? (
                    <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                  ) : (
                    ""
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex flex-row w-full mt-2">
                <Image
                  source={require("../../assets/images/BasketIcon.png")}
                  style={{ width: 28, height: 28, resizeMode: "contain" }}
                />
                <Text className="ml-3 text-lg text-[#757575] self-center">
                  Basket
                </Text>
                <TouchableOpacity
                  onPress={() => setTipeLapangan("Basket")}
                  className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
                >
                  {tipeLapangan === "Basket" ? (
                    <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                  ) : (
                    ""
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex flex-row w-full mt-2">
                <Image
                  source={require("../../assets/images/TennisIcon.png")}
                  style={{ width: 28, height: 28, resizeMode: "contain" }}
                />
                <Text className="ml-3 text-lg text-[#757575] self-center">
                  Tennis
                </Text>
                <TouchableOpacity
                  onPress={() => setTipeLapangan("Tennis")}
                  className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
                >
                  {tipeLapangan === "Tennis" ? (
                    <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                  ) : (
                    ""
                  )}
                </TouchableOpacity>
              </View>
              <Text className="text-base mt-2">Pilih Metode Pembayaran</Text>
              <View className="flex flex-row w-full mt-2">
                <Image
                  source={require("../../assets/images/BCA2.png")}
                  style={{ width: 28, height: 28, resizeMode: "contain" }}
                />
                <Text className="ml-3 text-lg text-[#757575] self-center">
                  BCA
                </Text>
                <TouchableOpacity
                  onPress={() => setMetodePembayaran("BCA")}
                  className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
                >
                  {metodePembayaran === "BCA" ? (
                    <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                  ) : (
                    ""
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex flex-row w-full mt-2">
                <Image
                  source={require("../../assets/images/Gopay2.png")}
                  style={{ width: 28, height: 28, resizeMode: "contain" }}
                />
                <Text className="ml-3 text-lg text-[#757575] self-center">
                  Gopay
                </Text>
                <TouchableOpacity
                  onPress={() => setMetodePembayaran("Gopay")}
                  className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
                >
                  {metodePembayaran === "Gopay" ? (
                    <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                  ) : (
                    ""
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex flex-row w-full mt-2">
                <Image
                  source={require("../../assets/images/Ovo2.png")}
                  style={{ width: 28, height: 28, resizeMode: "contain" }}
                />
                <Text className="ml-3 text-lg text-[#757575] self-center">
                  Ovo
                </Text>
                <TouchableOpacity
                  onPress={() => setMetodePembayaran("Ovo")}
                  className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
                >
                  {metodePembayaran === "Ovo" ? (
                    <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                  ) : (
                    ""
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex flex-row w-full mt-2">
                <Image
                  source={require("../../assets/images/Dana2.png")}
                  style={{ width: 28, height: 28, resizeMode: "contain" }}
                />
                <Text className="ml-3 text-lg text-[#757575] self-center">
                  Dana
                </Text>
                <TouchableOpacity
                  onPress={() => setMetodePembayaran("Dana")}
                  className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
                >
                  {metodePembayaran === "Dana" ? (
                    <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
                  ) : (
                    ""
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {metodePembayaran === "" ? (
              ""
            ) : (
              <View className="mx-6">
                <Text className="text-base mt-2">Nomor Akun</Text>
                <TextInput
                  placeholder="Masukkan Nomor Akun"
                  keyboardType="numeric"
                  onChangeText={(text) => setNomorAkun(text)}
                  value={nomorAkun}
                  className="mt-2 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
                />
              </View>
            )}
            <View className="flex flex-row justify-between mx-6 my-4">
              <TouchableOpacity
                onPress={() => {
                  setNext(false);
                }}
                className="w-[47.5%] bg-[#6895D2] py-3 flex items-center rounded-xl"
              >
                <Text className="text-xl text-textButton font-bold text-white">
                  Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isValid2()) {
                    handleSave();
                  } else {
                    Alert.alert(
                      "Invalid Input!",
                      "Pastikan untuk mengisi semua input!",
                      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                    );
                  }
                }}
                className="w-[47.5%] bg-[#7da27e] py-3 flex items-center rounded-xl"
              >
                <Text className="text-xl text-textButton font-bold text-white">
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
