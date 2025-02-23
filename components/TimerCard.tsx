import { useAppState } from "@/context/TimerProvider";
import { Timer } from "@/interfaces";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

interface TimerCardProps {
  item: Timer;
}

const TimerCard: React.FC<TimerCardProps> = ({ item }) => {
  const { dispatch } = useAppState();
  const { id, name, duration, category, remainingTime, status } = item;
  const [timeLeft, setTimeLeft] = useState(remainingTime);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(item.remainingTime); // Sync with global state when reset
  }, [remainingTime, status]);

  // useEffect(() => {
  //   if (status === "running" && timeLeft > 0) {
  //     const interval = setInterval(() => {
  //       setTimeLeft((prevTime) => {
  //         if (prevTime <= 1) {
  //           clearInterval(interval);
  //           dispatch({
  //             type: "PAUSE_TIMER",
  //             payload: { timerId: id, remainingTime: duration },
  //           });
  //           console.log("Timer Completed");
  //           return 0;
  //         }
  //         return prevTime - 1;
  //       });
  //     }, 1000);
  //     setInttervalId(interval);
  //   } else {
  //     if (intervalId) clearInterval(intervalId);
  //   }

  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //   };
  // }, [status]);

  useEffect(() => {
    if (status === "running" && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimeLeft(duration);
            setTimeout(() => {
              dispatch({
                type: "TIMER_COMPLETE",
                payload: { timerId: id },
              });
              console.log("Timer Completed and Reset");
            }, 0);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(interval);

      return () => {
        clearInterval(interval); // ✅ Ensures the interval stops when unmounting or pausing
      };
    }
  }, [status]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.remainingTimeContainer}>
        <Text style={styles.cardInfo}>Remaing Time </Text>
        <Text style={styles.timeLeftText}>{timeLeft} sec</Text>
      </View>
      <Text>Status: {status} </Text>

      <View style={styles.actionButtons}>
        <Button
          title={status === "running" ? "Pause" : "Start"}
          onPress={() => {
            if (status === "running") {
              // Dispatch PAUSE_TIMER with remaining time
              dispatch({
                type: "PAUSE_TIMER",
                payload: { timerId: id, remainingTime: timeLeft },
              });
            } else {
              // Dispatch START_TIMER without remaining time
              dispatch({
                type: "START_TIMER",
                payload: { timerId: id }, // ✅ Matches START_TIMER shape
              });
            }
          }}
        />
        <Button
          title="Reset"
          onPress={() => {
            dispatch({ type: "RESET_TIMER", payload: { timerId: id } });
          }}
        />
      </View>
    </View>
  );
};

export default TimerCard;

const styles = StyleSheet.create({
  card: {
    height: 230,
    width: 350,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  remainingTimeContainer: {
    alignSelf: "center",
  },
  timeLeftText: {
    fontSize: 30,
  },
  cardInfo: {
    fontSize: 20,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
