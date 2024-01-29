import React, { useState, useEffect, memo, FC } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Platform,
  Image,
} from "react-native";
import colors from "../../config/colors";
import Header from "../../components/header/header";
import typography from "../../config/typography";
import { AntDesign } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import SignupInput from "../../components/buttons&inputs/SignupInput";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import axios from "../../hooks/axios/axiosConfig";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import { updateUserInStorage } from "../../hooks/async_storage/updateUserInStorage";
import { uploadImageTos3 } from "../../functionality/uploadImageTos3";
import fetchFCMfromAsync from "../../hooks/async_storage/fetchFCMfromAsync";
import OnBoardingProgressBar from "../../components/progressbar/OnBoardingProgressBar";
import { CurrentUserType } from "../../types";
import { useRouter } from "expo-router";
import { hideKeyboard } from "../../functionality/hideKeyboard";


const SetUpProfile = () => {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string>(
    "https://nooskc90b4cf2d6eb42afbe237f9e66429dc7111611-dev.s3.amazonaws.com/add-user.png"
  );
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const currentUser = useFetchUserDataAsync() as CurrentUserType;
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const sharer = currentUser && currentUser.user_type === "sharer";
  const isDisabled = firstName.trim().length < 3 || lastName.trim().length < 3;

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
  // get permissions
  useEffect(() => {
    const getPermissionAsync = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need media library permission to select an image.");
      }
    };
    getPermissionAsync();
  }, []);
  // updating user data
  const updateUser = async (e: any) => {
    e.preventDefault();
    const cloudFrontURL = await uploadImageTos3(selectedImage);
    try {
      const response = await axios.post(
        "/user/profile-update",
        {
          first_name: firstName,
          last_name: lastName,
          profile: cloudFrontURL,
          bio: bio,
        },
        {
          headers: { "x-access-token": currentUser.token },
        }
      );
      if (response.data && response.data.success) {
        const responseData = response.data;
        updateUserInStorage(responseData.result);
        if (sharer) {
          router.push ('/onboarding/userverification')
        } else {
          router.push ('/onboarding/profilereview')
        }
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.error("Error updating: ", error);
      }
    }
  };
  return (
    <TouchableWithoutFeedback onPress={()=>hideKeyboard}>
      <KeyboardAvoidingView
        style={styles.wrapper}
      >
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.container}>
          <Header
            style={{color: colors.secondary_contrast }}
          />
            <OnBoardingProgressBar progress={sharer ? 0.8 : 0.4} />
          <ScrollView
            style={[
              styles.container,
              keyboardVisible ? { marginBottom: 200 } : {},
            ]}
            showsHorizontalScrollIndicator={false}
            >
            <View style={styles.heading_container}>
              <Text style={styles.subTitle}>STEP{sharer ? " 4." : " 2."}</Text>

              <Text style={styles.title}>Tell Us About Yourself</Text>
            </View>
            <ProfileImage
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              />

            <View style={{ marginTop: "10%", marginBottom: "10%", rowGap: 15 }}>
              <View style={{ rowGap: 10 }}>
                <Text style={{ color: colors.__blue_dark }}>Display name</Text>
                <View style={{ rowGap: 10 }}>
                  <SignupInput
                    placeholder={"First Name"}
                    placeholderColor={colors.primary}
                    onChangeText={(value) => setFirstName(value)}
                    />
                  <SignupInput
                    placeholder={"Last Name"}
                    placeholderColor={colors.primary}
                    onChangeText={(value) => setLastName(value)}
                    />
                </View>
              </View>
              <View style={{ rowGap: 5 }}>
                <Text style={{ color: colors.__blue_dark }}>
                  Bio (optional)
                </Text>
                <Text style={{ color: "#fff" }}>
                  Share one cool thing about yourself that will help other users
                  connect with you
                </Text>
                <SignupInput
                  placeholder={"i.e: Half MBA Graduate, half a cooking fan."}
                  multiline={true}
                  style={{ height: 100, borderRadius: 10 }}
                  onChangeText={(value) => setBio(value)}
                  placeholderColor={colors.primary}
                  />
              </View>
            </View>
          </ScrollView>
          <View
            style={{ paddingHorizontal: 24, paddingBottom: 20, rowGap: 15 }}
            >
            <CustomButton
              text={"Save Profile"}
              borderStyle={{
                backgroundColor: isDisabled
                ? colors.__disabled_button
                : colors.__teal_light,
                borderRadius: 4,
              }}
              textStyle={{ fontFamily: typography.appFont[700] }}
              onPress={updateUser}
              disabled={isDisabled}
              />
            {!sharer && (
              <TouchableOpacity
              onPress={() => {
                router.push ('/onboarding/interests')
              }}
              >
                <Text style={{ alignSelf: "center", color: "#4B5567" }}>
                  Skip for now
                </Text>
              </TouchableOpacity>
            )}
          </View>
            </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

type ProfileImageProps = {
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
};


const ProfileImage: React.FC<ProfileImageProps> = ({ selectedImage, setSelectedImage }) => {
  const handleSelectImage = async () => {
    let result;
    result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (result?.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      if (selectedUri) {
        setSelectedImage(selectedUri);
      }
    }
  };

  return (
    <View style={styles.profileImageContainer}>
      <TouchableOpacity onPress={handleSelectImage}>
        <AntDesign
          name="plussquareo"
          size={27}
          color={colors.__blue_dark}
          style={styles.icon}
        />
      </TouchableOpacity>
      {selectedImage && (
        <Image
          source={{
            uri: selectedImage,
          }}
          resizeMode="cover"
          style={styles.photo}
        />
      )}
    </View>
  );
};

// const RadioButton = ({ isAnon, setIsAnon }) => {
//   return (
//     <TouchableOpacity
//       style={{ flexDirection: "row", columnGap: 5 }}
//       onPress={() => setIsAnon(!isAnon)}
//     >
//       <View
//         style={{
//           width: 16,
//           height: 16,
//           borderRadius: 100,
//           borderBlockColor: "#000",
//           borderWidth: 1,
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 3,
//         }}
//       >
//         {isAnon && (
//           <View
//             style={{
//               width: 10,
//               height: 10,
//               borderRadius: 100,
//               backgroundColor: "#000",
//             }}
//           ></View>
//         )}
//       </View>
//       <Text>Keep me anon (use @username instead)</Text>
//     </TouchableOpacity>
//   );
// };

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : "gray",
    paddingTop: Platform.OS === "android" ? 30 : 0,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  container: {
    paddingHorizontal: 24,
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : colors.__main_blue,
  },
  title: {
    textAlign: "center",
    fontFamily: typography.appFont[700],
    color: "#fff",
    fontSize: 20,
  },
  subTitle: {
    fontFamily: typography.appFont[400],
    color: colors.w_contrast,
    fontSize: 13,
    textAlign: "center",
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#E8E8F0",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 5,
    // alignSelf: "center",
    marginTop: "10%",
  },
  photo: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 8,
    zIndex: -1,
  },
  icon: {
    zIndex: 200,
  },
  heading_container: {
    marginTop: Platform.OS != 'web' ? "10%" : "3%",
    rowGap: 10,
  },
});

export default memo(SetUpProfile);
