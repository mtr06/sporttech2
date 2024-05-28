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
import { FontAwesome6 } from "@expo/vector-icons";
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

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [ownerData, setOwnerData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const router = useRouter();
  const user = getAuth().currentUser;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const uploadProfile = async (uri: any) => {
    if (uri) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = getAuth().currentUser!!.uid;
      const storageRef = ref(getStorage(), `foto-profile/${userId}`);

      setUploading(true);

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

          // Simpan URL foto profil ke Firestore atau database pengguna Anda
          await setDoc(
            doc(getFirestore(), "customer", userId),
            {
              fotoProfil: downloadURL,
            },
            { merge: true }
          );

          setUploading(false);
          setImage(null);
          setProgress(0);
        }
      );
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadProfile(result.assets[0].uri);
    }
  };

  const fetchProfile = () => {
    const q = query(
      collection(db, "customer"),
      where("id", "==", getAuth().currentUser!!.uid)
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setProfile(doc.data());
      });
      setLoading(false);
    });
    return unsub;
  };

  const fetchOwnerData = () => {
    const q2 = query(
      collection(db, "venueOwner"),
      where("id", "==", getAuth().currentUser!!.uid)
    );
    // console.log(getAuth().currentUser!!.uid);
    const unsub2 = onSnapshot(q2, (querySnapshot2) => {
      querySnapshot2.forEach((doc) => {
        setOwnerData(doc.data());
        console.log(doc.data());
      });
      setLoading(false);
    });
    return unsub2;
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
      if (profile.role == "Venue Owner") {
        fetchOwnerData();
        console.log(ownerData.akunPembayaran);
      }
    } else {
      router.push("/signin");
    }
  }, [user]);

  if (loading) {
    return (
      <Text className="w-full align-middle text-center text-xl font-bold">
        Loading...
      </Text>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header router={router} params={user} />
      {/* Area Content */}
      <View className="mt-3 flex items-center">
        <View className="flex flex-row justify-center bg-[#B1B1B1] w-[150px] h-[150px] rounded-[100px]">
          {uploading ? (
            <View className="justify-center items-center w-full h-full">
              <ActivityIndicator size="large" color="#0000ff" />
              <Text className="text-lg font-bold text-center">
                {Math.round(progress)}% uploaded
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <View className="">
                {profile.fotoProfil ? (
                  <Image
                    source={{ uri: profile.fotoProfil }}
                    width={150}
                    height={150}
                    className="rounded-[100px]"
                  />
                ) : (
                  <FontAwesome6 name="user-large" size={86} color="white" />
                )}
              </View>
            </TouchableOpacity>
          )}
          {profile.role === "Venue Owner" ? (
            <View className="rounded-t-[25px] bg-[#eadd2c] w-[70%] absolute bottom-0">
              <Text className="text-center text-lg font-bold">Owner</Text>
            </View>
          ) : (
            <View></View>
          )}
        </View>
        <View className="w-full">
          <View className="mx-8 mt-1">
            <Text className="text-lg text-textButton font-bold mt-2">
              Nama Lengkap
            </Text>
            <Text className="mt-2 text-md text-textButton pb-1 px-2 mx-3 border-b-[1px]">
              {profile.nama}
            </Text>
          </View>
          <View className="mx-8 mt-2">
            <Text className="text-lg text-textButton font-bold mt-2">
              No Telepon
            </Text>
            <Text className="mt-2 text-md text-textButton pb-1 px-2 mx-3 border-b-[1px]">
              {profile.phoneNumber}
            </Text>
          </View>
          <View className="mx-8 mt-2">
            <Text className="text-lg text-textButton font-bold mt-2">
              Email
            </Text>
            <Text className="mt-2 text-md text-textButton pb-1 px-2 mx-3 border-b-[1px]">
              {profile.email}
            </Text>
          </View>
          <View className="mx-8 mt-2">
            <Text className="text-lg text-textButton font-bold mt-2">
              Referral Code
            </Text>
            <Text className="mt-2 text-md text-textButton pb-1 px-2 mx-3 border-b-[1px]">
              {profile.referralCode}
            </Text>
          </View>
          {profile.role === "Venue Owner" ? (
            <View>
              <View className="mx-8 mt-2">
                <Text className="text-lg text-textButton font-bold mt-2">
                  Akun Pembayaran
                </Text>
                <Text className="mt-2 text-md text-textButton pb-1 px-2 mx-3 border-b-[1px]">
                  {ownerData.akunPembayaran}
                </Text>
              </View>
              <View className="mx-8 mt-2">
                <Text className="text-lg text-textButton font-bold mt-2">
                  Nomor Akun Pembayaran
                </Text>
                <Text className="mt-2 text-md text-textButton pb-1 px-2 mx-3 border-b-[1px]">
                  {ownerData.nomorAkun}
                </Text>
              </View>
            </View>
          ) : (
            <View></View>
          )}
          <View
            className={profile.role === "Venue Owner" ? "mt-[4%]" : "mt-[43%]"}
          >
            <TouchableOpacity
              onPress={() => signOut(getAuth())}
              className="mx-6 bg-[#FF0000] w-[50%] py-2 flex items-center rounded-3xl self-center border-[2px] border-[#5F88C1]"
            >
              <Text className="text-xl text-textButton font-bold text-white">
                Sign Out
              </Text>
            </TouchableOpacity>
            {profile.role === "Venue Owner" ? (
              <TouchableOpacity
                onPress={() => router.replace("/inputlapangan")}
                className="mt-2 mx-6 bg-[#5F88C1] w-[50%] py-2 flex items-center rounded-3xl self-center border-[2px] border-[#5F88C1]"
              >
                <Text className="text-xl text-textButton font-bold text-white">
                  Boost Your Venue
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="mt-1 flex flex-row justify-center">
                <Text>You have a venue? </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.replace("/inputlapangan");
                  }}
                >
                  <Text className="text-[#232297] font-semibold">
                    Register as owner
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
