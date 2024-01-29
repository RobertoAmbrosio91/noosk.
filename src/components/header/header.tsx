import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";
import typography from "../../config/typography";
import fetchUserNotifications from "../../hooks/notifications/fetchUserNotifications";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import { NotificationType } from "../../types";
import { router, useRouter, usePathname } from "expo-router";

// Define the types for the component's props
interface HeaderProps {
  style?: object;
  isSearch?: boolean;
  setIsSearch?: (isSearch: boolean) => void;
  section?: string;
}


type RootParamList = {
  HomeNew: undefined; // Add other routes with their expected params
  Notifications: undefined;
  // ... other routes
};


const Header: React.FC<HeaderProps> = ({ style = {}, isSearch = false, setIsSearch = () => {}, section }) => {
  const router = useRouter();
  const currentRoute = usePathname();
  const isIcons = ["/feed", "/creationhub", "/community", "/profile"].includes(currentRoute);
  const currentUser = useFetchUserDataAsync();
  const [page, setPage] = useState<number>(0);
  const [notifications, setNotifications] = useState<number>(0);
  const FetchStatus = {
    IDLE: "idle",
    FETCHING: "fetching",
    FETCHED: "fetched",
  };
  const [fetchStatus, setFetchStatus] = useState<string>(FetchStatus.IDLE);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser && currentUser.token && fetchStatus === FetchStatus.IDLE) {
        setFetchStatus(FetchStatus.FETCHING);
        try {
          const fetchedNotifications = await fetchUserNotifications(
            page,
            1000,
            currentUser.token
          );
          if (fetchedNotifications) {
            let total = 0;
            const notifications: NotificationType[] = fetchedNotifications;
            notifications.forEach((notification) => {
              if (!notification.is_read) total++;
            });
            setNotifications(total);
            setFetchStatus(FetchStatus.FETCHED);
          }
        } catch (error) {
          console.log(error);
          setFetchStatus(FetchStatus.IDLE);
        }
      }
    };
    fetchNotifications();
  }, [currentUser, fetchStatus, page]);

  const navigate=()=>{
    if(currentRoute==="/feed" || currentRoute==="/creationhub" || currentRoute==="/profile" || currentRoute.includes("/user/")){
      router.push("/feed");
    }
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Platform.OS === "android" ? "-9%" : 0 }}>
      <TouchableOpacity onPress={() => navigate()}>
        <Text style={[styles.logo, style]}>noosk.</Text>
      </TouchableOpacity>
      {isIcons && (
        <View style={{ flexDirection: "row", columnGap: 15 }}>
            {currentRoute === "/feed" && section === "General" && (
              <TouchableOpacity onPress={() => setIsSearch && setIsSearch(!isSearch)}>
                <Feather name="search" size={24} color={isSearch ? colors.__01_light_n : colors.__blue_dark} />
              </TouchableOpacity>
            )}

          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Feather name="bell" size={24} color={colors.__blue_dark} />
            {notifications > 0 && (
              <View style={styles.notificationsContainer}>
                <Text style={styles.notificationsNumber}>{notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontSize: 30,
    fontFamily: typography.appFont[700],
    color: colors.__blue_dark,
  },
  notificationsNumber: {
    textAlign: "center",
    fontSize: 10,
    color: "#fff",
  },
  notificationsContainer: {
    backgroundColor: "red",
    height: 17,
    width: 17,
    borderRadius: 100,
    justifyContent: "center",
    position: "absolute",
    top: "-20%",
    left: "50%",
  },
});

export default Header;

 