import React, { useEffect, useState } from "react";
import { 
  View, Text, SafeAreaView, StyleSheet, TouchableOpacity, 
  TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, 
  Keyboard, ScrollView, Image, Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import colors from "../../config/colors";
import typography from "../../config/typography";
import { MediaPostType } from "../../types";
import { hideKeyboard } from "../../functionality/hideKeyboard";

interface MediaPostProps {
  mediaPost: MediaPostType;
  onPostChange: (post: MediaPostType) => void;
  mediaType: 'video' | 'image'; // Assuming mediaType is either 'video' or 'image'
  handlePresentModal: () => void;
}

const MediaPost: React.FC<MediaPostProps> = ({
  mediaPost,
  onPostChange,
  mediaType,
  handlePresentModal,
}) => {
  const [title, setTitle] = useState<string>(mediaPost.title);
  const [description, setDescription] = useState<string>(mediaPost.description);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    onPostChange({
      ...mediaPost,
      title: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onPostChange({
      ...mediaPost,
      description: value,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => hideKeyboard()}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}>
        <View
          style={[
            styles.video_thumb,
            isKeyboardVisible ? { width: 90, height: 130 } : {},
          ]}
        >
          {/* {mediaType === "video" && ( */}
          <TouchableOpacity onPress={() => handlePresentModal()}>
            <Ionicons
              name="add-circle-outline"
              size={70}
              color="rgba(92, 131, 175, 0.50)"
              style={{ alignSelf: "center" }}
            />
          </TouchableOpacity>

          {(mediaPost.videoUri || mediaPost.imageUri) && (
            <TouchableOpacity
              style={!isKeyboardVisible ? styles.closeBig : styles.closeSmall}
              onPress={() => handlePresentModal()}
            >
              <Ionicons name="close" size={35} color="#000" />
            </TouchableOpacity>
          )}

          {mediaType === "video" && mediaPost.videoUri && (
            <TouchableOpacity onPress={() => handlePresentModal()}>
              <Video
                source={{ uri: mediaPost.videoUri }}
                style={styles.backgroundVideo}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted
              />
            </TouchableOpacity>
          )}

          {mediaType === "image" && mediaPost.imageUri && (
            <Image
              source={{ uri: mediaPost.imageUri }}
              style={styles.backgroundVideo}
            />
          )}
        </View>

        <View style={styles.mediaInput}>
          <TextInput
            placeholder="Give it a name"
            placeholderTextColor={colors.__blue_dark}
            style={[
              styles.text_input,
              { fontSize: 20, minHeight: 0, paddingBottom: 10, height: 35 },
            ]}
            onChangeText={handleTitleChange}
          />
          <TextInput
            placeholder="Add a description"
            placeholderTextColor={colors.__blue_dark}
            style={[
              styles.text_input,
              isKeyboardVisible ? { height: 140 } : {},
            ]}
            multiline
            onChangeText={handleDescriptionChange}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-around",
  },
  mediaInput: {
    marginVertical: 50,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#D1DAEA",
  },
  video_thumb: {
    flexDirection: "row",
    width: 200,
    height: 290,
    backgroundColor: "#2E3A59",
    alignSelf: "center",
    borderRadius: 10,
    top: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 8,
    zIndex: 200,
    // resizeMode: "contain",
  },
  text_input: {
    color: colors.__main_dark_text,
    fontFamily: typography.appFont[700],
    paddingBottom: 50,
    fontSize: 15,
    height: 100,
  },
  closeBig: {
    zIndex: 2000,
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeSmall: {
    zIndex: 2000,
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default MediaPost;
