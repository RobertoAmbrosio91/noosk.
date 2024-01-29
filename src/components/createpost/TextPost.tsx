import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import React, { useState, useRef } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import typography from "../../config/typography";
import colors from "../../config/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import SelectPostColor from "../bottomSheets/selectPostColor";
import { MediaPostType } from "../../types";
import { hideKeyboard } from "../../functionality/hideKeyboard";

interface TextPostProps {
  mediaPost: MediaPostType;
  onPostChange: (post: MediaPostType) => void;
  mediaType: string;
}


const TextPost: React.FC<TextPostProps> = ({ mediaPost, onPostChange, mediaType }) => {
  const [text, setText] = useState<string>("");
  const [color, setColor] = useState<string>("#54D7B7");
  const backgroundColor = mediaPost.title !== "" || mediaPost.description !== "" ? color : "transparent";

  const handleTextPost = (value: string) => {
    setText(value);
    onPostChange({
      ...mediaPost,
      description: value,
    });
  };
  
  const handleTitleChange = (value: string) => {
    onPostChange({
      ...mediaPost,
      title: value,
    });
  };


  // toggle BottomSheet
  const bottomSheetModalRef = useRef<any>(null);

  // function handlePresentModal() {
  //   bottomSheetModalRef.current?.present();
  // }
  return (
    <TouchableWithoutFeedback onPress={() => hideKeyboard()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={[
            styles.textPostContainer,
            { backgroundColor: "#D1DAEA" },
          ]}
        >
          <TextInput
            placeholder="Give it a title..."
            placeholderTextColor={colors.__blue_dark}
            style={[
              styles.text_input,
              { fontSize: 20, minHeight: 0, paddingBottom: 10 },
            ]}
            onChangeText={handleTitleChange}
          />
          <TextInput
            placeholder="Write down your thoughts..."
            placeholderTextColor={colors.__blue_dark}
            style={[styles.text_input]}
            multiline
            onChangeText={(value) => handleTextPost(value)}
          />
        </View>
        <SelectPostColor
          bottomSheetModalRef={bottomSheetModalRef}
          setColor={setColor}
          mediaPost={mediaPost}
          onPostChange={onPostChange}
        />
      </KeyboardAvoidingView>
     </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  text_input: {
    color: colors.__main_dark_text,
    fontFamily: typography.appFont[700],
    minHeight: 100,
    maxHeight: 250,
    paddingBottom: 50,
  },
  textPostContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 10,
  },
  colorSelector: {
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 30,
    alignSelf: "flex-end",
    padding: 3,
  },

  innerSelector: {
    borderRadius: 100,
    width: "100%",
    height: "100%",
  },
});

export default TextPost;
