import { useAppState } from "@/context/TimerProvider";
import { Timer } from "@/interfaces";
import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Switch,
  Modal,
  Platform,
  Alert,
} from "react-native";
import * as Progress from "react-native-progress";
import * as Notifications from "expo-notifications";

interface TimerCardProps {
  item: Timer;
}

const TimerCard: React.FC<TimerCardProps> = ({ item }) => {
  const { dispatch } = useAppState();
  const { id, name, duration, remainingTime, status, hasHalfwayAlert } = item;
  const [timeLeft, setTimeLeft] = useState(remainingTime ?? duration);
  const [halfwayAlertTriggered, setHalfwayAlertTriggered] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const sendHalfwayNotification = async () => {
    if (Platform.OS === "web") {
      console.log("Web alert should trigger now!"); 
      Alert.alert("Halfway Alert", "Your timer is halfway done!");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Halfway Alert",
        body: "Your timer is halfway done!",
      },
      trigger: null,
    });
  };
  useEffect(() => {
    setTimeLeft(remainingTime);
    setHalfwayAlertTriggered(false);
  }, [remainingTime, status]);

  useEffect(() => {
    if (status === "paused") {
      dispatch({
        type: "UPDATE_REMAINING_TIME",
        payload: {
          timerId: id,
          remainingTime: timeLeft === 0 ? duration : timeLeft,
        },
      });
    }
  }, [status]);

  useEffect(() => {
    if (status === "running" && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimeLeft(duration);
            setModalVisible(true); 
            dispatch({
              type: "TIMER_COMPLETE",
              payload: { timerId: id },
            });
            return 0;
          }

          if (
            hasHalfwayAlert &&
            !halfwayAlertTriggered &&
            prevTime === Math.floor(duration / 2)
          ) {
            sendHalfwayNotification();
            setHalfwayAlertTriggered(true);
          }

          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status, timeLeft]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.remainingTimeContainer}>
        <Text style={styles.cardInfo}>Remaining Time</Text>
        <Text style={styles.timeLeftText}>{timeLeft} sec</Text>
      </View>

      <Progress.Bar
        progress={timeLeft / duration}
        width={250}
        height={10}
        color={status === "running" ? "#007bff" : "gray"}
        borderRadius={5}
        style={styles.progressBar}
      />
      <Text>Status: {status} </Text>

      <View style={styles.toggleContainer}>
        <Text>Halfway Alert:</Text>
        <Switch
          value={hasHalfwayAlert}
          onValueChange={() =>
            dispatch({
              type: "TOGGLE_HALFWAY_ALERT",
              payload: { timerId: id },
            })
          }
        />
      </View>

      <View style={styles.actionButtons}>
        <Button
          title={status === "running" ? "Pause" : "Start"}
          onPress={() => {
            dispatch({
              type: status === "running" ? "PAUSE_TIMER" : "START_TIMER",
              payload: { timerId: id },
            });
          }}
        />
        <Button
          title="Reset"
          onPress={() => {
            dispatch({ type: "RESET_TIMER", payload: { timerId: id } });
          }}
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You have completed the {name} timer!
            </Text>
            <Button title="OK" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TimerCard;

const styles = StyleSheet.create({
  card: {
    height: 300,
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
    textAlign: "center",
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
  progressBar: {
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});
