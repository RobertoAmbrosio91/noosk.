import React, { useEffect, useState, useRef, FC } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Platform } from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import UserInfo from "../../components/personal_profile/UserInfo";
import UserContentNew from "../../components/personal_profile/UserContentNew";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import fetchUserData from "../../hooks/users/fetchUserData";
import { BottomSheetModalProvider, BottomSheetModal } from "@gorhom/bottom-sheet";
import EditProfile from "../../components/bottomSheets/EditProfile";
import Loading from "../../components/Loading/Loading";
import fetchUserPostsAndTotals from "../../hooks/posts/fetchUserPostsAndTotals";
import { UserData, PostType } from "../../types";

type PersonalProfileNewProps = {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { user_id: string } }, 'params'>;
};


const PersonalProfileNew: FC<PersonalProfileNewProps> = ({ route }) => {
  const currentUser = useFetchUserDataAsync();
  console.log ("This is current user", currentUser)
  const [userData, setUserData] = useState<UserData | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [userLikes, setUserLikes] = useState<number | null>(null); // Assuming userLikes is a number
  const [page, setPage] = useState(0);

  //fetching user data
  useEffect(() => {
    const fetch_user_data = async () => {
      
      setLoading(true);
      if (currentUser) {
        const fetchedUserData = await fetchUserData(
          currentUser._id,
          currentUser.token
        );
        setUserData(fetchedUserData);
        setLoading(false);
      }
    };
    fetch_user_data();
  }, [currentUser]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser) {
        try {
          const fetchedPosts = await fetchUserPostsAndTotals(
            page,
            500,
            currentUser._id,
            currentUser.token
          );
  
          if (fetchedPosts && fetchedPosts.total_appreciations !== undefined) {
            setUserLikes(fetchedPosts.total_appreciations);
          } else {
            console.error("fetchedPosts is undefined or total_appreciations is not present");
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };
    fetchPosts();
  }, [currentUser, page, ]);

  //bottomSheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  if (loading) return <Loading />;
  return (
    <View style={styles.safe_area}>
        <ScrollView showsVerticalScrollIndicator={false}>
      <BottomSheetModalProvider>
          <View style={styles.container}>
            {userData && (
              <UserInfo
                userData={userData}
                handlePresentModal={handlePresentModal}
                userLikes={userLikes}
              />
            )}
            {userData && userData.user_type === 'sharer' && <UserContentNew userData={userData} />}
          </View>
        {userData && (
          <EditProfile
          bottomSheetModalRef={bottomSheetModalRef}
          userData={userData}
          />
          )}
      </BottomSheetModalProvider>
          </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe_area: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    paddingBottom: Platform.OS != 'web' ? 60 : 0,
    

  },
});

export default PersonalProfileNew;
