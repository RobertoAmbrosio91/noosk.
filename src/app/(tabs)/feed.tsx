import React, { useEffect, useState, useRef, memo, FC } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions
} from "react-native";
import colors from "../../config/colors";
import typography from "../../config/typography";
import Header from "../../components/header/header";
import LoadingScreen from '@/components/homeloading/LoadingScreen';
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import Requests from "../../components/content/Requests";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import fetchAllRequests from "../../hooks/requests/fetchAllRequests";
import fetchAllPosts from "../../hooks/posts/fetchAllPosts";
import SearchComponent from "../../components/search/SearchComponent";
import fetchAndFilterPost from "../../hooks/posts/fetch&filterPosts";
import Badge from "../../components/badges/Badge";
import fetchUserData from "../../hooks/users/fetchUserData";
import fetchFCMfromAsync from "../../hooks/async_storage/fetchFCMfromAsync";
import saveToken from "../../hooks/fcm_token/saveFCM";
import ErrorScreen from "../Errors/ErrorScreen";
import GroupContentNew from "../../components/content/GroupContentNew";
import fetchForYouPosts from "../../hooks/posts/fetchForYouPosts";
import { CurrentUserType, PostType, Request } from '../../types';
import { useRouter } from "expo-router";

const window = Dimensions.get('window');
const isLargeScreen = window.width >= 768;

const HomeNew = () => {
  const router = useRouter();
  const [section, setSection] = useState("General");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [forYouPosts, setForYouPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean | null>(null);(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({
    categories_id: [], 
    text_input: "",
  });
  const lastCalled = useRef(Date.now());

  const FetchStatus = {
    IDLE: "IDLE",
    FETCHING: "FETCHING",
    ALL_LOADED: "ALL_LOADED",
  };

  const [fetchStatus, setFetchStatus] = useState(FetchStatus.IDLE);

  const [badge, setBadge] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  //fetching currentuser from Async Storage
  const currentUser = useFetchUserDataAsync();
 

  useEffect(() => {
    if (currentUser === null) {
      router.replace('/login');
    }
  }, [currentUser]);


  const sharer =
    currentUser && currentUser.user_type === "sharer" ? true : false;
  const tokenFCM = fetchFCMfromAsync();

  //saving token im database
  useEffect(() => {
    if (tokenFCM && currentUser) {
      saveToken(tokenFCM, currentUser.token);
    }
  }, [tokenFCM, currentUser]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (currentUser) {
        try {
          const fetchedPosts = await fetchAllPosts(page, 20, currentUser.token);
          if (fetchedPosts.length > posts.length) {
            setPosts(fetchedPosts);
            setError(false);
          }

          const fetchedRequests = await fetchAllRequests(currentUser.token);
          setRequests(fetchedRequests);
          setError(false);

          const fetchedForYouPosts = await fetchForYouPosts(
            currentUser.subcategory_id,
            currentUser.interest_id,
            page,
            20,
            currentUser.token
          );

          if (fetchedForYouPosts.length > forYouPosts.length) {
            setForYouPosts(fetchedForYouPosts);
            setError(false);
          }

          const fetchUser = await fetchUserData(
            currentUser._id,
            currentUser.token
          );
          if (
            fetchUser &&
            fetchUser.first_post_badge.toShow == true &&
            fetchUser.first_post_badge.isShown == false
          ) {
            setBadge(true);
          }
        } catch (error) {
          setError(true);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };
    fetchData();
  }, [currentUser, refreshing]);
  //making sure in case of errors loading posts page goes back to 0
  useEffect(() => {
    if (posts.length === 0) {
      setPage(0);
    }
  }, [posts]);

  //refreshing on scroll
  const onRefresh = () => {
    console.log("called");
    setRefreshing(true);
    setPage(0);
  };

  const morePosts = async () => {
    if (currentUser && fetchStatus === FetchStatus.IDLE) {
      setFetchStatus(FetchStatus.FETCHING);
      try {
        const fetchedPosts = await fetchAllPosts(
          page + 1,
          20,
          currentUser.token
        );
        if (fetchedPosts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
          setPage((prevPage) => prevPage + 1);
          setFetchStatus(FetchStatus.IDLE);
          setError(false);
        } else {
          setFetchStatus(FetchStatus.ALL_LOADED);
          setPage(0);
        }
      } catch (error) {
        setError(true);
        setFetchStatus(FetchStatus.IDLE);
      }
    }
  };

  // // trigger morePost on scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    const currentTime = Date.now();

    if (
      currentTime - lastCalled.current > 1000 &&
      fetchStatus === FetchStatus.IDLE &&
      offsetY + layoutHeight >= contentHeight - 500
    ) {
      lastCalled.current = currentTime;
      morePosts();
    }
  };

  //updating posts on search
  const updatePosts = async () => {
    if (currentUser) {
      try {
        const fetchedPosts = await fetchAndFilterPost(
          0,
          1000,
          selectedFilters.categories_id,
          selectedFilters.text_input,
          currentUser.token
        );
        setPosts(fetchedPosts);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
        setError(false);
      }
    }
  };

  useEffect(() => {
    updatePosts();
  }, [selectedFilters]);
  //scrolling back to top
  const scrollViewRef = useRef(null);
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen state={error} setState={setError} onRefresh={onRefresh} />
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#fff"}
          />
        }
      >
        {badge && <Badge setBadge={setBadge} currentUser={currentUser} />}

        <View
          style={[
            styles.container,
            section === "requests" ? { paddingHorizontal: 0 } : {},
          ]}
        >
          <View style={section === "requests" ? { paddingHorizontal: 15 } : {}}>
            <Header isSearch={isSearch} setIsSearch={setIsSearch} section={section}/>
          </View>

          {isSearch && (
            <SearchComponent
              token={currentUser && currentUser ? currentUser.token : null}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          )}

          <Sections
            section={section}
            setSection={setSection}
          />
          {section === "General" && (
            <GroupContentNew
              posts={posts}
              page={page}
            />
          )}
          {section === "For you" && (
            <GroupContentNew
              posts={forYouPosts}
              page={page}
            />
          )}
          {section === "requests" && (
            <Requests requests={requests} />
          )}
        </View>
      </ScrollView>
      {section === "requests" && (
        <View
          // style={{
          //   paddingHorizontal: 24,
          //   position: "absolute",
          //   bottom: "9.1%",
          //   alignSelf: "center",
          //   width: "100%",
          // }}
          style={styles.creatorHubButton}
        >
          <CustomButton
            text="Submit a Request"
            borderStyle={[styles.buttonStyle]}
            textStyle={styles.creatorText}
            onPress={() => {
                router.push('/postcreation/createrequest');
            }}

          />
        </View>
      )}
      {/* {sharer && <CreatorHub navigation={navigation} />} */}


    </SafeAreaView>
  );
};


type SectionsProps = {
  section: string;
  setSection: (section: string) => void;
};



const Sections: React.FC<SectionsProps> = ({ section, setSection }) => {
  return (
    <View style={styles.selectionContainer}>
      <TouchableOpacity onPress={() => setSection("General")}>
        <Text
          style={[
            styles.selectionText,
            section === "General" ? styles.currentSelectionText : {},
          ]}
        >
          General
        </Text>
        {section === "General" && <View style={styles.underlineBar}></View>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSection("For you")}>
        <Text
          style={[
            styles.selectionText,
            section === "For you" ? styles.currentSelectionText : {},
          ]}
        >
          For You
        </Text>
        {section === "For you" && <View style={styles.underlineBar}></View>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setSection("requests")}>
        <Text
          style={[
            styles.selectionText,
            section === "requests" ? styles.currentSelectionText : {},
          ]}
        >
          Requests
        </Text>
        {section === "requests" && <View style={styles.underlineBar}></View>}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.__main_blue,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    paddingTop: Platform.OS === 'web' ? 8 : 0,
  },
  container: {
    paddingHorizontal: 15,
    rowGap: 20,
    paddingTop: Platform.OS === "android" ? 40 : 0,
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : colors.__main_blue,

  },

  sub_heading: {
    color: "#fff",
    fontSize: typography.h3.fontSize, // Use fontSize instead of heading_size
    fontWeight: typography.h3.fontWeight,
  },
  sub_title: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 10,
  },
  underlineBar: {
    backgroundColor: colors.__teal_light,
    width: "80%",
    height: 3,
    alignSelf: "center",
    marginTop: 5,
    borderRadius: 5,
  },
  selectionText: {
    fontSize: 14,
    fontFamily: typography.appFont[400],
    color: colors.secondary_contrast,
  },
  currentSelectionText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: typography.appFont[700],
  },
  buttonStyle: {
    width: 140,
    alignSelf: "flex-end",
    borderRadius: 4,
    // backgroundColor: colors.__teal_light,
    backgroundColor: "transparent",
  },
  creatorText: {
    color: colors.__teal_light,
    fontFamily: typography.appFont[700],
  },
  creatorHubButton: {
    backgroundColor: "#0D0D0C",
    padding: 5,
    position: "absolute",
    bottom: "3%",
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderColor: colors.__teal_light,
    borderWidth: 1,
  },
});

export default memo(HomeNew);
