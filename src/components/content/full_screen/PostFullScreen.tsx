import React, { useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import typography from "../../../config/typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import UpvoteSection from "../upvote/UpvoteSection";

// Define your item's type
type ItemType = {
  _id: string;
  type: string;
  title: string;
  description: string;
  post_by_data: Array<{
    user_name?: string;
    first_name?: string;
    _id: string;
    profile?: string;
  }>;
  subcategory_data: Array<{
    name: string;
  }>;
  videos?: Array<string>;
  images?: Array<string>;
    vote_data: Array<{
    voted: boolean;
    // ... other properties inside vote_data if any
  }>; 
  post_by: string;
};

// Define your currentUser's type
type CurrentUserType = {
  _id: string;
  // ... other fields
};

type NavigationParamList = {
  PostFull: { postId: string };
  // ... other routes
};

type RootStackParamList = {
  PostFull: {
    postId: string; // Parameters expected by the PostFull route
  };
  ProfileNew: {
    user_id: string; // Parameters expected by the ProfileNew route
  };
  // Add other routes and their parameters here
};


interface PostFullScreenProps {
  item: ItemType;
  currentUser: CurrentUserType | null;
  handlePresentDeleteModal: () => void;
  handlePresentModal: () => void;
  setCurrentPostId: (postId: string) => void;
  handleUpvote: (postId: string, index: number) => void;
  isMuted: boolean;
  shouldPlay?: boolean;
  setCurrentPostCreator: (creatorId: string) => void;
}

const PostFullScreen: React.FC<PostFullScreenProps> = ({
  item,
  currentUser,
  handlePresentDeleteModal,
  handlePresentModal,
  setCurrentPostId,
  handleUpvote,
  isMuted,
  shouldPlay,
  setCurrentPostCreator,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const windowHeight = Dimensions.get("window").height;
  const textLength = windowHeight > 800 ? 550 : 400;
  const [isPlaying, setIsPlaying] = useState(true);
const [upvoteVisible, setUpvoteVisible] = useState(false);
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


const onShare = async () => {
  try {
    const result = await Share.share({
      message: "Check this out!",
      url: `https://noosk.co/post/${item._id}`,
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

const creator = item.post_by_data[0]?.user_name
  ? item.post_by_data[0]?.user_name
  : item.post_by_data[0]?.first_name;

return (
  <TouchableWithoutFeedback
    onPress={() => {
      if (item.type === "video") {
        togglePlayPause();
      }
      if (upvoteVisible) {
        setUpvoteVisible(false);
      }
    }}
  >
    {item && (
      <View
        style={[
          {
            flex: 1,
            height: windowHeight,
            backgroundColor: "#000",
          },
        ]}
      >
        <TouchableOpacity
          style={{ position: "absolute", top: 30, left: 10, zIndex: 100 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="chevron-left" size={40} color="#fff" />
        </TouchableOpacity>
        {currentUser && currentUser._id === item.post_by_data[0]?._id && (
          <TouchableOpacity
            style={{ position: "absolute", top: 50, right: 15, zIndex: 10 }}
            onPress={() => {
              handlePresentDeleteModal();
              setCurrentPostId(item._id);
            }}
          >
            <Text style={{ color: "#fff", fontSize: 25, fontWeight: "700" }}>
              ...
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 40,
            zIndex: 10,
            paddingHorizontal: 24,
            rowGap: 15,
          }}
        >
          {item.type != "text" && (
            <TouchableOpacity
              style={{ rowGap: 5 }}
              onPress={() => {
                if (item.type === "video") {
                  isPlaying ? togglePlayPause() : null;
                }

                navigation.navigate("PostFull", {
                  postId: item._id,
                });
              }}
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postDescription}>
                {item.description.length > 50
                  ? item.description.substring(0, 50) + "..."
                  : item.description}
              </Text>
            </TouchableOpacity>
          )}

          <UpvoteSection
            handlePresentModal={handlePresentModal}
            setCurrentPostId={setCurrentPostId}
            post={item}
            setCurrentPostCreator={setCurrentPostCreator}
            handleUpvote={handleUpvote}
            onShare={onShare}
            upvoteVisible={upvoteVisible}
            setUpvoteVisible={setUpvoteVisible}
          />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              columnGap: 5,
              alignSelf: "flex-start",
            }}
            onPress={() =>
              navigation.navigate("ProfileNew", {
                user_id: item.post_by_data[0]._id,
              })
            }
          >
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#fff",
                borderRadius: 100,
              }}
            >
              {item.post_by_data[0]?.profile && (
                <Image
                  source={{ uri: `${item.post_by_data[0].profile}` }}
                  style={[{ borderRadius: 100, flex: 1, width: "100%" }]}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  color: "#fff",
                  fontFamily: typography.appFont[400],
                }}
              >
                {creator}
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontFamily: typography.appFont[400],
                }}
              >
                {item.subcategory_data[0]?.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {item.type === "video" && (
          <>
            <Video
              ref={videoRef}
              source={{ uri: item.videos?.[0] ?? '' }}
              style={styles.backgroundVideo}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={shouldPlay}
              isLooping
              isMuted={isMuted}
            />
          </>
        )}
          {item.type === "image" && item.images && (
          <Image
            source={{ uri: item.images[0] }}
            // style={styles.backgroundVideo}
            style={[
              {
                height: "60%",
                width: "100%",
                position: "absolute",
                top: "15%",
              },
            ]}
            resizeMode="contain"
          />
        )}

        {item.type == "text" && (
          <View style={styles.textContainer}>
            <View>
              <Text
                style={[
                  styles.text,
                  { fontSize: 20, marginBottom: 50, marginTop: 30 },
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.text}>
                {item.description.length > textLength
                  ? item.description.substring(0, textLength) + "..."
                  : item.description}
              </Text>
              {item.description.length > 500 && (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    marginTop: 30,
                    alignItems: "center",
                  }}
                  onPress={() =>
                    navigation.navigate("PostFull", {
                      postId: item._id,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.text,
                      { color: colors.__teal_light, marginRight: 5 },
                    ]}
                  >
                    Continue Reading
                  </Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={colors.__teal_light}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    )}
  </TouchableWithoutFeedback>
);
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 8,
  },
  postTitle: {
    color: "#fff",
    fontFamily: typography.appFont[700],
    fontSize: 18,
  },
  postDescription: {
    color: "#fff",
    fontFamily: typography.appFont[400],
    fontSize: 12,
  },

  text: {
    color: "#fff",
    fontFamily: typography.appFont[500],
    fontSize: 16,
    lineHeight: 23,
  },
  textContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: "15%",
    backgroundColor: colors.__main_blue,
    flex: 1,
  },
  messageContainer: {
    backgroundColor: colors.__black,
    borderRadius: 4,
    rowGap: 10,
    width: "90%",
    alignSelf: "center",
    // height: 100,
    position: "absolute",
    bottom: 60,
    padding: 24,
  },
  messageText: {
    color: colors.__01_light_n,
    fontFamily: typography.appFont[600],
  },
});

export default PostFullScreen;
