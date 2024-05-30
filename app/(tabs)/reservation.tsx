import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, ScrollView } from 'react-native';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useLocalSearchParams, useRouter } from 'expo-router';

const daysOfWeek = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

interface AvailableSlots {
  [day: string]: {
    [hour: string]: boolean;
  };
}

export default function App() {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>({});
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [harga, setHarga] = useState<number>(0); 
  const [nama, setNama] = useState<string>('');
  const params = useLocalSearchParams();
  const router = useRouter();
  const id: string = params.id as string;

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'lapangan', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().timeAvailable;
          const harga = docSnap.data().harga;
          const nama = docSnap.data().namaLapangan;
          setAvailableSlots(data);
          setHarga(harga);
          setNama(nama);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchTimeSlots();
  }, [id]);

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
  };

  const handleSelectTime = (time: string) => {
    if (!selectedDay) return;
    const slot = `${selectedDay}_${time}`;
    setSelectedTimes(prev => {
      const newSelectedTimes = prev.includes(slot) ? prev.filter(t => t !== slot) : [...prev, slot];
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
      pathname: 'payment',
      params: { id, nama, harga, totalPrice, selectedTimes }
    });
  };

  const renderTimeSlotsForDay = (day: string) => (
    <View key={day} style={styles.dayColumn}>
      <TouchableOpacity onPress={() => handleSelectDay(day)}>
        <Text style={[styles.dayTitle, selectedDay === day && styles.selectedDay]}>{day}</Text>
      </TouchableOpacity>
      {selectedDay === day && timeSlots.map(time => {
        const slot = `${day}_${time}`;
        const hour = parseInt(time.split(':')[0], 10);
        const isAvailable = availableSlots[day] && availableSlots[day][hour] !== undefined ? availableSlots[day][hour] : false;
        const isBookable = isAvailable !== false;
        return (
          <TouchableOpacity key={slot} onPress={() => handleSelectTime(time)} disabled={!isBookable}>
            <Text style={[
              styles.timeSlot,
              { backgroundColor: selectedTimes.includes(slot) ? 'lightgreen' : isAvailable ? 'green' : 'red' }
            ]}>
              {time}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{nama}</Text>
      <View style={styles.calendar}>
        {daysOfWeek.map(day => renderTimeSlotsForDay(day))}
      </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  timeSlot: {
    padding: 10,
    marginVertical: 5,
    width: 60,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
  },
  selectedDay: {
    fontWeight: 'bold',
  },
  blankSpace: {
    height: 50,
  },
});
