import { useAppState } from "@/context/TimerProvider";
import { Timer } from "@/interfaces";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  Switch,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const CreateTimer = () => {
  const { state, dispatch } = useAppState();
  const router = useRouter();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [hasHalfwayAlert, setHasHalfwayAlert] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const categories = state.categories.map((cat) => cat.name);
  const allCategories = [...categories, "Custom"];

  const handleSaveTimer = () => {
    if (name.trim() === "" || duration.trim() === "") return;
    const category =
      selectedCategory === "Custom" ? customCategory.trim() : selectedCategory;
    if (!category) return;

    const newTimer: Timer = {
      id: uuidv4(),
      name,
      duration: Number(duration),
      remainingTime: Number(duration),
      category,
      status: "paused",
      hasHalfwayAlert,
    };

    dispatch({
      type: "ADD_TIMER",
      payload: { categoryName: category, timer: newTimer },
    });

    setName("");
    setDuration("");
    setSelectedCategory(null);
    setCustomCategory("");
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text>Timer Name:</Text>
        <TextInput
          value={name}
          placeholder="Enter Timer Name..."
          style={styles.input}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>Timer Duration:</Text>
        <TextInput
          value={duration}
          placeholder="Enter Timer Duration..."
          keyboardType="numeric"
          style={styles.input}
          onChangeText={setDuration}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>Category:</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownVisible(true)}>
          <Text style={styles.dropdownText}>
            {selectedCategory || "Select a category"}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedCategory === "Custom" && (
        <View style={styles.inputGroup}>
          <Text>Custom Category:</Text>
          <TextInput
            value={customCategory}
            placeholder="Enter Custom Category..."
            style={styles.input}
            onChangeText={setCustomCategory}
          />
        </View>
      )}

      <View style={styles.toggleGroup}>
        <Text>Halfway Alert:</Text>
        <Switch value={hasHalfwayAlert} onValueChange={setHasHalfwayAlert} />
      </View>

      <Button title="Save Timer" onPress={handleSaveTimer} />
      <Modal visible={dropdownVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={allCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedCategory(item);
                    setDropdownVisible(false);
                  }}>
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setDropdownVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    height: 40,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdown: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownText: {
    color: "#000",
  },
  toggleGroup: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
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
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  modalText: {
    fontSize: 16,
  },
});

export default CreateTimer;
