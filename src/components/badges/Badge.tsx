import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import typography from "../../config/typography";
import CustomButton from "../buttons&inputs/CustomButton";
import colors from "../../config/colors";
import changeIsShown from "../../hooks/badges/changeIsShown";
import { CurrentUserType } from "../../types";

// Define a type for the props
type BadgeProps = {
  title?: string;
  medail?: string; // Assuming 'medail' is a string. Adjust the type if it's different
  setBadge: (value: boolean) => void; // This is a function that takes a boolean and returns void
  currentUser: CurrentUserType | null | undefined;
};

const Badge: React.FC<BadgeProps> = ({ title, medail, setBadge, currentUser }) => {
  return (
    <View style={styles.badgeContainer}>
      <View style={styles.innerContainer}>
        <Text>NEW BADGE</Text>
        <Image
          source={require("../../../assets/images/badges/first_post_medail.png")}
        />
        <Text style={styles.title}>First shared post</Text>

        <CustomButton
          text={"Got it"}
          borderStyle={styles.button}
          textStyle={styles.textButton}
          onPress={() => {
            if (currentUser) {
              changeIsShown("first_post_badge", currentUser.token);
            }
            setBadge(false);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    zIndex: 1000,
    backgroundColor: colors.__blue_light,
    position: "absolute",
    top: 200,
    alignSelf: "center",
    alignItems: "center",
    padding: 50,

    borderRadius: 4,
  },
  innerContainer: {
    alignSelf: "center",
    alignItems: "center",
    rowGap: 15,
    width: "100%",
  },
  title: {
    fontFamily: typography.appFont[700],
    textAlign: "center",
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

export default Badge;
