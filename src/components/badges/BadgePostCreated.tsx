import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import typography from "../../config/typography";
import CustomButton from "../buttons&inputs/CustomButton";
import colors from "../../config/colors";

// Define the props type
type BadgePostCreatedProps = {
  type: string;
};

const BadgePostCreated: React.FC<BadgePostCreatedProps> = ({ type }) => {
  return (
    <View style={styles.badgeContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Your {type} is up </Text>
        <Text style={styles.subTitle}>
          Invite your friends to spread their knowledge
        </Text>
        <CustomButton
          text={"Spread the word"}
          borderStyle={styles.button}
          textStyle={styles.textButton}
          hasIcon={true}
          icon={"share-android"}
        />
        <TouchableOpacity>
          <Text style={styles.continue}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  badgeContainer: {
    zIndex: 1000,
    backgroundColor: "#fff",
    position: "absolute",
    top: 200,
    alignSelf: "center",

    padding: 25,
    borderRadius: 4,
  },
  innerContainer: {
    alignSelf: "center",
    alignItems: "center",
    rowGap: 15,
    width: "85%",
  },
  title: {
    fontFamily: typography.appFont[700],
    textAlign: "center",
  },
  subTitle: {
    fontFamily: typography.appFont[400],
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.__main_blue,
  },
  textButton: {
    color: "#fff",
    fontFamily: typography.appFont[700],
  },
  continue: {
    fontFamily: typography.appFont[400],
    fontSize: 12,
  },
});

export default BadgePostCreated;
