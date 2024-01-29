import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import typography from "../../config/typography";
import colors from "../../config/colors";
import getTimeAgo from "../../functionality/timeAgo";
import { NotificationType } from "../../types";
import { router, useRouter } from "expo-router";

interface NotificationProps {
  item: NotificationType;
  handleNotificationRead: (id: string) => void;
  isLast: boolean;
}

export type RootStackParamList = {

  PostFull: {
    postId: string | undefined;
  };

};

const Notification: React.FC<NotificationProps> = ({ item, handleNotificationRead, isLast }) => {
  const router=useRouter();
  const nooskImg =
    "https://dijtywqe2wqrv.cloudfront.net/public/noosk_icon_512.png";

  const navigate = (item:NotificationType) => {
   if (item.data_message.type === "Post request") {
      router.push(`request/${item.data_message.request_id}`)
    } else if (item.data_message.type === "Post Create") {
      router.push(`post/${item.data_message.post_id}`)
    }else if(item.data_message.type==="Chat Message"){
      router.push(`chat/${item.data_message.chat_id}`)
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationContainer,
        !item.is_read ? { backgroundColor: "rgba(84, 215, 183, 0.3)" } : {},
        isLast ? { marginBottom: 60 } : {},
      ]}
      onPress={() => {
        handleNotificationRead(item._id);
        navigate(item);
      }}
    >
      <View style={styles.notification}>
        <View style={{ flex: 1 }}>
          <Text style={styles.notificationBody}>
            {item.message}
          </Text>
          <Text style={styles.notificationTimeAgo}>{getTimeAgo(item)}</Text>
        </View>

        <View style={styles.profileImage}>
          <Image
            style={styles.image}
            source={{
              uri: item.sender.length > 0 ? item.sender[0].profile : nooskImg,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notification: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  notificationBody: {
    flex: 1,
    paddingRight: 5,
    color: colors.__blue_dark,
  },
  notificationContainer: {
    rowGap: 5,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  notificationTimeAgo: {
    fontFamily: typography.appFont[400],
    fontSize: 12,
    color: colors.__blue_medium,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    borderRadius: 4,
  },
});

export default Notification;
