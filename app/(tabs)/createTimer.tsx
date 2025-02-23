import { useAppState } from "@/context/TimerProvider";
import { Timer } from "@/interfaces";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const CreateTimer = () => {
  const { state, dispatch } = useAppState();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");

  const router = useRouter();

  const handleSaveTimer = () => {
    if (name.trim() === "" || duration.trim() === "" || category.trim() === "")
      return;

    const newTimer: Timer = {
      id: uuidv4(),
      name: name,
      duration: Number(duration),
      remainingTime: Number(duration),
      category: category,
      status: "paused",
    };

    dispatch({
      type: "ADD_TIMER",
      payload: { categoryName: category, timer: newTimer },
    });
    setName("");
    setDuration("");
    setCategory("");
    router.push("/(tabs)");
  };

  return (
    <View>
      <View style={styles.inputGroup}>
        <Text>Timer Name: </Text>
        <TextInput
          value={name}
          placeholder="Enter Timer Name..."
          style={styles.input}
          onChangeText={setName}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>Timer Duration: </Text>
        <TextInput
          value={duration}
          placeholder="Enter Timer Duration..."
          keyboardType="numeric"
          style={styles.input}
          onChangeText={setDuration}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>Category: </Text>
        <TextInput
          value={category}
          placeholder="Enter Category..."
          onChangeText={setCategory}
          style={styles.input}
        />
      </View>
      <Button title="Save Timer" onPress={handleSaveTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    display: "flex",
    flexDirection: "row",
    maxWidth: 600,
    marginBottom: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    height: 40,
    paddingLeft: 20,
  },
});

export default CreateTimer;
