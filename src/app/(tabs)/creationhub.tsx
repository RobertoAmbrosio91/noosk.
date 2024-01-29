import React, { useState, useEffect, useRef  } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Platform,RefreshControl, Pressable, Keyboard } from 'react-native';
import Header from '../../components/header/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupContentCH from '../../components/content/GroupContentCH';
import fetchAllRequests from "../../hooks/requests/fetchAllRequests";
import fetchForYouPosts from "../../hooks/posts/fetchForYouPosts";
import fetchFCMfromAsync from "../../hooks/async_storage/fetchFCMfromAsync";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import fetchUserData from "../../hooks/users/fetchUserData";
import RequestsCH from "../../components/content/RequestsCH";
import fetchUserPostsAndTotals from "../../hooks/posts/fetchUserPostsAndTotals";
import saveToken from "../../hooks/fcm_token/saveFCM";
import { UserData,PostType,PostsResponseType, Request, ChatItemType } from '../../types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import typography from '../../config/typography';
import ChatCH from '@/components/chat/ChatCH';
import { getChatRoomBySubcategory } from '@/hooks/chat/chatApi';
import CustomButton from '@/components/buttons&inputs/CustomButton';
import colors from '@/config/colors';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CreateChatRoomModal from '@/components/bottomSheets/CreateChatRoom';
import {hideKeyboard} from "../../functionality/hideKeyboard";
import NotASharer from '@/components/posts/NotASharer';



interface CreationHubProps {
  isProfile?: boolean; 
}


const CreationHub: React.FC<CreationHubProps> = ({isProfile }) => {
  const params = useLocalSearchParams()
  const router = useRouter()
  const [posts, setPosts] = useState<PostType[]>([]); // Array of PostType
  const [forYouPosts, setForYouPosts] = useState<PostType[]>([]);
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [requests, setRequests] = useState<Request[]>([]);
  const currentUser = useFetchUserDataAsync();
  const sharer =
  currentUser && currentUser.user_type === "sharer" ? true : false;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<any>(); // Specify the type for user posts
  const tokenFCM = fetchFCMfromAsync();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [userChats,setUserChats]=useState<ChatItemType>();
   //refreshing on scroll
  const onRefresh = () => {
    setRefreshing(true);
    setPage(0);
  };

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
          const fetchedRequests = await fetchAllRequests(currentUser.token);
          // Filter requests to only include those in the user's area of expertise
          const expertFilteredRequests = fetchedRequests.filter((request) =>
              currentUser.subcategory_id.includes(request.subcategory_data[0]._id)
          );

          setRequests(expertFilteredRequests);
          setError(null);

          const fetchedForYouPosts: PostType[] = await fetchForYouPosts(
            currentUser.subcategory_id,
            [],
            page,
            300,
            currentUser.token
          );

          if (fetchedForYouPosts.length > forYouPosts.length) {
            const filteredPosts = fetchedForYouPosts.filter(
              (post) => post.post_by_data[0]._id !== currentUser._id
            );
            // setForYouPosts(fetchedForYouPosts);
            setForYouPosts(filteredPosts);
            setError(null);
          }

          const fetchedUserData = await fetchUserData(
            currentUser._id,
            currentUser.token
          );
          
          if (fetchedUserData) {
            setUserData(fetchedUserData);
        } else {
            alert("Error: Unable to fetch user data. Please try again later."); 
        }

        const chats=await getChatRoomBySubcategory(currentUser.subcategory_id,currentUser.token);
        setUserChats(chats);

        } catch (error) {
          setError("An error occurred");
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };
    fetchData();
  }, [currentUser, refreshing]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (currentUser) {
        const fetchedPosts = await fetchUserPostsAndTotals(
          page,
          500,
          currentUser._id,
          currentUser.token
        );

        setUserPosts(fetchedPosts);
      }
    };
    fetchPosts();
  }, [currentUser]);

    const bottomSheetModalRef= useRef<any>(null);

    function handlePresentModal() {
      bottomSheetModalRef.current?.present();
    }

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}  
          refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#fff"}
          />
        }
        >
       {sharer &&   
      <Pressable onPress={()=>hideKeyboard()}>
      <BottomSheetModalProvider>
      <CreateChatRoomModal modalRef={bottomSheetModalRef} token={currentUser?.token} userCategories={userData.subcategory_data}/>
      
        <View style={{ paddingHorizontal: 15 }}>
          <Header />
          <Text style={styles.creatorHubText}>Creator Hub</Text>
          <Text style={styles.creatorHubTextSub}>
            Your personal space to contribute to the community
          </Text>
        </View>
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={() => {
            router.push ('/postcreation/createpost')
          }}
        >
          <Text style={styles.createPostButtonText}>Create a New Post</Text>
        </TouchableOpacity>


          
        <View style={styles.dashboard}>
          <Text style={styles.dashboardTitle}>Your Expert Discussions</Text>

          <ScrollView style={{width:"100%"}} showsVerticalScrollIndicator={false}>
          <ChatCH userChats={userChats}/>
          </ScrollView>
          <View style={styles.startDiscussion}>
            <CustomButton 
              text={"Start a Discussion"} 
              borderStyle={styles.buttonCreateChat} 
              onPress={()=>handlePresentModal()} 
              textStyle={{fontWeight:"700"}}
              />
          </View>
        </View>

        <View style={styles.similarPosts}>
          <Text
            style={{
              fontSize: 12,
              marginTop: 20,
              alignSelf: "center",
              color: "#647189",
            }}
          >
            Posts from other experts
          </Text>
          <Text
            style={{
              fontSize: 18,
              alignSelf: "center",
              fontWeight: "bold",
              padding: 5,
            }}
          >
            Share your knowledge
          </Text>
          <GroupContentCH
            posts={forYouPosts}
            page={page}
            isProfile={isProfile}
          />
        </View>

        <View style={[styles.similarPosts]}>
          <Text
            style={{
              fontSize: 12,
              marginTop: 20,
              alignSelf: "center",
              color: "#647189",
            }}
          >
            Requests
          </Text>
          <Text
            style={{
              fontSize: 18,
              alignSelf: "center",
              fontWeight: "bold",
              padding: 5,
            }}
          >
            Help ohters grow
          </Text>
          <RequestsCH requests={requests}/>
        </View>
      
      </BottomSheetModalProvider>
      </Pressable>
        }
      {!sharer && <NotASharer />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth:800,
    width: "100%",
    alignSelf: "center",
    borderColor: Platform.OS === 'web' ? 'gray' : 'none',
    backgroundColor: "#171C24",
    flexDirection: "column",
    paddingTop: Platform.OS === 'web' ? 8 : 0,
  },
  creatorHubText: {
    color: "white",
    fontSize: 23,
    fontFamily: typography.appFont[700],
    lineHeight: 35,
    flexWrap: "wrap",
    marginTop: 25,
    marginLeft: 17,
  },
  creatorHubTextSub: {
    color: "white",
    fontSize: 14,
    fontFamily: typography.appFont[400],
    lineHeight: 20,
    marginHorizontal: 17,
  },
  createPostButton: {
    backgroundColor: "#54D7B7",
    marginHorizontal: 32,
    fontFamily: typography.appFont[400],
    fontSize: 14,
    borderRadius: 4,
    padding: 12,
    marginVertical: 30,
  },
  createPostButtonText: {
    color: "#171C24",
    textAlign: "center",
    fontWeight: "700",
  },
  dashboard: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    marginHorizontal: 30,
    borderRadius: 8,
    marginBottom: 30,
    height: "25%",
    gap: 15,
  },
  dashboardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop:15
  },
  dashboardNumbers: {
    color: "#171C24",
    textAlign: "center",
    fontSize: 23,
     fontFamily: typography.appFont[400],
  },
  dashboardChild: {
    flexDirection: "row",
    height: "18%",
    marginBottom: 25,
  },
  statistics: {
    padding: 5,
    width: "40%",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statisticsTitle: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  statisticsTitleText: {
    fontSize: 14,
  },
  dashboardText: {
    color: "#171C24",
    textAlign: "center",
    padding: 5,
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "bold", // This is equivalent to 700 in CSS
    lineHeight: 16.8,
    flexWrap: "wrap", // This is the equivalent of 'word-wrap' in CSS
  },
  separator: {
    height: "100%",
    alignSelf: "center",
    width: 1,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 20,
  },
  similarPosts: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  startDiscussion:{
    width:"100%",
    paddingHorizontal:15,
    marginBottom:5
  },
  buttonCreateChat:{
    backgroundColor:colors.__teal_light
  }
});


export default CreationHub