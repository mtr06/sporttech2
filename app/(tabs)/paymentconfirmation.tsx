import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const PaymentConfirmation = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const selectedTimes = params.selectedTimes ? params.selectedTimes.split(',') : [];
  console.log(id);
  console.log(selectedTimes);

  const convertHourToNumber = (hourString) => {
    return parseInt(hourString.split(':')[0]);
  };

  const updateFirestoreData = async (selectedTimes) => {
    try {
      const venueRef = doc(db, 'lapangan', id);

      for (const selectedTime of selectedTimes) {
        if (!selectedTime.includes('_')) {
          console.error(`Invalid format for selected time: ${selectedTime}`);
          continue;
        }

        const [day, hour] = selectedTime.split('_');
        const hourNumber = convertHourToNumber(hour);

        // Constructing the path for the document to update
        const dayRef = `timeAvailable.${day}.${hourNumber}`;

        // Updating the document
        await updateDoc(venueRef, {
          [dayRef]: false,
        });

        console.log(`Updated ${day} ${hour} to false`);
      }

      console.log('Firestore data updated successfully');
    } catch (error) {
      console.error('Error updating Firestore data:', error);
    }
  };

  useEffect(() => {
    updateFirestoreData(selectedTimes);
  }, []);

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
