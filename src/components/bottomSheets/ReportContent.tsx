import { View, Text, Alert } from "react-native";
import React, { useState, RefObject } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { Feather,AntDesign } from "@expo/vector-icons";
import typography from "../../config/typography";
import colors from "../../config/colors";
import { TouchableOpacity } from "react-native";
import CustomButton from "../buttons&inputs/CustomButton";
import reportPost from "../../hooks/posts/reportPost";
import blockUser from "../../hooks/users/blockUser";
import Toast from "react-native-root-toast";

type CurrentUserType = any; // Replace 'any' with the actual type
type PostCreatorType = any; // Replace 'any' with the actual type
type PostIdType = string | undefined; // Replace with the actual type

interface ReportContentProps {
  bottomSheetModalRef: RefObject<BottomSheetModal>;
  current_post_id: PostIdType;
  currentPostCreator: PostCreatorType;
  currentUser: CurrentUserType;
  isMessageVisible: boolean;
  setIsMessageVisible: React.Dispatch<React.SetStateAction<boolean>>;
}


const ReportContent: React.FC<ReportContentProps> = ({
  bottomSheetModalRef,
  current_post_id,
  currentPostCreator,
  currentUser,
  isMessageVisible,
  setIsMessageVisible,
}) => {
  const [motivation, setMotivation] = useState<string | null>(null);
  const [isUserBlocked, setIsUserBlocked] = useState<boolean>(false);
  function handleMotivation(key: number) {
    if (key === 1) {
      setMotivation("Offensive/Abusive/Illegal");
    } else if (key === 2) {
      setMotivation("Not Knowledge Based");
    } else if (key === 3) {
      setMotivation("Factually Incorrect");
    }
  }
  // handling button disable
  var disabled = motivation ? false : true;

  //handling post report
  const postReport = async () => {
    if (currentUser && current_post_id) {
      const response = await reportPost(
        current_post_id,
        motivation || '',
        currentUser.token
      );
      if (response && response.success) {
        bottomSheetModalRef.current?.dismiss();
        setIsMessageVisible(!isMessageVisible);
        setMotivation("");
      }
    }
  };

  //handling block user

  const blockReportUser = async () => {
    let response;
    if (currentUser && currentPostCreator) {
      response = await blockUser(currentPostCreator, currentUser.token);
    }

    if (response) {
      setIsUserBlocked(true);
      // bottomSheetModalRef.current?.dismiss();
    }
  };
  const showAlert = () => {
    Alert.alert(
      "Report User",
      "Would you like to report and block this user?",
      [
        {
          text: "Report & Block",
          onPress: blockReportUser,
        },
        {
          text: "Cancel",

          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={
        currentUser && currentPostCreator == currentUser._id ? ["65%"] : ["70%"]
      }
      backgroundStyle={{ backgroundColor: colors.__blue_light }}
    >
      <View style={styles.mainContainer}>
        {isUserBlocked && <Text>You have successfully blocked this user</Text>}
        <TouchableOpacity
        style={{ alignSelf: "flex-end", marginRight: 24 }}
        onPress={() => bottomSheetModalRef.current?.dismiss()}
      >
        <AntDesign name="close" size={22} color="black" />
      </TouchableOpacity>
        <Feather name="alert-triangle" size={30} color={colors.__black} />
        <Text style={styles.title}>Flag content</Text>
        <Text style={styles.text}>
          Help us keeping Noosk a safe place for knowledge. Request the removal
          of this content if you think it’s the right thing to do.
        </Text>
        <View style={[styles.choicesContainer]}>
          <TouchableOpacity
            style={[
              styles.choice,
              motivation === "Offensive/Abusive/Illegal"
                ? { backgroundColor: "#1D232D" }
                : {},
            ]}
            onPress={() => handleMotivation(1)}
          >
            <Text
              style={
                motivation === "Offensive/Abusive/Illegal"
                  ? { color: "#fff" }
                  : {}
              }
            >
              This content is Offensive/Abusive/Illegal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.choice,
              motivation === "Not Knowledge Based"
                ? { backgroundColor: "#1D232D" }
                : {},
            ]}
            onPress={() => handleMotivation(2)}
          >
            <Text
              style={
                motivation === "Not Knowledge Based" ? { color: "#fff" } : {}
              }
            >
              This content is not knowledge based
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.choice,
              motivation === "Factually Incorrect"
                ? { backgroundColor: "#1D232D" }
                : {},
            ]}
            onPress={() => handleMotivation(3)}
          >
            <Text
              style={
                motivation === "Factually Incorrect" ? { color: "#fff" } : {}
              }
            >
              This content is Factually incorrect
            </Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          text={"Continue"}
          borderStyle={[
            {
              marginTop: 30,
            },
            disabled
              ? { backgroundColor: "#fff" }
              : { backgroundColor: colors.__teal_light },
          ]}
          disabled={disabled}
          onPress={postReport}
        />
        {currentUser && currentPostCreator != currentUser._id && (
          <TouchableOpacity style={{ marginTop: 15 }} onPress={showAlert}>
            <Text>Report & Block User</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{ marginTop: 15 }}
          onPress={() => {
            bottomSheetModalRef.current?.dismiss();
            setMotivation("");
            setIsUserBlocked(false);
          }}
        >
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    margin: 24,
    height: 100,
    alignItems: "center",
    rowGap: 5,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.appFont[600],
    color: colors.__main_dark_text,
  },
  text: {
    fontFamily: typography.appFont[400],
    color: colors.__main_dark_text,
    textAlign: "center",
  },
  choicesContainer: {
    width: "100%",
    marginTop: 20,
    rowGap: 10,
  },
  choice: {
    borderWidth: 1,
    borderColor: colors.__main_dark_text,
    borderRadius: 4,
    alignItems: "center",
    padding: 10,
  },
});
export default ReportContent;
