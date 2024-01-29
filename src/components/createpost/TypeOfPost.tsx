import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleProp, 
  ViewStyle, 
  TextStyle,
  Platform
} from 'react-native';
import React, { useState, useEffect, FC } from "react";
import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import typography from "../../config/typography";
import SignupInput from "../buttons&inputs/SignupInput";

interface TypeOfPostProps {
  setMediaPost: (mediaPost: any) => void; // Use a more specific type instead of 'any' if available
  mediaPost: any; // Use a more specific type instead of 'any' if available
  handlePresentModal?: () => void;
}

interface Category {
  _id: string;
  name: string;
  // ... other properties of a category
}


const TypeOfPost: React.FC<TypeOfPostProps> = ({
  setMediaPost,
  mediaPost,
  handlePresentModal,
}) => {
  const bgColor = (tag: string) => {
    if (tag === "Analysis") return colors.__teal_light;
    else if (tag === "Latest Trends") return "#816C49";
    else if (tag === "Tips & Tricks") return "#D0D0D0";
    else if (tag === "Skills & Crafts") return "#1d232d";
    else if (tag === "Facts & Figures") return colors.__teal_dark;
  };
  // console.log(preSelectedCategory);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const handleTopicChange = (topic: string) => {
    setSelectedCategory(topic);
    setMediaPost({
      ...mediaPost,
      sub_category: topic,
    });
  };

  const containerBgColor = mediaPost.type_of_post ? '#8FA3C8' : colors.__01_light_n;

  return (
    <TouchableOpacity onPress={() => handlePresentModal?.()}>
      <View style={[styles.postType, { backgroundColor: containerBgColor }]}>
      {!mediaPost.type_of_post && <Text style={{fontFamily: typography.appFont[700], color: "white"}}>Select Post Type</Text>}
      {mediaPost.type_of_post &&
        <View
          style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}
        >
          <View
            style={[
              styles.typeColor,
              { backgroundColor: bgColor(mediaPost.type_of_post) },
            ]}
          ></View>
            <Text style={styles.button_text}>{mediaPost.type_of_post}</Text>
        </View>}
      </View>
          </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  postType: {
    flexDirection: "row",
    // alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 4,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    height: "100%",
    backgroundColor: colors.__01_light_n
  },
  typeColor: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  button_text: {
    color: "white",
    fontFamily: typography.appFont[700],
  }
});

export default TypeOfPost;
