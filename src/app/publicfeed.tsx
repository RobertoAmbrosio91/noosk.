import React, { useEffect, useState, useRef, memo, FC } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Image,
  TouchableOpacity
} from "react-native";
import colors from "../config/colors";
import typography from "../config/typography";
import Header from "../components/header/header";
import LoadingScreen from '@/components/homeloading/LoadingScreen';
import useFetchUserDataAsync from "../hooks/async_storage/useFetchUserDataAsync";
import fetchAllPosts from "../hooks/posts/fetchAllPosts";
import fetchAndFilterPost from "../hooks/posts/fetch&filterPosts";
import ErrorScreen from "./Errors/ErrorScreen";
import GroupContentNew from "../components/content/GroupContentNew";
import {   ChatRoomType, PostType, Request } from '../types';
import { Link, useRouter } from "expo-router";
import fetchPostsNoToken from '@/hooks/posts/fetchPostNoToken';
import { getAllChatRooms } from '@/hooks/chat/chatApi';
import AllChatByCategory from '@/components/chat/AllChatByCategory';
import PreviewAllChatByCategory from '@/components/chat/PreviewAllChatByCategory';
import GroupContentNewPreview from '@/components/content/GroupContentNewPreview';
import { AntDesign } from "@expo/vector-icons";
import CustomButton from '@/components/buttons&inputs/CustomButton';
const window = Dimensions.get('window');
const desktop=window.width >= 615;
const PublicFeed = () => {
  const router = useRouter();
  const [section, setSection] = useState("General");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [chats, setChats] = useState<ChatRoomType[]>([]);
  // const [forYouPosts, setForYouPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean | null>(null);
  // const [requests, setRequests] = useState<Request[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const [page, setPage] = useState(0);
  const [showMessage,setShowMessage]=useState<boolean>(false);
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
        try {
          const fetchedPosts = await fetchPostsNoToken(page, 20);
          if (fetchedPosts.length > posts.length) {
            setPosts(fetchedPosts);
            setError(false);
          }
          const fetchedChats=await getAllChatRooms();
          if (fetchedChats.length > chats.length) {
            setChats(fetchedChats);
            setError(false);
          }
        } catch (error) {
          setError(true);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      }
    fetchData();
  }, [currentUser, refreshing]);
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
        const fetchedPosts = await fetchPostsNoToken(
          page + 1,
          20,
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
        
        <View
          style={[
            styles.container,
          ]}
        >
            <View >
            <Header isSearch={isSearch} setIsSearch={setIsSearch} section={section}/>
            </View>

           <View>

    <View>
          <Text style={styles.mainText}>
            A place where you can inspire with your knowledge,{"\n"}
            <Text style={{ color: colors.__teal_light }}>Finally</Text>
          </Text>
          
        <View style={ [styles.appLinks,desktop ? styles.appLinksDesktop:{}]}>
            <Link href='https://apps.apple.com/us/app/noosk/id6467666673' hrefAttrs={{ target: '...' }} asChild>
                <Image
                source={require ("../../assets/App_Store_Badge.svg")}
                style={{ width: 120, height: 40, alignSelf: "center" }}
                />
            </Link>
            <Link href='https://play.google.com/store/apps/details?id=com.robya91.noosk&pli=1' hrefAttrs={{ target: '...' }} asChild>
                <Image source={require('../../assets/google-play-badge.png')} style={{ width: 144, height: 48 }} />
            </Link>
        </View>
          <Text style={styles.secondaryText}>
            We built a place where experts can exchange knowledge
          </Text>
    </View>
        </View>
        <Sections
            section={section}
            setSection={setSection}
          />
          
           
            

        </View>
        <View style={section==="discussions" ? {backgroundColor:"#fff",paddingHorizontal:16,marginTop:15}:{paddingHorizontal:16,marginTop:15}}>
            {section==="General" && 
                <GroupContentNewPreview
                    posts={posts}
                    page={page}
                    setShowMessage={setShowMessage}
                />
            }
            {section === "discussions" && chats && (
            <PreviewAllChatByCategory 
                chatRooms={chats}
                setShowMessage={setShowMessage}
                 />
          )}
          </View>
      </ScrollView>
      {showMessage && 
              <Message
                setShowMessage={setShowMessage}
              />
      }
              
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
      
      <TouchableOpacity onPress={() => setSection("discussions")}>
        <Text
          style={[
            styles.selectionText,
            section === "discussions" ? styles.currentSelectionText : {},
          ]}
        >
          Discussions
        </Text>
        {section === "discussions" && <View style={styles.underlineBar}></View>}
      </TouchableOpacity>
    </View>
  );
};

const Message: React.FC<any>=({setShowMessage}:{setShowMessage:React.Dispatch<React.SetStateAction<boolean>>})=>{
  const router=useRouter();
  return(
    <View style={styles.messageContainer}>
      <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>setShowMessage(false)}>
        <AntDesign name="close" size={22} color="white" />
      </TouchableOpacity>
      <Text style={styles.messageText}>
        This is just the app preview...if you want to discover more, log in or sign up! 
      </Text>
      <View style={{flexDirection:"row",width:"100%", justifyContent:"space-between"}}>
        {/* <Link href={"/login"} asChild> */}
          <CustomButton onPress={()=>{router.push("/login");setShowMessage(false)}} text={"Login"} borderStyle={{width:"45%",backgroundColor:colors.__teal_light}}/>
        {/* </Link> */}
        {/* <Link href={"/signup"} asChild> */}
          <CustomButton onPress={()=>{router.push("/signup");setShowMessage(false)}} text={"Signup"} borderStyle={{width:"45%",backgroundColor:colors.__teal_light}}/>
        {/* </Link> */}
      </View>
    </View>
  )
}
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
   mainText: {
    fontSize: 35,
    fontFamily: typography.appFont[700],
    color: colors.w_contrast,
    // textAlign: "center",
  },
  appLinks:{
    flexDirection: 'row',
    width: "40%",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: 20,
  },
  appLinksDesktop:{
    flexDirection: 'row',
    width: "40%",
    justifyContent: "space-between",
    alignContent: "center",
    marginTop: 20,
    position:"absolute",
    bottom:"25%",
    right:"5%"
  },
  secondaryText: {
    fontSize: 15,
    color: colors.__blue_dark,
    marginTop: Platform.OS != "web" ? 40 : 20,
    fontFamily: typography.appFont[400],

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
  messageContainer:{
    backgroundColor:"#000", 
    position:"absolute",
    alignSelf:"center",
    top:"40%",
    marginHorizontal:"20%",
    padding:20,
    borderRadius:10,
    rowGap:15
  },
  messageText:{
    fontFamily:typography.appFont[500],
    color:"#fff",
    fontSize:19
  }

});

export default memo(PublicFeed);
