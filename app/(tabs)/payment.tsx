import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { SimpleLineIcons } from "@expo/vector-icons";
import Header from "@/components/Header";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [nomorAkun, setAkun] = useState<string>("");
  const [voucher, setVoucher] = useState("");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [metodePembayaran, setMetodePembayaran] = useState<string>("");
  const [useVoucher, setUseVoucher] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const params = useLocalSearchParams();
  const router = useRouter();
  const [jumlahReferral, setJumlahReferral] = useState(0);
  const id: string = params.id as string;
  const nama: string = params.nama as string;
  const harga = params.harga;
  let totalHarga: any = params.totalPrice;
  const selectedTimes = params.selectedTimes ? params.selectedTimes : [];

  const uploadImage = async (imageUri: string | null) => {
    if (!imageUri) return;

    setUploading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = selectedTimes;
      const storageRef = ref(
        getStorage(),
        `bukti-pembayaran/${id}/${filename}`
      );
      const snapshot = await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(snapshot.ref);
      console.log("Uploaded a blob or file!");
      console.log("File available at", url);
      setUploading(false);
      if (useVoucher) {
        totalHarga = totalHarga - 5000;
        setJumlahReferral(jumlahReferral - 1);
      }
      router.push({
        pathname: "paymentconfirmation",
        params: { id, selectedTimes, totalHarga, harga, jumlahReferral },
      });
      // Navigate to PaymentConfirmation page
    } catch (error) {
      console.error("Upload failed", error);
      setUploading(false);
    }
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
    }
  };

  const fetchData = async () => {
    try {
      const data = doc(db, "venueOwner", id);
      const dataSnap = await getDoc(data);

      if (dataSnap.exists()) {
        const akun = dataSnap.data().akunPembayaran;
        const nomor = dataSnap.data().nomorAkun;

        setPaymentMethod(akun);
        setAkun(nomor);
        console.log(akun);
        console.log(nomor);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const fetchReferral = async () => {
    try {
      const data = doc(db, "customer", id);
      const dataSnap = await getDoc(data);

      if (dataSnap.exists()) {
        setJumlahReferral(dataSnap.data().countReferral);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  fetchData();
  fetchReferral();

  const formatCurrency = (amount: any) => {
    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

    return formattedAmount;
  };

  console.log(id);
  console.log(nama);
  console.log(totalHarga);
  console.log(selectedTimes);

  return (
    <View style={styles.container}>
      <Header user={params} router={router} />
      <Text style={styles.header}>Metode Pembayaran</Text>
      <View className="flex flex-row w-full mt-2">
        <Image
          source={require("../../assets/images/BCA2.png")}
          style={{ width: 28, height: 28, resizeMode: "contain" }}
        />
        <Text className="ml-3 text-lg text-[#757575] self-center">BCA</Text>
        <TouchableOpacity
          onPress={() => setPaymentMethod("BCA")}
          disabled
          className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
        >
          {paymentMethod === "BCA" ? (
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
        <Text className="ml-3 text-lg text-[#757575] self-center">Gopay</Text>
        <TouchableOpacity
          onPress={() => setPaymentMethod("Gopay")}
          disabled
          className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
        >
          {paymentMethod === "Gopay" ? (
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
        <Text className="ml-3 text-lg text-[#757575] self-center">Ovo</Text>
        <TouchableOpacity
          onPress={() => setPaymentMethod("Ovo")}
          disabled
          className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
        >
          {paymentMethod === "Ovo" ? (
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
        <Text className="ml-3 text-lg text-[#757575] self-center">Dana</Text>
        <TouchableOpacity
          onPress={() => setPaymentMethod("Dana")}
          disabled
          className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
        >
          {paymentMethod === "Dana" ? (
            <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
          ) : (
            ""
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.header} className="mt-2">
        Nomor Akun
      </Text>
      <Text className="mx-4 text-[#757575] mt-2">{nomorAkun}</Text>

      <Text style={styles.header} className="mt-2">
        Voucher
      </Text>
      {jumlahReferral != 0 ? (
        <View className="flex flex-row w-full mt-2">
          <Text className="mx-4 text-[#757575]">
            Discount 5k from your referral code
          </Text>
          <TouchableOpacity
            onPress={() => setUseVoucher(!useVoucher)}
            className="h-[20px] w-[20px] rounded-[20px] border-2 self-center justify-center items-center ml-auto"
          >
            {useVoucher ? (
              <View className="h-[13px] w-[13px] rounded-[20px] bg-[#24A0ED]" />
            ) : (
              ""
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex flex-row w-full mt-2">
          <Text className="mx-4 text-[#757575]">
            Tidak ada voucher yang dapat digunakan!
          </Text>
        </View>
      )}

      <View style={styles.summary}>
        <Text style={styles.header} className="mt-2">
          Rincian
        </Text>
        <View className="flex flex-row justify-between">
          <Text>Harga</Text>
          <Text>{formatCurrency(harga || 0)}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text>Potongan</Text>
          <Text>-{useVoucher ? formatCurrency(5000) : formatCurrency(0)}</Text>
        </View>
        <View className="flex flex-row justify-between">
          <Text>Harga</Text>
          <Text>
            {useVoucher
              ? formatCurrency(totalHarga - 5000)
              : formatCurrency(totalHarga)}
          </Text>
        </View>
      </View>
      {uploading ? (
        <View className="justify-center items-center w-[48%] h-[100px] rounded-2xl border-dashed">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-lg font-bold text-center">
            {Math.round(progress)}% uploaded
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
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
                size={28}
                color="#5f88c1"
                className="self-center"
              />
              <Text className="self-center font-bold">
                Unggah Bukti Transfer
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => uploadImage(image)}
        disabled={uploading}
        className="mt-4 rounded-2xl"
      >
        <Text style={styles.confirmButtonText}>
          {uploading ? "Uploading..." : "KONFIRMASI PEMBAYARAN"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radioButtonOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 8,
  },
  summary: {
    marginBottom: 16,
  },
  summaryText: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#cccccc",
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#FDE767",
    padding: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default PaymentScreen;
