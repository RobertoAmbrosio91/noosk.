import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import typography from "../../config/typography";
import Header from "../header/header";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import CustomButton from "../buttons&inputs/CustomButton";
import endorseUser from "../../hooks/users/endorse";
import Toast from "react-native-root-toast";
import { CurrentUserType } from "../../types";
import { UserData } from "../../types";


interface Subcategory {
  _id: string;
  name: string;
  // ... other properties of subcategory
}

interface UserInfoProps {
  userData: UserData;
  handlePresentModal: () => void;
  userLikes: number | null;
}

interface ProfileImageProps {
  handlePresentModal: () => void;
  currentUser: CurrentUserType | UserData;
  userData: UserData;
}

interface UserInformationProps {
  userData: UserData;
  currentUser: CurrentUserType;
  endorse: () => void;
  showToast: boolean;
  setShowToast: (showToast: boolean) => void;
}



const UserInfo: React.FC<UserInfoProps> = ({
  userData,
  handlePresentModal,
  userLikes,
}) => {
  const currentUser = useFetchUserDataAsync();
  const [userDetails, setUserDetails] = useState<UserData>(userData);
  const [showToast, setShowToast] = useState(false);

  // handling endorse user
  const endorse = async () => {
    if (currentUser && currentUser && userData) {
      const result = await endorseUser(userData._id, currentUser.token);
      if (result && result.success) {
        handleEndorseChange();
      }
    }
  };
  //real time endorsment chenge
  const handleEndorseChange = () => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      endorse: {
        ...prevDetails.endorse,
        isEndorseByMe: prevDetails.endorse ? !prevDetails.endorse.isEndorseByMe : false,
      },
    }));
  };



  return (
    <View style={styles.profile_top_side}>
      <Header />
      {currentUser && userData && (
        <ProfileImage
          handlePresentModal={handlePresentModal}
          currentUser={currentUser}
          userData={userData}
        />
      )}
      <View style={styles.profileHeaderFollowers}>
      {userData && userData.endorse &&  (
          <View style={styles.endorsement}>
            <Text style={styles.endorsementText}>
              {userData.endorse.endorseCount}{" "}
              </Text>
              <Text style={styles.endorsementNumber}>
              {userData.endorse.endorseCount === 1
                ? "Follower"
                : "Followers"}
                </Text>
          </View>
        )}

      <View style={styles.likesfollowerSeparator}></View>          

      
          <View style={styles.endorsement}>
            <Text style={styles.endorsementText}>
              {userLikes}{" "}
              </Text>
              <Text style={styles.endorsementNumber}>
              {userLikes === 1
                ? "Like"
                : "Likes"}
                </Text>
          </View>
       



        </View>
        


      {userDetails && currentUser && (
        <UserInformation
          userData={userDetails}
          currentUser={currentUser}
          endorse={endorse}
          showToast={showToast}
          setShowToast={setShowToast}
        />
      )}
      {/* <Skills skills={skills} /> */}
    </View>
  );
};

const ProfileImage: React.FC<ProfileImageProps> = ({
  handlePresentModal,
  currentUser,
  userData,
}) => {
  if (currentUser && currentUser && userData) {
    return (
      <View style={styles.profile_img_container}>
        <Image
          source={{ uri: `${userData.profile }` }}
          style={styles.profile_img}
        />
        {currentUser._id == userData._id && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 5,
              bottom: 5,
              width: 25,
              height: 25,
              backgroundColor: colors.__blue_dark,
              borderRadius: 4,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 3,
            }}
            onPress={() => handlePresentModal()}
          >
            <FontAwesome
              name="pencil-square-o"
              size={22}
              color={colors.__01_light_n}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
};

const UserInformation: React.FC<UserInformationProps> = ({
  userData,
  currentUser,
  endorse,
  showToast,
  setShowToast,
}) => {
  const {
    user_name,
    subcategory_data,
    _id,
    first_post_badge,
    first_name,
    last_name,
    bio,
    interest_data,
    talks_about,
  } = userData || {};
  const [isTruncated, setIsTruncated] = useState(true);
  const toggleBio = () => {
    setIsTruncated(!isTruncated);
  };

  const renderBio = () => {
    if (bio) {
      if (isTruncated) {
        return bio.length > 130 ? bio.substring(0, 130) + "..." : bio;
      } else {
        return bio;
      }
    } else {
      return ""; // or any other fallback value you deem appropriate
    }
  };
  

  if (userData && currentUser) {
    return (
      <View style={{ rowGap: 10 }}>
        <View
          style={{
            rowGap: 8,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            // width:"100%"
          }}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.userFirstLast}>
              {" "}
              {userData && userData.user_type === "sharer"
                ? `${first_name} ${last_name}`
                : user_name}
            </Text>
          </View>

          {userData.is_verified && (
            <View style={styles.verifiedContainer}>
              {userData && userData.is_verified && (
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={colors.__teal_light}
                />
              )}
              <Text style={styles.verifiedText}> Verified Noosk expert</Text>
            </View>
          )}

          {currentUser._id != userData._id &&
            userData.user_type === "sharer" && (
              <View style={styles.buttonsContainer}>
                <CustomButton
                  text={userData.endorse?.isEndorseByMe ? "Unfollow" : "Follow"}
                  borderStyle={styles.followButton}
                  onPress={endorse}
                  textStyle={{
                    color: colors.__main_blue,
                    fontFamily: typography.appFont[600],
                  }}
                />
                {/* <CustomButton
              borderStyle={{ backgroundColor: '#54D7B7', width: '10%',  }}
              hasIcon={true}
              icon={"link"}
            /> */}
              </View>
            )}

          {userData && userData.user_type === "sharer" && (
            <View style={styles.expertiseSection}>
              <Text style={styles.expertiseSectionTitle}>Expertise</Text>
              <View style={styles.expertiseWrapper}>
                {subcategory_data &&
                  subcategory_data.map((item, index) => (
                    <View style={styles.categoryContainer} key={item._id}>
                      <Text style={styles.userExpertise}>{item.name}</Text>
                      {index !== subcategory_data.length - 1 && (
                        <View style={styles.dot}></View>
                      )}
                    </View>
                  ))}
              </View>

              {talks_about && talks_about.length > 0 && (
                <View style={styles.talksAboutWrapper}>
                  <Text style={{ color: "#647189", fontSize: 12 }}>
                    Talks about:{" "}
                  </Text>
                  {talks_about &&
                    talks_about.map((item, index) => (
                      <View style={styles.talksAbout} key={index}>
                        <Text style={styles.talksAboutText}>
                          #{item}
                          {index != talks_about.length - 1 ? ", " : ""}
                        </Text>
                      </View>
                    ))}
                </View>
              )}
            </View>
          )}
        </View>

        {bio && <View style={styles.separator}></View>}

        {bio && (
          <View style={styles.userBio}>
            {/* <Text style={styles.userBioTitle}>About</Text> */}
            <View>
              <Text style={styles.userBioText}>{renderBio()}</Text>
              {bio.length > 200 && (
                <TouchableOpacity onPress={toggleBio}>
                  <Text style={styles.showMoreText}>
                    {isTruncated ? "Show more" : "Show less"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {interest_data && interest_data.length > 0 && (
          <View style={styles.separator}></View>
        )}
        {interest_data && interest_data.length > 0 && (
          <View style={styles.interestsWrapper}>
            <Text style={{ color: "#647189", fontSize: 14 }}>
              Interested in:
            </Text>
            {interest_data &&
              interest_data.map((item, index) => (
                <View style={styles.categoryContainer} key={item._id}>
                  <Text style={styles.interestsText}>{item.name}</Text>
                  {index != interest_data.length - 1 && (
                    <View style={styles.dot}></View>
                  )}
                </View>
              ))}
          </View>
        )}

        <View style={styles.separator}></View>

        {first_post_badge && first_post_badge.toShow && (
          <>
            <Text style={styles.trophyRoomText}>TROPHY ROOM</Text>
            <Badges showToast={showToast} setShowToast={setShowToast} />
          </>
        )}
      </View>
    );
  }
};

const Badges: React.FC<{ showToast: boolean; setShowToast: (showToast: boolean) => void; }> = ({
  showToast,
  setShowToast,
}) => {
  return (
    <View style={{ flexDirection: "row", columnGap: 5, alignSelf: "center" }}>
      <TouchableOpacity onPress={() => setShowToast(!showToast)}>
        <Image
          source={require("../../../assets/images/badges/first_post_medail.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
      <Toast
        visible={showToast}
        position={550}
        shadow={false}
        animation={true}
        hideOnPress={true}
      >
        First Post Badge
      </Toast>
    </View>
  );
};

const styles = StyleSheet.create({
  profile_top_side: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS != 'web' ? "15%": 8,
    rowGap: 10,
    // flex: Platform.OS != 'web' ? 1 : 0.5,
    backgroundColor: colors.__main_blue,
    paddingBottom: Platform.OS != 'web' ? 20 : 20,
  },
  profileHeaderFollowers: {
    flexDirection: "row",
    gap: 20,
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  profile_img_container: {
    height: 70,
    width: 70,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignSelf: "center",
  },
  profile_img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
    borderRadius: 8,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userFirstLast: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  talksAboutWrapper: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  talksAbout: {
    flexDirection: "row",
  },
  talksAboutText: {
    color: "white",
    fontSize: 12,
    fontFamily: typography.appFont[300],
    flexWrap: "wrap",
    fontStyle: "italic",
  },
  userBio: {
    gap: 5,
    marginBottom: 10,
  },
  userBioTitle: {
    color: "white",
    fontSize: 15,
    fontFamily: typography.appFont[700],
    lineHeight: 22.5,
    flexWrap: "wrap",
  },
  userBioText: {
    color: "white",
    fontSize: 15,
    fontFamily: typography.appFont[300],
    lineHeight: 22.5,
    flexWrap: "wrap",
  },
  showMoreText: {
    color: "#647189",
    fontSize: 15,
    fontFamily: typography.appFont[300],
    lineHeight: 22.5,
    flexWrap: "wrap",
  },
  skills_container: {
    borderColor: "#8FA7C0",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
    marginRight: 5,
  },
  skills_text: {
    fontSize: 14,
    color: "#8FA7C0",
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignContent: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  verifiedContainer: {
    flexDirection: "row",
    // gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 5,
    // marginBottom: 5,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "#54D7B7",
    fontFamily: typography.appFont[600],
    fontSize: 11,
  },
  verifiedTextTalks: {
    color: "#FFFFFF",
    fontFamily: typography.appFont[400],
    fontSize: 12,
  },
  trophyRoomText: {
    textAlign: "center",
    letterSpacing: 3,
    fontFamily: typography.appFont[500],
    color: colors.__blue_dark,
  },
  expertiseSection: {
    // marginVertical: 10,
    backgroundColor: "#0D0D0C",
    paddingVertical: 15,
    paddingHorizontal: 23,
    borderRadius: 20,
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  expertiseSectionTitle: {
    alignSelf: "center",
    color: "white",
    fontSize: 14,
    fontFamily: typography.appFont[500],
    marginBottom: 10,
  },
  userExpertise: {
    fontFamily: typography.appFont[500],
    color: "#8FA3C8",
    fontSize: 14,
    textAlign: "center",
  },
  interestsText: {
    fontFamily: typography.appFont[500],
    color: "white",
    fontSize: 14,
    textAlign: "left",
  },
  categoryContainer: {
    flexDirection: "row",
    columnGap: 5,
    alignItems: "center",
  },
  expertiseWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 5,
  },
  interestsWrapper: {
    flexDirection: "row",
    columnGap: 5,
    flexWrap: "wrap",
  },
  endorsement: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  endorsementText: {
    color: "#D1DAEA",
    fontSize: 14,
    lineHeight: 14,
    flexWrap: "wrap",
    fontFamily: typography.appFont[700],
    alignSelf: "center",
  },
  endorsementNumber: {
    color: "#D1DAEA",
    fontSize: 14,
    fontFamily: typography.appFont[400],
    lineHeight: 14,
    flexWrap: "wrap", // This is the equivalent of 'word-wrap' in CSS
  },
  separator: {
    borderWidth: 0.5,
    borderColor: "#647189",
    backgroundColor: "#647189",
    marginVertical: 10,
    width: "100%",
  },
  likesfollowerSeparator: {
    flexDirection: "row",
    backgroundColor: "#647189",
    borderWidth: 0.5,
    borderColor: "#647189",
    // marginHorizontal: 10,
  },
  followButton: {
    backgroundColor: "#54D7B7",
    width: 100,
    borderColor: "#54D7B7",
    borderWidth: 1,
  },
});

export default UserInfo;
