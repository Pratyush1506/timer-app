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

// const categories: Category[] = [
//   {
//     name: "Category 1",
//     timers: [
//       {
//         name: "Demo Timer 1",
//         duration: "60",
//         remainingTime: "60",
//         category: "Demo",
//       },
//       {
//         name: "Demo Timer 2",
//         duration: "120",
//         remainingTime: "120",
//         category: "Demo",
//       },
//     ],
//   },
//   {
//     name: "Category 2",
//     timers: [
//       {
//         name: "Demo Timer 3",
//         duration: "180",
//         remainingTime: "180",
//         category: "Demo",
//       },
//       {
//         name: "Demo Timer 4",
//         duration: "240",
//         remainingTime: "240",
//         category: "Demo",
//       },
//     ],
//   },
// ];

export default function HomeScreen() {
  const { state, dispatch } = useAppState();
  return (
    <View style={styles.container}>
      <ScrollView >
        {state.categories.map((category, index) => (
          <CategorySection key={index} item={category} />
        ))}
      </ScrollView>
      {/* <TimerCard {...demoTimer} /> */}
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
