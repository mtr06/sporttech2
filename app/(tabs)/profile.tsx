import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Header from "@/components/Header";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState } from "react";

export default function HomeScreen() {
  const [isPressedFutsal, setIsPressedFutsal] = useState<boolean>(true);
  const [isPressedBadminton, setIsPressedBadminton] = useState<boolean>(false);
  const [isPressedBasket, setIsPressedBasket] = useState<boolean>(false);
  const [isPressedTennis, setIsPressedTennis] = useState<boolean>(false);
  const router = useRouter();
  return <View></View>;
}
