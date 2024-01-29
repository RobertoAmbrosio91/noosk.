import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Text, TouchableWithoutFeedback, TouchableOpacity, Keyboard, Platform } from "react-native";
import Axios from "../../hooks/axios/axiosConfig";
import SignupInput from "../../components/buttons&inputs/SignupInput";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import colors from "../../config/colors";
import Header from "../../components/header/header";
import typography from "../../config/typography";
import storeUserData from "../../hooks/async_storage/storeUser";
import {
  useGoogleAuth,
} from "../../hooks/authentication/googleAuth";
import appleLogin from "../../hooks/users/appleLogin";
import { useRouter } from "expo-router";
import { hideKeyboard } from "../../functionality/hideKeyboard";



type RootStackParamList = {
  HomeNew: undefined; // No parameters passed to Home route
  OnBoarding: undefined; // No parameters passed to OnBoarding route
  // Add other routes as necessary
};



const Login = () => {
  const router = useRouter()
  //setting states to get user data
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginStatus, setLoginStatus] = useState<string>("");

  const { onGoogleButtonPress } = useGoogleAuth();


  const login = async () => {
    try {
      const response = await Axios.post("/user/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.success) {
        router.replace("/feed")
        storeUserData(response.data.result);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log(error.response.data.message);
        setLoginStatus(error.response.data.message);
      } else {
        console.error("Error logging in:", error);
      }
    }
  };

  
  const onPressApple = async () => {
    const returnedUser = await appleLogin();
    if (returnedUser && returnedUser.success && !returnedUser.user_name) {
      router.replace("/feed")
    } else if (
      returnedUser &&
      returnedUser.success &&
      returnedUser.result.user_name !== ""
    ) {
      router.replace("/feed")
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => hideKeyboard()}>
      <SafeAreaView style={styles.background}>
        <View style={styles.container}>
          <Header style={{ color: colors.secondary_contrast }} />
          <Text style={styles.mainText}>Haaaave we met before?</Text>
          <View style={styles.formcontainer}>
            <View style={{ rowGap: 15 }}>
              <Text
                style={{
                  fontFamily: typography.appFont[500],
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                {loginStatus}
              </Text>
              <View style={styles.buttonsContainer}>
                <SignupInput
                  placeholder={"Email address"}
                  onChangeText={(value) => setEmail(value)}
                  placeholderColor={colors.primary}
                />
                <SignupInput
                  placeholder={"Password"}
                  secure_Text_Entry={true}
                  onChangeText={(value) => setPassword(value)}
                  placeholderColor={colors.primary}
                />
                <CustomButton
                  text={"Continue"}
                  onPress={login}
                  borderStyle={{
                    backgroundColor: colors.__teal_light,
                    borderRadius: 4,
                  }}
                  textStyle={{
                    color: colors.__main_dark_text,
                    fontFamily: typography.appFont[700],
                  }}
                />
                <Separator />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomButton
                    borderStyle={[styles.buttons, styles.socialLogin]}
                    textStyle={{
                      color: colors.__main_dark_text,
                      fontFamily: typography.appFont[400],
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
                        color: colors.__main_dark_text,
                        fontFamily: typography.appFont[400],
                        fontSize: 16,
                      }}
                      text={"Apple"}
                      source={require("../../../assets/images/apple-black.png")}
                      onPress={onPressApple}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              rowGap: 20,
              position: "absolute",
              bottom: 20,
              left: 24,
              width: "100%",
            }}
          >
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signuptext}>
                Don't have an account?{" "}
                <Text style={styles.signupspan}>Sign up</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/resetpassword')}
            >
              <Text style={[styles.signuptext, styles.signupspan]}>
                Forgot my password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const Separator = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          height: 0,
          borderColor: "#3B5777",
          borderWidth: 0.5,
          flex: 1,
        }}
      ></View>
      <Text
        style={{
          width: 30,
          textAlign: "center",
          fontFamily: typography.appFont[400],
          color: colors.primary,
        }}
      >
        or
      </Text>
      <View
        style={{
          height: 0,
          borderColor: "#3B5777",
          borderWidth: 0.5,
          flex: 1,
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  background: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? 30 : 0,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  mainText: {
    marginTop: Platform.OS != "web" ? "15%" : "5%",
    fontSize: 35,
    fontFamily: typography.appFont[700],
    color: colors.__main_dark_text,
  },

  formcontainer: {
    marginTop: Platform.OS != "web" ? "25%" : "5%",
  },

  signuptext: {
    fontSize: 13,
    color: colors.primary,
  },

  signupspan: {
    textDecorationLine: "underline",
  },
  buttons: {
    backgroundColor: colors.__teal_light,
    borderRadius: 4,
  },
  socialLogin: {
    width: Platform.OS === "ios" ? "48%" : "100%",
    backgroundColor: "transparent",
    borderColor: "#000",
    borderWidth: 1,
  },
  buttonsContainer: {
    rowGap: 10,
  },
});

export default Login;
