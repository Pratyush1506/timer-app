import { useAppState } from "@/context/TimerProvider";
import { StyleSheet, View, Text } from "react-native";

export default function TabTwoScreen() {
  const { state } = useAppState();
  return (
    <View>
      <Text>Completed Timers:</Text>
      {state.history.map((timer, index) => (
        <Text key={index}>
          {timer.name} - {timer.category}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
