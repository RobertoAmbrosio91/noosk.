import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import typography from "../../config/typography";
import colors from "../../config/colors";
import { MediaPostType } from "../../types";
import { NavigationProp } from '@react-navigation/native';
import { useRouter, useNavigation } from "expo-router";



// Define a type for the props
interface HeaderSelectionProps {
  mediaType: string;
  onMediaTypeChange: (type: any) => void;
  mediaPost: MediaPostType; // Add this line
  resetMediaPost: () => void;
  // Include other props as necessary
}

const HeaderSelection: React.FC<HeaderSelectionProps> = ({
  onMediaTypeChange,
  mediaType,
  resetMediaPost,
}) => {
  const router = useRouter();
  const handleMediaTypePress = (type: string) => {
    resetMediaPost();
    onMediaTypeChange(type);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>

      <View style={{ flexDirection: "row", columnGap: 10 }}>
        <TouchableOpacity
          style={[
            styles.post_type_container,
            mediaType == "text" ? { backgroundColor: "#D1DAEA" } : {},
          ]}
          onPress={() => handleMediaTypePress("text")}
        >
          <Feather name="file-text" size={24} color={colors.__blue_dark} />
          <Text style={styles.post_type_text}>Text</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.post_type_container,
            mediaType == "video" ? { backgroundColor: "#D1DAEA" } : {},
          ]}
          onPress={() => handleMediaTypePress("video")}
        >
          <Feather name="film" size={24} color={colors.__blue_dark} />
          <Text style={styles.post_type_text}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.post_type_container,
            mediaType == "image" ? { backgroundColor: "#D1DAEA" } : {},
          ]}
          onPress={() => handleMediaTypePress("image")}
        >
          <Feather name="image" size={24} color={colors.__blue_dark} />
          <Text style={styles.post_type_text}>Image</Text>
        </TouchableOpacity>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  post_type_text: {
    color: colors.__blue_dark,
    fontFamily: typography.appFont[500],
  },
  post_type_container: {
    padding: 10,
    // backgroundColor: "#2E3A59",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
});

export default HeaderSelection;
