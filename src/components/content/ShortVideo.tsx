import React, { FC } from "react";
import { StyleSheet, View, Image, TouchableWithoutFeedback, ImageSourcePropType } from "react-native";
import colors from "../../config/colors";

// Define the type for the component's props
interface ShortVideoProps {
  img_source: ImageSourcePropType;
  profile_image: ImageSourcePropType;
  key: string | number; // Depending on how you use the 'key' prop
  onLongPress: () => void;
}

const ShortVideo: FC<ShortVideoProps> = ({ img_source, profile_image, key, onLongPress }) => {
  return (
    <TouchableWithoutFeedback onLongPress={onLongPress}>
      <View style={styles.trending} key={key}>
        <Image source={img_source} style={styles.backgroundImage} />
        <View style={styles.profile_image}>
          <Image source={profile_image} style={styles.backgroundProfileImage} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  trending: {
    width: 100,
    height: 150,
    backgroundColor: colors.primary,
    borderRadius: 10,
    // flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'contain' if needed
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  backgroundProfileImage: {
    flex: 1,
    resizeMode: "cover", // or 'contain' if needed
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  profile_image: {
    width: 40,
    height: 40,
    position: "absolute",
    bottom: 5,
    right: 10,
    borderRadius: 40,
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primary,
  },
});

export default ShortVideo;
