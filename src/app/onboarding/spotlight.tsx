import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import Header from "../../components/header/header";
import colors from "../../config/colors";
import OnBoardingProgressBar from "../../components/progressbar/OnBoardingProgressBar";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import typography from "../../config/typography";
import SignupInput from "../../components/buttons&inputs/SignupInput";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "../../hooks/axios/axiosConfig";
import { updateUserInStorage } from "../../hooks/async_storage/updateUserInStorage";
import { useRouter } from "expo-router";
import { hideKeyboard } from "../../functionality/hideKeyboard";

const OnBoardingSpotlight: React.FC = () => {
  const router = useRouter()
  const currentUser = useFetchUserDataAsync();
  const sharer = currentUser && currentUser.user_type === "sharer";
  const [spotLight, setSpotlight] = useState<string[]>([]);
  const [spotlightValue, setSpotLightValue] = useState<string>('');
  const isDisabled = spotLight.length > 0 ? false : true;


  const handleSpotlight = (item: string) => {
    setSpotlight([...spotLight, item.trim()]);
    setSpotLightValue("");
  };
  const handleUpdate = async () => {
    if (currentUser) {
      try {
        const response = await axios.post(
          "/user/profile-update",
          {
            talks_about: spotLight,
          },
          {
            headers: {
              "x-access-token": currentUser.token,
            },
          }
        );
        if (response && response.data.success) {
          updateUserInStorage(response.data.result);
          router.replace ('onboarding/interests')
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <TouchableWithoutFeedback onPress={()=>hideKeyboard}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <Header />
          <OnBoardingProgressBar progress={0.4} />
          <View style={styles.heading_container}>
            <Text style={styles.subTitle}>STEP 2.</Text>
            <Text style={styles.title}>What are your Spotlight Topics</Text>
            <Text style={styles.subTitle}>
              Choose up to three topics where you believe you can be helpful to
              the community
            </Text>
          </View>
          <View style={{ marginTop: 30, rowGap: 5 }}>
            <Text style={{ color: "#647189" }}>
              What are your spotlight topics?
            </Text>
            <View style={styles.inputContainer}>
              <SignupInput
                placeholder="Ie: Growth, Finance and Investing"
                style={styles.input}
                value={spotlightValue}
                onChangeText={(value) =>
                  setSpotLightValue((prevState) => value)
                }
              />
              <TouchableOpacity onPress={() => handleSpotlight(spotlightValue)}>
                <AntDesign name="pluscircleo" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              columnGap: 5,
              rowGap: 5,
              flexWrap: "wrap",
            }}
          >
            {spotLight.length > 0 &&
              spotLight.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectedChoice}
                  onPress={() => {
                    setSpotlight((prevSpot) =>
                      prevSpot.filter((i) => i !== item)
                    );
                    setSpotlight((prevSelected) =>
                      prevSelected.filter((t) => t !== item)
                    );
                  }}
                >
                  <Text style={styles.topicText}>{item}</Text>
                  <Ionicons name="close" size={15} color="#fff" />
                </TouchableOpacity>
              ))}
          </View>
          <View style={styles.bottomContainer}>
            <CustomButton
              text={"Continue"}
              textStyle={{
                fontFamily: typography.appFont[700],
              }}
              borderStyle={{
                backgroundColor: isDisabled
                  ? colors.__disabled_button
                  : colors.__teal_light,
                borderRadius: 4,
              }}
              onPress={handleUpdate}
              disabled={isDisabled}
            />
            <TouchableOpacity
              onPress={() =>
                router.replace ('onboarding/interests')
              }
            >
              <Text style={{ color: "#4B5567" }}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : colors.__01_light_n,
  },
  container: {
    flex: 1,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : colors.__main_blue,
  },
  heading_container: {
    marginTop: Platform.OS != 'web' ? "10%" : "3%",
    rowGap: 10,
  },
  subTitle: {
    fontFamily: typography.appFont[400],
    color: colors.w_contrast,
    fontSize: 13,
    textAlign: "center",
  },
  title: {
    fontFamily: typography.appFont[700],
    color: colors.w_contrast,
    fontSize: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  input: {
    width: "90%",
    borderColor: "transparent",
  },
  selectedChoice: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.__teal_light,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(84, 215, 183, 0.50)",
  },
  topicText: {
    fontFamily: typography.appFont[400],
    color: colors.w_contrast,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
    rowGap: 15,
  },
});
export default OnBoardingSpotlight;
