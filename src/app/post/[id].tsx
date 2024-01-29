import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Share
} from "react-native";
import React, { useState, useRef, useEffect, FC } from "react";
import { StyleSheet } from "react-native";
import typography from "../../config/typography";
import colors from "../../config/colors";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UpvoteSection from "../../components/content/upvote/UpvoteSection";
import { Video, ResizeMode } from "expo-av";
import getPostDetails from "../../hooks/posts/getPostDetails";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import Loading from "../../components/Loading/Loading";
import { PostType } from "../../types";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BottomSheetModalProvider, BottomSheetModal } from "@gorhom/bottom-sheet";
import ReportContent from "../../components/bottomSheets/ReportContent";
import DeletePostModal from "../../components/bottomSheets/deletePostModal";
import validator from "validator";
import * as WebBrowser from "expo-web-browser";

const SharedPost = () => {
  const currentUser = useFetchUserDataAsync();
  const { id } = useLocalSearchParams();
  const postId = id as string
  const router = useRouter()  
  const [post, setPost] = useState<PostType | undefined>(undefined);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [postNotFound, setPostNotFound] = useState(false);
  const [upvoteVisible, setUpvoteVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | undefined>();
  const [currentPostCreator, setCurrentPostCreator] = useState<string | undefined>();
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const checkUser=()=>{
    if(currentUser===null){
      router.replace('/landing')
    }
  }
  setTimeout(() => {
   checkUser()
  },500);

  const toggleText = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (postId && currentUser && currentUser.token) {
          setIsLoading(true);
          const fetchedPost = await getPostDetails(postId, currentUser.token);
          if (fetchedPost) {
            setPost(fetchedPost);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setPostNotFound(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [currentUser]);

  //handling video pause/play
  
const videoRef = useRef<Video>(null);
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  type PrevVotedIndexType = {
    [key: string]: number | undefined;
  };
  
  //handling upvote
  const [prevVotedIndex, setPrevVotedIndex] = useState<PrevVotedIndexType>({});

  const handleUpvote = (postId: string, index: number, type: string) => {
    const updatedPost = JSON.parse(JSON.stringify(post));
    // Get previous index for this postId
    const prevIndex = prevVotedIndex[postId];

    if (prevIndex !== undefined && prevIndex !== index) {
      // If there's a previous index and it's different from the current index, undo previous vote
      updatedPost.vote_data[prevIndex].voted = false;
      updatedPost.vote_data[prevIndex].total_vote -= 1;
    }
    if (updatedPost.vote_data[index].voted) {
      // If already voted for the current index, undo vote
      updatedPost.vote_data[index].voted = false;
      updatedPost.vote_data[index].total_vote -= 1;
    } else {
      // Vote for the current index
      updatedPost.vote_data[index].voted = true;
      updatedPost.vote_data[index].total_vote += 1;
    }
    // Update previous index
    setPrevVotedIndex({
      ...prevVotedIndex,
      [postId]: updatedPost.vote_data[index].voted ? index : undefined,
    });
    setPost(updatedPost);
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const deleteModalRef = useRef<BottomSheetModal>(null);

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  function handlePresentDeleteModal() {
    deleteModalRef.current?.present();
  }  


  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Check this out!",
        url: `https://noosk.co/post/${postId}`,
        title: "Noosk",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("shared with activity type of :", result.activityType);
        } else {
          console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

   //removing https from link
  const removeHttps = (url:any) => {
    return url.replace(/^https?:\/\//i, "");
  };

  //check if there is a link in the description

  const isLink = (word:any) => {
    return validator.isURL(word);
  };
  const words = post ? post.description.split(/\s+/) : [];
  const renderWords = () => {
    let currentLength = 0;
    let elements = [];
    let isTruncated = false;
    if(words){
      
    }
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordLength = word.length + 1; 

      currentLength += wordLength;

      if (isLink(word)) {
        elements.push(
          <TouchableOpacity
            key={i}
            onPress={() => {
              WebBrowser.openBrowserAsync(`https://${removeHttps(word)}`);
            }}
          >
            <Text style={styles.link}>{word + " "}</Text>
          </TouchableOpacity>
        );
      } else {
        elements.push(
          <Text key={i} style={styles.text}>
            {word + " "}
          </Text>
        );
      }
    }

    // if (isTruncated) {
    //   elements.push(
    //     <Text key="ellipsis" style={styles.text}>
    //       ...
    //     </Text>
    //   );
    // }

    return elements;
  };
  

  if (isLoading) return <Loading />;
  else {
    return (
      <BottomSheetModalProvider>
      <SafeAreaView style={styles.wrapper}>
        {!postNotFound && (
          <ScrollView style={styles.textContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.postFullHeader}>
            <TouchableOpacity
              onPress={() => router.push('/feed')}
              >
              <MaterialCommunityIcons
                name="chevron-left"
                size={35}
                color="#fff"
                />
            </TouchableOpacity>

            {currentUser && currentUser._id === post?.post_by_data[0]?._id && (
              <TouchableOpacity
              onPress={() => {
                handlePresentDeleteModal();
                setCurrentPostId(post?._id);
              }}
              >
              <Text style={{ color: "#fff", fontSize: 25, fontWeight: "700", alignSelf: "center" }}>
                ...
              </Text>
            </TouchableOpacity>
          )}
          </View>

            {post && post.type === "text" && (
              <View>
                <Text
                  style={[
                    styles.text,
                    { fontSize: 20, marginBottom: 50, marginTop: 30 },
                  ]}
                >
                  {post.title}
                </Text>
                <Text style={styles.text}>{renderWords()}</Text>
              </View>
            )}

            {post && post.type != "text" && (
              <View style={{ rowGap: 20 }}>
                {post.type === "video" && post.videos && post.videos.length > 0 && (
                  <TouchableOpacity
                    style={{
                      width: 260,
                      height: 460,
                      alignSelf: "center",
                      borderRadius: 10,
                      marginTop: 30,
                    }}
                    onPress={() => {
                      if (post.type === "video") {
                        togglePlayPause();
                      }
                    }}
                  >
                    <Video
                      ref={videoRef}
                      source={{ uri: `${post.videos[0]}` }}
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        borderRadius: 10,
                      }}
                      resizeMode={ResizeMode.CONTAIN}
                      shouldPlay={isPlaying}
                      isMuted={false}
                    />
                  </TouchableOpacity>
                )}
                {post && post.type === "image" && post.images && (
                  <Image
                    source={{ uri: `${post.images[0]}` }}
                    style={{
                      width: 300,
                      height: 400,
                      borderRadius: 10,
                      marginTop: 30,
                      alignSelf: "center",
                    }}
                    resizeMode="contain"
                  />
                )}
                <View>
                  <Text style={styles.text}>{post.title}</Text>

                  <Text
                    style={[
                      styles.text,
                      { fontSize: 13, fontFamily: typography.appFont[400] },
                    ]}
                  >
                    {isTextExpanded
                      ? post.description
                      : post.description.length > 200
                      ? post.description.substring(0, 200) + "..."
                      : post.description}
                  </Text>
                  {!isTextExpanded && post.description.length > 200 && (
                    <TouchableOpacity onPress={toggleText}>
                      <Text
                        style={[
                          styles.text,
                          { fontSize: 13, fontFamily: typography.appFont[400] },
                        ]}
                      >
                        View more
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {post && (
              <View
                style={{
                  rowGap: 15,
                  marginVertical: 50,
                }}
              >
                  <UpvoteSection
                    post={post}
                    handleUpvote={handleUpvote}
                    upvoteVisible={upvoteVisible}
                    onShare={onShare}
                    setUpvoteVisible={setUpvoteVisible}
                    handlePresentModal={handlePresentModal} // Add this line
                    setCurrentPostId={setCurrentPostId} // Assuming you want to set this state when reporting
                    setCurrentPostCreator={setCurrentPostCreator} // Assuming you want to set this state when reporting
                  />
                  <ReportContent
                  bottomSheetModalRef={bottomSheetModalRef}
                  current_post_id={currentPostId}
                  currentPostCreator={currentPostCreator}
                  currentUser={currentUser}
                  setIsMessageVisible={setIsMessageVisible}
                  isMessageVisible={isMessageVisible}
                 />
                 <DeletePostModal
                  deleteModalRef={deleteModalRef}
                  current_post_id={currentPostId}
                  currentUser={currentUser}
                  />
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 5,
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: "#fff",
                      borderRadius: 100,
                    }}
                  >
                    <Image
                      source={{ uri: `${post.post_by_data[0].profile}` }}
                      style={[{ borderRadius: 100, flex: 1, width: "100%" }]}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={{ justifyContent: "center" }}>
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: typography.appFont[400],
                      }}
                    >
                      @{post.post_by_data[0].user_name}
                    </Text>
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: typography.appFont[400],
                      }}
                    >
                      {post.subcategory_data[0].name}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {postNotFound && (
          <ScrollView style={[styles.textContainer]}>
            <Text
              style={[styles.text, { textAlign: "center", marginTop: 100 }]}
            >
              We are sorry but apparently the post has been deleted
            </Text>
            <TouchableOpacity
              style={styles.goBack}
              onPress={() => router.back()}
            >
              <Text style={styles.text}>Go back</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
      </BottomSheetModalProvider>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.__main_blue,
    paddingTop: Platform.OS === "android" ? 30 : 0,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  text: {
    color: "#fff",
    fontFamily: typography.appFont[500],
    fontSize: 16,
    lineHeight: 23,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: "10%",
    backgroundColor: colors.__main_blue,
    // justifyContent: "center",
    paddingBottom: 40,
  },
  postFullHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  iconContainer: {
    width: "100%",
    flexDirection: "row",
    columnGap: 10,
  },
  icon: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 100,
    padding: 5,
    flexDirection: "row",
    columnGap: 3,
    alignItems: "center",
  },
  goBack: {
    alignSelf: "center",
    margin: 50,
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
    link: {
    color: colors.__blue_medium,
    textDecorationLine: "underline",
    fontStyle: "italic",
  },
});
export default SharedPost;
