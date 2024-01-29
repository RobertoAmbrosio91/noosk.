import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Platform
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import colors from "../../config/colors";
import typography from "../../config/typography";
import { Entypo } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getTimeAgo from "../../functionality/timeAgo";
import { PostType } from "../../types";
import { useRouter, useNavigation } from "expo-router";


// Define the props for your components
interface GroupContentNewProps {
  posts: PostType[];
  page?: number;
  isProfile?: boolean;
  setShowMessage:any;
}

interface PostProps {
  post: PostType;
  color: string;
  index: number;
}



const GroupContentNewPreview: React.FC<GroupContentNewProps> = ({
  posts,
  page,
  isProfile,
  setShowMessage
}) => {
  const router = useRouter();
  const currentPage = useRoute<RouteProp<Record<string, object>, string>>();
  const textColor = currentPage.name === "feed" || currentPage.name === "publicfeed" ? "#fff" : "#1d232d";
  return (
    <View style={styles.my_topic_container}>
      <View style={{ flex: 1 }}>
        {posts &&
          posts.map((item, index) => (
            <TouchableOpacity
            onPress={() => setShowMessage(true)}
              key={item._id}
            >
              <Post
                key={item._id}
                post={item}
                index={index}
                color={textColor}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const Post: React.FC<PostProps> = ({ post, color }) => {
  const router = useRouter();
  const totalVotes = post.vote_data.reduce(
    (acc, val) => acc + val.total_vote,
    0
  );
    const creator = post.post_by_data[0]?.user_name
      ? post.post_by_data[0]?.user_name
      : post.post_by_data[0]?.first_name;
    const [isPlaying, setIsPlaying] = useState(false);
    const typeOfPostColor = () => {
      switch (post.type_of_post) {
        case "Analysis":
          return colors.__teal_light;
        case "Tips & Tricks":
          return "#D0D0D0";
        case "Latest Trends":
          return "#B09E80";
        case "Skills & Crafts":
          return "#1D232D";
        case "Facts & Figures":
          return colors.__teal_dark;
        default:
          return "defaultColor";
      }
    };

    return (
      <View>
        <View style={styles.post}>
          <View
            style={{
              flexDirection: "row",
              columnGap: 5,
              alignItems: "center",
            }}
          >
            <Pressable
              style={[styles.postType, { backgroundColor: typeOfPostColor() }]}
            >
              <Text
                style={[
                  styles.badge,
                  post.type_of_post === "Skills & Crafts"
                    ? { color: "#fff" }
                    : {},
                ]}
              >
                {post.type_of_post}
              </Text>
            </Pressable>
            <View
            >
              <Text style={[styles.postBody, { color: color }]}>
                in{" "}
                <Text style={{ textDecorationLine: "underline" }}>
                  {post.subcategory_data[0]?.name}
                </Text>
              </Text>
            </View>
          </View>
          <View
            style={styles.userInfo}
          >
            {post.post_by_data[0] && (
              <Image
                source={{
                  uri: `${
                    post.post_by_data[0].profile
                      ? post.post_by_data[0].profile
                      : "https://dijtywqe2wqrv.cloudfront.net/public/1697840627580.png"
                  }`,
                }}
                style={styles.userImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.postInfo}>
              <Text style={[styles.username, { color: color }]}>{creator}</Text>
              <Text style={[styles.postTiming, { color: color }]}>
                {getTimeAgo(post)}
              </Text>
            </View>
          </View>
          <View style={{ rowGap: 15 }}>
            <Text style={[styles.postTitle, { color: color }]}>
              {post.title}
            </Text>
            <Text style={[styles.postBody, { color: color }]}>
              {post.description.length > 200
                ? post.description.slice(0, 200) + "..."
                : post.description}
            </Text>
          </View>

          {post.type === "image" && post.images?.[0] && (
            <Image
              source={{ uri: `${post.images[0]}` }}
              style={{
                width: "100%",
                height: 350,
                borderRadius: 8,
                marginTop: 10,
              }}
              resizeMode = "stretch"
            />
          )}
          {post.type === "video" && post.videos?.[0] && (
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: `${post.videos[0]}` }}
                style={styles.video}
                resizeMode={"cover" as any}
                shouldPlay={isPlaying}
                isMuted
              />
              <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
                <AntDesign
                  name={isPlaying ? "pausecircleo" : "playcircleo"}
                  size={60}
                  color="rgba(256,256,256,0.4)"
                />
              </TouchableOpacity>
            </View>
          )}
          {totalVotes > 0 && (
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <View
                style={{ flexDirection: "row", columnGap: 5, marginRight: 10 }}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="bullseye-arrow"
                    size={16}
                    color={"black"}
                  />
                </View>
                <View style={styles.iconContainer}>
                  <Entypo name="graduation-cap" size={16} color={"black"} />
                </View>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="lightbulb-on-outline"
                    size={16}
                    color="black"
                  />
                </View>
              </View>
              <Text style={styles.likes}>{totalVotes}</Text>
            </View>
          )}
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  my_topic_container: {
    flexDirection: "row",
    columnGap: 20,
  },

  post: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    rowGap: 5,
  },
  postType: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#54D7B7",
    maxWidth: "40%",
    borderRadius: 4,
  },
  badge: {
    color: "#171C24",
    fontFamily: "Inter-Light",
    fontSize: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    width: "35%"
  },
  postInfo: {
    flexDirection: "column",
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 12,
    fontFamily: typography.appFont[700],
    color: "white",
  },
  postTiming: {
    fontFamily: typography.appFont[400],
    fontSize: 12,
    color: "white",
  },
  postBody: {
    fontSize: 14,
    lineHeight: 16.8,
    fontFamily: typography.appFont[400],
    color: "white",
  },
  postTitle: {
    fontSize: 14,
    lineHeight: 16.8,
    fontFamily: typography.appFont[600],
    color: "white",
  },
  likes: {
    marginTop: 8,
    fontFamily: "Inter-Light",
    fontSize: 12,
    color: "#647189",
  },
  video: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,

    borderRadius: 8,
    marginTop: 10,
  },
  videoContainer: {
    width: "100%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    backgroundColor: colors.__blue_light,
    borderRadius: 100,
    padding: 8,
  },
});

export default memo(GroupContentNewPreview);
