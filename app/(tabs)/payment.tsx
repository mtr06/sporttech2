import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Payment() {
    const params = useLocalSearchParams();
    const id: string = params.id as string;
    const nama: string = params.nama as string;
    const harga = params.harga;
    const totalHarga = params.totalPrice;
    const selectedTimes = params.selectedTimes as [];
    console.log(id);
    console.log(nama);
    console.log(harga);
    console.log(selectedTimes);
  return(
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      <Text>ID: {id}</Text>
      <Text>Nama: {nama}</Text>
      <Text>Harga per slot: Rp {harga}</Text>
      <Text>Total Price: Rp {totalHarga}</Text>
      <Text>Detail Pesanan: {selectedTimes}</Text>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

