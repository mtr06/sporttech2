import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const PaymentConfirmation = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pembayaran Berhasil</Text>
      <Text style={styles.message}>Terima kasih atas pembayaran Anda. Kami akan segera memproses pesanan Anda.</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Kembali ke Beranda</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  }
});

export default PaymentConfirmation;
