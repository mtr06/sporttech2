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

export default function PasangIklan() {
  const [durasi, setDurasi] = useState<any>(0);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const params = useLocalSearchParams();

  const uploadPoster = async (uri: any) => {
    if (uri != "") {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = getAuth().currentUser!!.uid;
      const storageRef = ref(getStorage(), `image-iklan/${userId}`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress indicator can be implemented here if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL:", downloadURL);

          // Simpan URL imageData
          setImage(downloadURL);

          console.log(image);

          setUploading(false);
          setProgress(0);
        }
      );
    }
  };

  const isValid = () => {
    return image != "" && durasi != 0;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadPoster(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    {
      console.log("SAVING!");
      try {
        await setDoc(doc(db, "iklanPromosi", getAuth().currentUser!!.uid), {
          idLapangan: getAuth().currentUser!!.uid,
          durasi: durasi,
          gambarIklan: image,
        }).then(() => {
          console.log("Adding Venue Owner Data!");
          // router.push({ pathname: "/index", params: user });
        });
      } catch (e) {
        alert(e);
      }
      router.push({ pathname: "/" });
    }
  };

  // Ensure the user is authenticated before proceeding
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      router.push({ pathname: "/signin" });
    } else {
      setLoading(false);
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
          <Text className="text-4xl font-bold">Pasang Iklan</Text>
        </View>
        <View className="mt-2">
          <Text className="text-center text-[#A7A2A2] text-xs">
            Tingkatkan Lapangan dengan Pasang Iklan
          </Text>
          <Image
            source={require("../../assets/images/pasangiklan.png")}
            className="mt-2 self-center"
          />
        </View>
      </View>
      <Text className="mt-2 mx-8 text-lg font-semibold">Unggah Poster</Text>
      <View className="mx-6 flex flex-row justify-between mt-2">
        {uploading ? (
          <View className="justify-center items-center w-[48%] h-[100px] rounded-2xl border-dashed">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="text-lg font-bold text-center">
              {Math.round(progress)}% uploaded
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              pickImage();
            }}
            style={{
              borderWidth: 2,
              borderColor: "#5f88c1",
            }}
            className="w-[100%] h-[200px] rounded-3xl border-dashed justify-center items-center"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
                className="rounded-3xl"
              />
            ) : (
              <View className="flex flex-row gap-x-2">
                <SimpleLineIcons
                  name="cloud-upload"
                  size={36}
                  color="#5f88c1"
                  className="self-center"
                />
                <Text className="self-center text-xl font-bold">
                  Unggah Poster
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
      <Text className="mt-2 mx-8 text-lg font-semibold">Durasi Iklan</Text>
      <TextInput
        placeholder="Contoh : 7"
        keyboardType="numeric"
        onChangeText={(text) => setDurasi(text)}
        value={durasi}
        className="mt-2 mx-6 text-base px-4 py-2 border-2 border-gray-400 rounded-xl"
      />
      <TouchableOpacity
        onPress={() => {
          if (isValid()) {
            handleSave();
          } else {
            Alert.alert(
              "Invalid Input!",
              "Pastikan untuk mengisi semua input!",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
          }
        }}
        className="mt-12 mb-2 mx-6 bg-[#6895D2] py-3 flex items-center rounded-xl"
      >
        <Text className="text-xl text-textButton font-bold text-white">
          Pasang Iklan
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
