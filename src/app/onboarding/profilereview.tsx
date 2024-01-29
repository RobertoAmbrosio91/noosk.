import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { router, useNavigation, useRouter } from "expo-router";
import colors from "../../config/colors";
import typography from "../../config/typography";
import Header from "../../components/header/header";
import OnBoardingProgressBar from "../../components/progressbar/OnBoardingProgressBar";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import fetchUserData from "../../hooks/users/fetchUserData";
import { UserData, CurrentUserType } from "../../types";

type RootStackParamList = {
  CreationHub: undefined;
  HomeNew: undefined;
};


const ProfileReview: React.FC = () => {
  const router = useRouter()
  const currentUser = useFetchUserDataAsync();
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser) {
        try {
          const fetchedData = await fetchUserData(currentUser._id, currentUser.token);
          if (fetchedData) {
            setUserData(fetchedData);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUser();
  }, [currentUser]);

  const sharer =
    currentUser && currentUser.user_type === "sharer" ? true : false;

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Header />
        <OnBoardingProgressBar progress={1} />
        <View style={styles.heading_container}>
          <Text style={styles.subTitle}>FINAL STEP</Text>
          <Text style={styles.title}>Final Review</Text>
          <Text style={styles.subTitle}>
            Take a final look at your profile on Noosk
          </Text>
        </View>
        {userData && (
          <ScrollView
          showsHorizontalScrollIndicator={false}
          style={styles.reviewScrollView}
          >
            <View style={styles.userData}>
              <Image
                source={{ uri: currentUser?.profile }}
                style={styles.profileImage}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {sharer ? (
                  <Text style={styles.username}>
                    {userData.first_name} {userData.last_name}
                  </Text>
                ) : (
                  <Text style={styles.username}>{currentUser?.user_name}</Text>
                )}
                {userData.social_links && (
                  <View style={{ flexDirection: "row", columnGap: 15 }}>
                    {userData.social_links.instagram && (
                      <TouchableOpacity>
                        <AntDesign
                          name="instagram"
                          size={24}
                          color={colors.__blue_light}
                        />
                      </TouchableOpacity>
                    )}
                    {userData.social_links.twitter && (
                      <TouchableOpacity>
                        <AntDesign
                          name="twitter"
                          size={24}
                          color={colors.__blue_light}
                        />
                      </TouchableOpacity>
                    )}
                    {userData.social_links.linkedin && (
                      <TouchableOpacity>
                        <AntDesign
                          name="linkedin-square"
                          size={24}
                          color={colors.__blue_light}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {userData.bio && <Text style={styles.bio}>{userData.bio}</Text>}

              {sharer && <Verification userData={userData} /> }
              {sharer && <SharerCategories userData={userData} />}
              {userData && userData.interest_data && (
                <Interests userData={userData} />
              )}
            </View>
          </ScrollView>
        )}
        <BottomContainer sharer={sharer} />
      </View>
    </SafeAreaView>
  );
};

type VerificationProps = {
  userData: UserData;
};

const Verification = ({ userData }: VerificationProps) => {
  return (
    <View style={styles.verifiedContainer}>
      <Image
        source={require("../../../assets/images/MEDALLA.png")}
        style={{ width: 50, height: 50 }}
      />
      <View>
        <Text style={styles.textVerified}>
        Your Expertise is Pending Verification
        </Text>
      </View>
    </View>
  );
};

type SharerCategoriesProps = {
  userData: UserData;
};


const SharerCategories = ({ userData } : SharerCategoriesProps) => {
  console.log(userData._id);
  return (
    <View style={{ rowGap: 20 }}>
      <View>
        <Text style={{ color: "#fff" }}>Your Areas of Expertise:</Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            columnGap: 10,
            rowGap: 5,
            flexWrap: "wrap",
          }}
        >
          {userData.subcategory_data &&
            userData.subcategory_data.map((item, index) => (
              <View key={index} style={styles.selectedChoice}>
                <Text style={styles.topicText}>{item.name}</Text>
              </View>
            ))}
        </View>
      </View>
      {userData.talks_about && (
        <View>
          <Text style={{ color: "#fff" }}>Your Spotlight Topics:</Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              columnGap: 10,
              rowGap: 5,
              flexWrap: "wrap",
            }}
          >
            {userData.talks_about.map((item, index) => (
              <View key={index} style={styles.selectedChoice}>
                <Text style={styles.topicText}>#{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};


type InterestsProps = {
  userData: UserData;
};

const Interests = ({ userData } : InterestsProps) => {
  return (
    <View style={{ rowGap: 20 }}>
      <View>
        <Text style={{ color: "#fff" }}>Your Interests:</Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            columnGap: 10,
            rowGap: 5,
            flexWrap: "wrap",
          }}
        >
          {userData.interest_data.map((item, index) => (
            <View key={index} style={styles.selectedChoice}>
              <Text style={styles.topicText}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};



const BottomContainer = ({ sharer }: any) => {
  return (
    <View style={styles.bottomContainer}>
      <CustomButton
        onPress={() =>
          router.replace ({
            pathname: '/feed'
          })
        }
        text={"Join Noosk"}
        textStyle={{
          fontFamily: typography.appFont[700],
        }}
        borderStyle={{ backgroundColor: colors.__teal_light, borderRadius: 4 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : "gray",
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : colors.__main_blue,
  },
  title: {
    fontFamily: typography.appFont[700],
    color: colors.w_contrast,
    fontSize: 20,
    textAlign: "center",
  },
  subTitle: {
    fontFamily: typography.appFont[400],
    color: colors.w_contrast,
    fontSize: 14,
    textAlign: "center",
  },
  heading_container: {
    marginTop: Platform.OS != 'web' ? "10%" : "4%",
    rowGap: 10,
  },
  reviewScrollView: {
    marginBottom: Platform.OS != 'web' ? "0%" : "2%"
  },
  userData: {
    marginTop: Platform.OS != 'web' ? "12%": "3%",
    rowGap: 15,
    paddingBottom: 50,
  },
  profileImage: {
    width: 74,
    height: 74,
    borderRadius: 8,
  },
  username: {
    color: "#fff",
    fontFamily: typography.appFont[700],
    fontSize: 16,
  },
  bio: {
    fontFamily: typography.appFont[400],
    color: "#fff",
    fontSize: 13,
  },
  verifiedContainer: {
    backgroundColor: "#0D0D0C",
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  textVerified: {
    fontFamily: typography.appFont[700],
    color: colors.__teal_dark,
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
export default ProfileReview;
