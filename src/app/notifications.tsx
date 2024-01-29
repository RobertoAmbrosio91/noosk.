import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, FC } from "react";
import typography from "../config/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import useFetchUserDataAsync from "../hooks/async_storage/useFetchUserDataAsync";
import Notification from "@/components/notifications/notification";
import fetchUserNotifications from "../hooks/notifications/fetchUserNotifications";
import readNotification from "../hooks/notifications/readNotification";
import { NotificationType} from "../types";




const Notifications: FC = () => {
  const navigation = useNavigation<any>();
  const currentUser = useFetchUserDataAsync();
  const [page, setPage] = useState(0);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const today = new Date().toISOString().split("T")[0];

  //fetch user notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser && currentUser.token) {
        try {
          const fetchedNotifications = await fetchUserNotifications(
            page,
            1000,
            currentUser.token
          );
          if (fetchedNotifications) {
            setNotifications(fetchedNotifications);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchNotifications();
  }, [currentUser]);


  //handle read notification
  const handleNotificationRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification._id === id && notification.is_read == false) {
        if (currentUser) {
          readNotification(notification._id, currentUser.token);
        }
        return { ...notification, is_read: true };
      }
      return notification;
    });

    setNotifications(updatedNotifications);
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 15,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={30}
              color="#000"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
        </View>

        <ScrollView
          style={styles.notificationsContainer}
          showsVerticalScrollIndicator={false}
        >
         
          <View style={{ marginTop: 15 }}>
            {notifications.map((item, index) => (
              <Notification
                item={item}
                key={item._id}
                handleNotificationRead={handleNotificationRead}
                isLast={index === notifications.length - 1}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 24 : 0,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    backgroundColor:"#fff"
  },
  container: {
    // paddingHorizontal: 24,
    rowGap: 15,

  },
  title: {
    fontFamily: typography.appFont[700],
    fontSize: 20,
  },
  notificationDay: {
    fontFamily: typography.appFont[600],
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 24,
  },
  notificationsContainer: {
    rowGap: 15,
  },
});
export default Notifications;
