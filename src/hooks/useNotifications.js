import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";


export const useNotifications = () => {
  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("TOKEN", token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  // This listener is fired whenever a notification is received while the app is foregrounded
  const handleNotification = (notification) => {};

  // This listener is fired whenever a user taps on or interacts with a notification
  const handleNotificationResponse = (response) => {
    const data = response.notification.request.content.data;
    if (data && data.url) Linking.openURL(data.url);
  };
  return {
    registerForPushNotificationsAsync,
    handleNotification,
    handleNotificationResponse,
  };
};
