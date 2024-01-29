import React, { useEffect, useState, useRef, FC } from "react";
import { SafeAreaView, Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, Pressable, Keyboard } from "react-native";
import colors from "../../config/colors";
import typography from "../../config/typography";
import Header from "../../components/header/header";
import LoadingScreen from "@/components/homeloading/LoadingScreen";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import Requests from "../../components/content/Requests";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import SearchComponent from "../../components/search/SearchComponent";
import fetchAndFilterPost from "../../hooks/posts/fetch&filterPosts";
import ErrorScreen from "../Errors/ErrorScreen";
import GroupContentNew from "../../components/content/GroupContentNew";
import fetchForYouPosts from "../../hooks/posts/fetchForYouPosts";
import fetchCategoryPosts from "../../hooks/posts/fetchCategoryPosts";
import { Ionicons } from "@expo/vector-icons";
import fetchRequestsByCategory from "../../hooks/requests/fetchRequestsByCategory";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PostType, Request ,ChatRoomType } from "../../types";
import { useRouter, useLocalSearchParams } from "expo-router";
import AllChatByCategory from "../../components/chat/AllChatByCategory";
import { getChatRoomBySubcategory } from "../../hooks/chat/chatApi";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import CreateChatRoomModal from "../../components/bottomSheets/CreateChatRoom";



const SelectedCategory = () => {
  const router = useRouter();
  const { subCategoryId, subCategoryName } = useLocalSearchParams<{ subCategoryId: string, subCategoryName: string }>();
  const CategoryID = subCategoryId;
  const [section, setSection] = useState("Latest");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [requests, setRequests] = useState<Request[]>();
  const [chatRooms,setChatRooms]=useState<ChatRoomType[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean | null>(null);(null);
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
  const [refreshing, setRefreshing] = useState(false);
  //fetching currentuser from Async Storage
  const currentUser = useFetchUserDataAsync();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (currentUser && subCategoryId) {
        try {
          //fetching post by category
          const fetchedPosts = await fetchCategoryPosts(
            [subCategoryId],
            // currentUser.subcategory_id,
            // currentUser.interest_id,
            page,
            20,
            currentUser.token
          );

          if (fetchedPosts.length > posts.length) {
            setPosts(fetchedPosts);
            setError(false);
          }

          const fetchedRequests = await fetchRequestsByCategory(
            [subCategoryId],
            page,
            50,
            currentUser.token
          );
          setRequests(fetchedRequests);
          setError(false);

          const fetchedChatRooms=await getChatRoomBySubcategory([subCategoryId],currentUser.token);
          setChatRooms(fetchedChatRooms);
          setError(false);
        } catch (error) {
          setError(true);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };
    fetchData();
  }, [currentUser, CategoryID, refreshing]);
  //making sure in case of errors loading posts page goes back to 0
  useEffect(() => {
    if (posts.length === 0) {
      setPage(0);
    }
  }, [posts]);

  //refreshing on scroll
  const onRefresh = () => {
    setRefreshing(true);
    setPage(0);
  };

  const morePosts = async () => {
    if (currentUser && fetchStatus === FetchStatus.IDLE) {
      setFetchStatus(FetchStatus.FETCHING);
      try {
        const fetchedPosts = await fetchForYouPosts(
          currentUser.subcategory_id,
          currentUser.interest_id,
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
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    const currentTime = Date.now();

    if (
      currentTime - lastCalled.current > 1000 &&
      fetchStatus === FetchStatus.IDLE &&
      offsetY + layoutHeight >= contentHeight - 500
    ) {
      lastCalled.current = currentTime; // Update the timestamp of the last API call
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

   const bottomSheetModalRef= useRef<any>(null);

   function handlePresentModal() {
   bottomSheetModalRef.current?.present();
 }
  
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen state={error} setState={setError} onRefresh={onRefresh} />
    );
  }

  return (
    <Pressable style={styles.wrapper} onPress={()=>Keyboard.dismiss()}>    
    <BottomSheetModalProvider>
    <CreateChatRoomModal modalRef={bottomSheetModalRef} token={currentUser?.token} subcategory={subCategoryId}/>
    
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
        <View style={styles.topSection}>
          <View>
            <Header isSearch={isSearch} setIsSearch={setIsSearch} />
          </View>

          {isSearch && (
            <SearchComponent
              token={currentUser && currentUser ? currentUser.token : null}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          )}
          <View style={[styles.sub_title]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>

              <Text style={styles.sub_heading}>{subCategoryName}</Text>
            </View>
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 10,
              }}
            >
              <TouchableOpacity>
                <Ionicons
                  name="ios-share-social-outline"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <CustomButton
                text="Post"
                borderStyle={[styles.postButtonStyle]}
                textStyle={styles.postButtonTextStyle}
              />
            </View> */}
          </View>
          <Sections section={section} setSection={setSection} />
        </View>
        <View
          style={[
            styles.container,
            section === "requests" ? { paddingHorizontal: 0 } : {},
          ]}
        >
          {section === "Latest" && (
            <GroupContentNew posts={posts} page={page} />
          )}

          {section === "requests" && requests && (
            <Requests requests={requests} />
          )}
          {section === "chats" && chatRooms && (
            <AllChatByCategory chatRooms={chatRooms} />
          )}
        </View>
      </ScrollView>
      {section === "requests" && (
        <View style={styles.requestButton}>
          <CustomButton
            text="Submit a Request"
            borderStyle={[styles.buttonStyle, { width: "100%" }]}
            onPress={() => router.push("postcreation/createrequest")}
          />
        </View>
      )}

      {section === "chats" && (
        <CreateChatRoomButton handlePresentModal={handlePresentModal}/>
      )}
      
     
    </BottomSheetModalProvider> 
    </Pressable>
     
  );
};

type SectionsProps = {
  section: string;
  setSection: (section: string) => void;
};

const Sections: React.FC<SectionsProps> = ({ section, setSection }) => {
  return (
    <View
      style={[
        styles.selectionContainer,
        // section === "requests" ? { paddingHorizontal: 15 } : {},
      ]}
    >
      <TouchableOpacity onPress={() => setSection("Latest")}>
        <Text
          style={[
            styles.selectionText,
            section === "Latest" ? styles.currentSelectionText : {},
          ]}
        >
          Latest
        </Text>
        {section === "Latest" && <View style={styles.underlineBar}></View>}
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
       <TouchableOpacity onPress={() => setSection("chats")}>
        <Text
          style={[
            styles.selectionText,
            section === "chats" ? styles.currentSelectionText : {},
          ]}
        >
          Discussions
        </Text>
        {section === "chats" && <View style={styles.underlineBar}></View>}
      </TouchableOpacity>
    </View>
  );
};

const CreateChatRoomButton=({handlePresentModal}:{handlePresentModal:any})=>{
    return(
    <View style={styles.createDiscussion}>
             <CustomButton
            text="Start a Discussion"
            borderStyle={[styles.buttonStyle2]}
            textStyle={styles.creatorText}
            onPress={()=>handlePresentModal()}
          />
        </View>
    )
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  topSection: {
    backgroundColor: colors.__main_blue,
    paddingHorizontal: 15,
    rowGap: 20,
    paddingTop: Platform.OS != 'web' ? "12%": "0%",
    paddingBottom: 10,
    marginBottom: 15,
  },
  container: {
    paddingHorizontal: 15,
    rowGap: 20,
    paddingTop: Platform.OS === "android" ? 40 : 0,
    paddingBottom: 150,
  },
  sub_heading: {
    color: "#fff",
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
  },
  sub_title: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  selectionContainer: {
    flexDirection: "row",
    marginLeft: "5%",
    // justifyContent: "center",
    columnGap: 25,
  },
  underlineBar: {
    backgroundColor: colors.__teal_light,
    width: "80%",
    height: 3,
    alignSelf: "center",
    marginTop: 3,
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
    width: 100,
    alignSelf: "flex-end",
    borderRadius: 4,
    backgroundColor: colors.__teal_light,
  },
  postButtonStyle: {
    height: 30,
    width: 80,
    borderRadius: 30,
    backgroundColor: colors.__teal_light,
  },
  postButtonTextStyle: {
    fontFamily: typography.appFont[600],
  },
  requestButton: {
    paddingHorizontal: 24,
    position: "absolute",
    bottom: "9%",
    alignSelf: "center",
    width: "100%",
  },
   creatorText: {
    color: colors.__teal_light,
    fontFamily: typography.appFont[700],
  },
   createDiscussion: {
    backgroundColor: "#0D0D0C",
    padding: 5,
    position: "absolute",
    bottom: "10%",
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderColor: colors.__teal_light,
    borderWidth: 1,
  },
    buttonStyle2: {
    width: 140,
    alignSelf: "flex-end",
    borderRadius: 4,
    // backgroundColor: colors.__teal_light,
    backgroundColor: "transparent",
  },
});

export default SelectedCategory;
