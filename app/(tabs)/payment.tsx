import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes, getStorage } from 'firebase/storage';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [nomorAkun, setAkun] = useState<string>('');
  const [voucher, setVoucher] = useState('');
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const router = useRouter();
  const id: string = params.id as string;
  const nama: string = params.nama as string;
  const harga = params.harga;
  const totalHarga = params.totalPrice;
  const selectedTimes = params.selectedTimes ? params.selectedTimes : [];

  const uploadImage = async (imageUri: string | null) => {
    if (!imageUri) return;

    setUploading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = selectedTimes;
      const storageRef = ref(getStorage(), `bukti-pembayaran/${id}/${filename}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(snapshot.ref);
      console.log('Uploaded a blob or file!');
      console.log('File available at', url);
      setUploading(false);
      router.push({
        pathname: 'paymentconfirmation',
        params: { id, selectedTimes, totalHarga }
      });
       // Navigate to PaymentConfirmation page
    } catch (error) {
      console.error('Upload failed', error);
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
      const data = doc(db, 'venueOwner', id);
      const dataSnap = await getDoc(data);

      if (dataSnap.exists()) {
        const akun = dataSnap.data().akunPembayaran;
        const nomor = dataSnap.data().nomorAkun;
        
        setPaymentMethod(akun);
        setAkun(nomor);
        console.log(akun);
        console.log(nomor);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  fetchData();
  
  console.log(id);
  console.log(nama);
  console.log(totalHarga);
  console.log(selectedTimes);
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Metode Pembayaran</Text>
      
      {['BCA', 'GoPay', 'Ovo', 'Dana'].map((method) => (
        <TouchableOpacity
          key={method}
          style={styles.radioItem}
          onPress={() => setPaymentMethod(method)}
        >
          <View style={styles.radioButtonOuter}>
            {paymentMethod === method && <View style={styles.radioButtonInner} />}
          </View>
          <Text>{method}</Text>
        </TouchableOpacity>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Nomor Akun"
        keyboardType="numeric"
        value={nomorAkun}
        editable={false}
      />
      <Text>Voucher</Text>
      <TextInput
        style={styles.input}
        placeholder="Discount 5k from your referral code"
        value={voucher}
        onChangeText={setVoucher}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Rincian</Text>
        <Text>Harga: Rp {totalHarga}</Text>
        <Text>Potongan: -Rp 0</Text>
        <Text>Total: Rp {totalHarga}</Text>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text>Unggah Bukti Transfer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.confirmButton} onPress={() => uploadImage(image)} disabled={uploading}>
        <Text style={styles.confirmButtonText}>
          {uploading ? 'Uploading...' : 'KONFIRMASI PEMBAYARAN'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff'
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  radioButtonOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 8,
    marginBottom: 16
  },
  summary: {
    marginBottom: 16
  },
  summaryText: {
    fontWeight: 'bold',
    marginBottom: 8
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 16,
    alignItems: 'center',
    marginBottom: 16
  },
  confirmButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontWeight: 'bold',
    color: '#000',
  }
});

export default PaymentScreen;
