import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";



const storeFCMToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("FCM", token);
    console.log("Token stored successfully");
  } catch (error) {
    console.log("Error storing token", error);
  }
};

 

const requestUserPermission = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().requestPermission();
    console.log("Authorization Status Value:", authStatus);
  
    //const enabled =
      // authStatus === FirebaseMessagingTypes.AuthorizationStatus.AUTHORIZED ||
      // authStatus === FirebaseMessagingTypes.AuthorizationStatus.PROVISIONAL;

    if(authStatus === 1 || authStatus === 2) {
      console.log("Authorization status:", authStatus);
      return true;
    } else {
      console.log("Failed token status", authStatus);
    
      return false;
    }
  } catch (error:any) {
        if (error && error.AuthorizationStatus !== undefined) {
      console.log("Permission request failed:", error);
    } else {
      console.log("Permission request failed: Unknown error");
    }
    return false;
  }
};

let isTokenUpdating: boolean = false;

export const useFCMHandler = (): void => {
  const router = useRouter()
  useEffect(() => {
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    const initAsync = async () => {
      const permission = await requestUserPermission();
      if (!permission) return;
      if (!isTokenUpdating) {
        isTokenUpdating = true;
        try {
          const token = await messaging().getToken();
          console.log(`FCM Token:`, token);
          await storeFCMToken(token);
        } catch (error) {
          console.log("Error fetching token:", error);
        } finally {
          isTokenUpdating = false;
        }
      }

      try {
        const remoteMessage = await messaging().getInitialNotification();
        if (remoteMessage) {
          console.log("Notification opened from quit state:", remoteMessage.notification);
            router.push("/notifications");
        }
      } catch (error) {
        console.error("Error with getInitialNotification:", error);
      }
    };

    initAsync();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("Foreground message received", remoteMessage);

      if (remoteMessage.notification) {
        const { title, body } = remoteMessage.notification;
    
        if (Platform.OS === "android") {
          Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
          });
        }
    
        await Notifications.scheduleNotificationAsync({
          content: {
            title: title ?? "",
            body: body ?? "",
          },
          trigger: null,
        });
       
      } else {
        // Handle the case where notification is undefined
        console.log("Notification data is undefined");
      }
      
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
};
