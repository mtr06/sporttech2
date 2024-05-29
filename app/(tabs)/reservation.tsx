import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, ScrollView } from 'react-native';
import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

const App: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState<{ [day: string]: { [hour: string]: boolean } }>({});
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string>('');

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const docRef = doc(db, 'lapangan', '1');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data().timeAvailable;
          setAvailableSlots(data);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
  };

  const handleSelectTime = (time: string) => {
    if (!selectedDay) return;

    const slot = `${selectedDay}_${time}`;
    setSelectedTimes(prev => {
      if (prev.includes(slot)) {
        return prev.filter(t => t !== slot);
      } else {
        return [...prev, slot];
      }
    });
  };

  const handleCalculatePrice = () => {
    const price = selectedTimes.length * 1000;
    setTotalPrice(price);
  };

  const handleBookSlots = async () => {
    if (!selectedTimes.length) return;
  
    try {
      const docRef = doc(db, 'lapangan', '1');
      const updates: { [key: string]: boolean } = {};
      selectedTimes.forEach(slot => {
        const [day, time] = slot.split('_');
        const hour = time.split(':')[0].replace(/^0/, ''); // Remove leading zero
        const updateKey = `timeAvailable.${day}.${hour}`;
        console.log("Update Key:", updateKey);
        updates[updateKey] = false; // Set availability to false
      });
  
      console.log("Updates object:", updates); // Log updates object
  
      await updateDoc(docRef, updates);
      setSelectedTimes([]);
      setTotalPrice(0);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAvailableSlots(docSnap.data().timeAvailable);
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };  
  
  
  

  const renderTimeSlotsForDay = (day: string) => (
    <View key={day} style={styles.dayColumn}>
      <TouchableOpacity onPress={() => handleSelectDay(day)}>
        <Text style={[styles.dayTitle, selectedDay === day && styles.selectedDay]}>{day}</Text>
      </TouchableOpacity>
      {selectedDay === day && timeSlots.map(time => {
        const slot = `${day}_${time}`;
      const hour = parseInt(time.split(':')[0]); // Convert hour to number
      const isAvailable = availableSlots[day] && availableSlots[day][hour] !== undefined ? availableSlots[day][hour] : false;
      const isBookable = isAvailable !== false;
      // Logging
      // console.log("Day:", day);
      // console.log("Time:", time);
      // console.log("Hour:", hour);
      // console.log("Is Available:", isAvailable);
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
      <Text style={styles.title}>Lapangan Tennis Senayan</Text>
      <View style={styles.calendar}>
        {daysOfWeek.map(day => renderTimeSlotsForDay(day))}
      </View>
      <Button title="Calculate Price" onPress={handleCalculatePrice} />
      <Text style={styles.totalPrice}>Total Price: Rp {totalPrice}</Text>
      <Button title="Book Slots" onPress={handleBookSlots} />
    </ScrollView>
  );
};

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
});
export default App;
