// import { StateProvider } from "@/context/TimerProvider";
import { StateProvider } from "@/context/TimerProvider";
import { Stack } from "expo-router";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const registerForNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("You need to enable notifications for alerts.");
  }
};

export default function RootLayout() {
  useEffect(() => {
    registerForNotifications();
  }, []);
  return (
    <StateProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </StateProvider>
  );
}

