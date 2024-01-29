import React, { useEffect, useState, useRef, FC } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import UserInfo from "../../components/personal_profile/UserInfo";
import UserContentNew from "../../components/personal_profile/UserContentNew";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import fetchUserData from "../../hooks/users/fetchUserData";
import { BottomSheetModalProvider, BottomSheetModal } from "@gorhom/bottom-sheet";
import EditProfile from "../../components/bottomSheets/EditProfile";
import Loading from "../../components/Loading/Loading";
import fetchUserPostsAndTotals from "../../hooks/posts/fetchUserPostsAndTotals";
import { UserData, PostType } from "../../types";
import { useLocalSearchParams, useRouter } from "expo-router";



const PersonalProfileNew = () => {
  const currentUser = useFetchUserDataAsync();
  const { id } = useLocalSearchParams();
  const user_id = id as string; 
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
          user_id,
          currentUser.token
        );
        setUserData(fetchedUserData);
        setLoading(false);
      }
    };
    fetch_user_data();
  }, [currentUser, user_id]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser) {
        const fetchedPosts = await fetchUserPostsAndTotals(
          page,
          500,
          user_id,
          currentUser.token
        );
          setUserLikes(fetchedPosts.total_appreciations);

      }
    };
    fetchPosts();
  }, [currentUser, user_id]);

  //bottomSheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  if (loading) return <Loading />;
  return (
    <View style={styles.safe_area}>
      <BottomSheetModalProvider>
        <ScrollView showsVerticalScrollIndicator={false}>
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
        </ScrollView>
        {userData && (
          <EditProfile
            bottomSheetModalRef={bottomSheetModalRef}
            userData={userData}
          />
        )}
      </BottomSheetModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  safe_area: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: 800,
    width: "100%",
    alignSelf: "center"
  },
  container: {
    flex: 1,
    paddingBottom: 60,
  },
});

export default PersonalProfileNew;
