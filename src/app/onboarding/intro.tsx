import axios from "../../hooks/axios/axiosConfig";
import { View, Text, SafeAreaView, Platform } from "react-native";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import typography from "../../config/typography";
import { TouchableOpacity } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import { updateUserInStorage } from "../../hooks/async_storage/updateUserInStorage";
import { useRouter } from "expo-router";



const OnBoarding = () => {
  const currentUser = useFetchUserDataAsync();
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const isDisabled = userType != null ? false : true;
  const handleUserType = (value: string) => {
    setUserType(value);
  };

  const updateUserType = async (token: string, userType: string | null) => {
    if (currentUser) {
      try {
        const response = await axios.post(
          "/user/profile-update",
          {
            user_type: userType,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
        if (response && response.data.success) {
          updateUserInStorage(response.data.result);
          if (response.data.result.user_type === "sharer") {
            router.push('/onboarding/categories');
          } else {
            router.push('/onboarding/createusername')
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      <View>
        <Text style={styles.logo}>noosk.</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.containerIntro}>
        <Text style={[styles.text, styles.mainText]}>
        Hello there!{Platform.OS === 'web' ? ' ' : '\n'}Let's begin
        </Text>
          <Text style={[styles.text, { color: colors.__blue_dark }]}>
            What would you like to do on Noosk?
          </Text>
          <Text style={[styles.text, { color: colors.__blue_dark }]}>
            Join To :
          </Text>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userType,
                userType === "sharer"
                  ? { borderColor: colors.__teal_light }
                  : {},
              ]}
              onPress={() => handleUserType("sharer")}
            >
              <Entypo
                name="graduation-cap"
                size={24}
                color={colors.__teal_light}
              />
              <View style={{ rowGap: 5 }}>
                <Text style={styles.userTypeText}>Share</Text>
                <Text style={styles.description}>
                Share your insights and participate in expert discussions
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userType,
                userType === "watcher"
                  ? { borderColor: colors.__teal_light }
                  : {},
              ]}
              onPress={() => handleUserType("watcher")}
            >
              <Feather name="eye" size={24} color={colors.__teal_light} />
              <View style={{ rowGap: 5 }}>
                <Text style={styles.userTypeText}>Lurk</Text>
                <Text style={styles.description}>
                  Read, observe, ask questions
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <CustomButton
            text={"Continue"}
            textStyle={{
              fontFamily: typography.appFont[700],
              color: colors.primary,
            }}
            borderStyle={{
              backgroundColor: isDisabled
                ? "rgba(84, 215, 183, 0.3)"
                : colors.__teal_light,
              borderRadius: 4,
            }}
            disabled={isDisabled}
            onPress={() => {
              if (currentUser && currentUser.token) {
                updateUserType(currentUser.token, userType);
              } else {
                console.error('User token is undefined');
                // Handle the case when currentUser or currentUser.token is undefined
              }
            }}
          />
          <Text style={styles.text}> </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.__main_blue,
    paddingTop: Platform.OS === "android" ? 30 : 0,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center"
  },
  container: {
    flex: Platform.OS != "web" ?  1 : 0.5,
    flexDirection: 'column',
    alignItems: 'center',
    gap: Platform.OS != "web" ?  50 : 100,
    paddingHorizontal: 24,
  },
  containerIntro: {
    marginTop: Platform.OS != "web" ?  10 : 30,
    flexDirection: 'column',
    alignItems: Platform.OS === "web" ? 'center' : 'flex-start',
    gap: Platform.OS != "web" ?  23 : 30,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontFamily: typography.appFont[400],
  },
  mainText: {
    fontSize: 35,
    fontFamily: typography.appFont[700],
    lineHeight: 50,
    maxWidth: "90%",
    marginTop: Platform.OS != "web" ? "15%" : "0%"
  },

  buttonsContainer: {
    // position: "absolute",
    alignSelf: "center",
    width: "100%",
    bottom: 20,
    alignItems: "center",
    rowGap: 10,
  },
  logo: {
    alignSelf: "center",
    fontSize: 25,
    color: "#fff",
    fontFamily: typography.appFont[700],
  },
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 20,
  },
  userType: {
    flex: 1,
    borderColor: colors.__blue_medium,
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    rowGap: 10,
  },
  userTypeText: {
    fontFamily: typography.appFont[700],
    color: "#fff",
    fontSize: 16,
  },
  description: {
    fontFamily: typography.appFont[400],
    color: colors.__blue_dark,
  },
});

export default OnBoarding;
