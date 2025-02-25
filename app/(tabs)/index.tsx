import { StyleSheet, View, Text, ScrollView } from "react-native";
import TimerCard from "@/components/TimerCard";
import CategorySection from "@/components/CategorySection";
import { Category } from "@/interfaces";
import { useReducer } from "react";
import {
  initialState,
  timerReducer,
  useAppState,
} from "@/context/TimerProvider";


export default function HomeScreen() {
  const { state, dispatch } = useAppState();
  return (
    <View style={styles.container}>
      <ScrollView >
        {state.categories.map((category, index) => (
          <CategorySection key={index} item={category} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
