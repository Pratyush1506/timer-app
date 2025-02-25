import { useAppState } from "@/context/TimerProvider";
import { ScrollView, StyleSheet, View, Text } from "react-native";

export default function TabTwoScreen() {
  const { state } = useAppState();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Completed Timers:</Text>
      {state.history.map((timer, index) => (
        <View style={styles.historyLogTextContainer} key={index}>
          <Text style={styles.historyLogText}>Category: {timer.category}</Text>
          <Text style={styles.historyLogText}>Timer: {timer.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  historyLogTextContainer: {
    padding: 10,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    marginBottom: 10,
    width: "auto",
  },
  historyLogText: {
    fontSize: 16,
  },
});
