import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import TimerCard from "./TimerCard";
import { Category } from "@/interfaces";
import { useAppState } from "@/context/TimerProvider";

interface CategorySectionProps {
  item: Category;
}

const CategorySection: React.FC<CategorySectionProps> = ({ item }) => {
  const { state, dispatch } = useAppState();

  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const categoryTimers = state.timers.filter((timer) =>
    item.timers.includes(timer.id)
  );

  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, categoryTimers.length * 310], 
  });

  const opacityInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Fade in
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.bulkActions}>
          <Button
            title="Start All"
            onPress={() =>
              dispatch({
                type: "START_ALL_TIMERS",
                payload: { categoryName: item.name },
              })
            }
          />
          <Button
            title="Pause All"
            onPress={() =>
              dispatch({
                type: "PAUSE_ALL_TIMERS",
                payload: { categoryName: item.name },
              })
            }
          />
          <Button
            title="Reset All"
            onPress={() =>
              dispatch({
                type: "RESET_ALL_TIMERS",
                payload: { categoryName: item.name },
              })
            }
          />
        </View>
      )}

      <Animated.View
        style={[
          styles.content,
          { height: heightInterpolation, opacity: opacityInterpolation },
        ]}>
        {categoryTimers.map((timer) => (
          <TimerCard key={timer.id} item={timer} />
        ))}
      </Animated.View>
    </View>
  );
};

export default CategorySection;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#007bff",
    padding: 10,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bulkActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  content: {
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
  },
});
