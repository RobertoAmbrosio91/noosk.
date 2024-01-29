import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform, SafeAreaView, TouchableOpacity, Image } from "react-native";
import colors from "../../config/colors";
import Header from "../../components/header/header";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import typography from "../../config/typography";
import * as WebBrowser from "expo-web-browser";
import {
  useGoogleAuth,
} from "../../hooks/authentication/googleAuth";
import appleLogin from "../../hooks/users/appleLogin";
import { useNavigation, useRouter, Redirect, Link } from "expo-router";
import "../../../firebaseInit"


const LandingScreen = () => {

  const router = useRouter();
  const { onGoogleButtonPress } = useGoogleAuth();
  
  


  const onPressApple = async () => {
    const returnedUser = await appleLogin();
    if (
      returnedUser &&
      returnedUser.success &&
      !returnedUser.result.user_name
    ) {
      router.replace('/onboarding/intro');
    } else if (
      returnedUser &&
      returnedUser.success &&
      returnedUser.result.user_name !== ""
    ) {
      router.replace('/feed');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Header />

        <View style={{ marginTop: Platform.OS === "web" ? 50 : 100 }}>
          <Text style={styles.mainText}>
            A place where you can inspire with your knowledge,{"\n"}
            <Text style={{ color: colors.__teal_light }}>Finally</Text>
          </Text>
          {Platform.OS === "web" &&
        <View style={styles.appLinks}>
      <Link href='https://apps.apple.com/us/app/noosk/id6467666673' asChild>
        <Image
        source={require ("../../../assets/App_Store_Badge.svg")}
        style={{ width: 120, height: 40, alignSelf: "center" }}
        />
      </Link>
      <Link href='https://play.google.com/store/apps/details?id=com.robya91.noosk&pli=1' asChild>
        <Image source={require('../../../assets/google-play-badge.png')} style={{ width: 144, height: 48 }} />
      </Link>
    </View>
    }
          <Text style={styles.secondaryText}>
            We built a place where experts can exchange knowledge
          </Text>
        </View>



        <View style={styles.buttonsContainer}>
          <CustomButton
            borderStyle={styles.buttons}
            textStyle={{
              color: colors.__main_blue,
              fontFamily: typography.appFont[700],
              fontSize: 16,
            }}
            text={"Continue with email"}
            onPress={() => router.push('/signup')}
          />
          <Separator />
                <View
                  style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                  <CustomButton
                    borderStyle={[styles.buttons, styles.socialLogin]}
                    textStyle={{
                      color: colors.w_contrast,
                      fontFamily: typography.appFont[700],
                      fontSize: 16,
                    }}
                    text={"Google"}
                    onPress={() => onGoogleButtonPress()}
                    source={require("../../../assets/images/search.png")}
                  />
                  {Platform.OS === "ios" && (
                    <CustomButton
                      borderStyle={[styles.buttons, styles.socialLogin]}
                      textStyle={{
                        color: colors.w_contrast,
                        fontFamily: typography.appFont[700],
                        fontSize: 16,
                      }}
                      text={"Apple"}
                      source={require("../../../assets/images/apple.png")}
                      onPress={onPressApple}
                    />
                  )}
                </View>

          <View style={{ rowGap: 20, top: "20%" }}>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text
                style={[
                  {
                    fontSize: 13,
                    marginTop: 0,
                    textAlign: "left",
                    color: "#4B5567",
                  },
                ]}
              >
                Already have an account?{"  "}
                <Text
                  style={{ textDecorationLine: "underline", color: "#fff" }}
                >
                  Log in
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                WebBrowser.openBrowserAsync("https://noosk.co/privacy_policy")
              }
            >
              <Text
                style={[
                  {
                    fontSize: 13,
                    marginTop: 0,
                    textAlign: "left",
                    color: "#4B5567",
                  },
                ]}
              >
                By continuing you agree to our{"  "}
                <Text
                  style={{ textDecorationLine: "underline", color: "#fff" }}
                >
                  Terms and Conditions & Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Separator = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          height: 0,
          borderColor: colors.w_contrast,
          borderWidth: 0.5,
          flex: 1,
        }}
      ></View>
      <Text
        style={{
          width: 30,
          textAlign: "center",
          fontFamily: typography.appFont[400],
          color: colors.w_contrast,
        }}
      >
        or
      </Text>
      <View
        style={{
          height: 0,
          borderColor: colors.w_contrast,
          borderWidth: 0.5,
          flex: 1,
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.__main_blue,
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    lineHeight: "normal",

  },
  mainText: {
    fontSize: 35,
    fontFamily: typography.appFont[700],
    color: colors.w_contrast,
    // textAlign: "center",
  },
  appLinks:{
    flexDirection: 'row',
    width: "40%",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: 20,
  },
  secondaryText: {
    fontSize: 15,
    color: colors.__blue_dark,
    marginTop: Platform.OS != "web" ? 40 : 20,
    fontFamily: typography.appFont[400],
    // textAlign: "center",
  },
  buttons: {
    backgroundColor: colors.__teal_light,
    borderRadius: 4,
    // borderColor: colors.__teal_light,
    // borderWidth: 1,
  },
  buttonsContainer: {
    rowGap: 10,
    top: "10%",
    // position: "absolute",
    // width: "100%",
    // alignSelf: "center",
    // bottom: 91,
  },
  socialLogin: {
    width: Platform.OS === "ios" ? "48%" : "100%",
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
  },
  text_no_account: {},
});

export default LandingScreen;
