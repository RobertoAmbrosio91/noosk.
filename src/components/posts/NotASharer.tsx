import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../../config/colors";
import typography from "../../config/typography";
import CustomButton from "../buttons&inputs/CustomButton";
import { useRouter } from "expo-router";


const NotASharer: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Entypo name="graduation-cap" size={39} color={colors.__teal_light} />
        <Text style={styles.title}>Pssst</Text>
        <Text style={styles.text}>
          As a "watcher", you are not allowed to create content. 
          {"\n"}
          {"\n"}
          Get verified, become an expert and share your knowledge on Noosk. 
          {"\n"}
          {"\n"}
          Share your
          knowledge and help others grow!
        </Text>
        <CustomButton
          borderStyle={styles.buttonConfirm}
          text={"Become a sharer"}
          textStyle={{ fontFamily: typography.appFont[700] }}
          onPress={() => router.push ('/onboarding/intro')}
        />
        <CustomButton
          borderStyle={styles.buttonCancel}
          textStyle={{
            color: colors.__teal_light,
            fontFamily: typography.appFont[700],
          }}
          text={"Continue"}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexdirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  messageContainer: {
    width: "85%",
    rowGap: 10,
    backgroundColor: "#0D0D0C",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  title: {
    color: colors.__teal_light,
    fontFamily: typography.appFont[700],
    fontSize: 20,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
  buttonConfirm: {
    backgroundColor: colors.__teal_light,
  },
  buttonCancel: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.__teal_light,
  },
});
export default NotASharer;