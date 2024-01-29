import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
  Dimensions
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import colors from "../../config/colors";
import typography from "../../config/typography";
import { Entypo } from "@expo/vector-icons";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons, EvilIcons } from "@expo/vector-icons";
import getTimeAgo from "../../functionality/timeAgo";
import { PostType } from "../../types";
import { router, useRouter } from "expo-router";

interface PostProps {
  post: PostType;
  color: string;
  index: number;
}


type GroupContentCHProps = {
  posts: PostType[];
  page: any; // Define the type
  isProfile?: boolean;
};




const GroupContentCH: React.FC<GroupContentCHProps> = ({ posts, page, isProfile }) => {
  const router = useRouter();
  const currentPage = useRoute<RouteProp<Record<string, object>, string>>();
  const textColor = currentPage.name === "HomeNew" ? "#fff" : "#1d232d";

  const renderPost = ({ item, index }: { item: PostType; index: number }) => (
    <TouchableOpacity
    onPress={() => {
      router.push(`/postfull/${item._id}`);
    }}
      key={item._id}
    >
      <Post
        post={item}
        index={index}
        color={textColor}
      />
    </TouchableOpacity>
  );

  return (
    <View>
      {posts && posts.length > 0 && (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id} // Assuming _id is unique
          horizontal={true} // Enable horizontal scrolling
          // pagingEnabled={true} // Enable paging
          showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicators
          // decelerationRate="fast" // Adjust the deceleration rate for a better paging effect
          contentContainerStyle={styles.my_topic_container}
        />
      )}
      {posts && posts.length === 0 && (
        <View>
          <Text style={styles.textNoPosts}>
            There are no posts related to your areas of expertise
          </Text>
        </View>
      )}
    </View>
  );
};

const Post: React.FC<PostProps> = ({ post, color, index }) => {
  const screenWidth = Dimensions.get("window").width;
  const totalVotes = post.vote_data.reduce(
    (acc, val) => acc + val.total_vote,
    0
  );
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

  const postStyle = {
    ...styles.post, // This spreads all the existing static styles
    width: screenWidth - 32, // Then, overwrite the width dynamically
  };

  return (
    <View style={[postStyle, index === 0 ? { marginLeft: 16 } : {}]}>
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
              post.type_of_post === "Skills & Crafts" ? { color: "#fff" } : {},
            ]}
          >
            {post.type_of_post}
          </Text>
        </Pressable>
        <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/specificcategory/selectedcategory',
                  params: {
                    subCategory: post.subcategory_data[0],
                  }
                });
              }}
        >
          <Text style={[styles.postBody, { color: color }]}></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: `${
              post.post_by_data[0]?.profile
                ? post.post_by_data[0]?.profile
                : "https://dijtywqe2wqrv.cloudfront.net/public/1697840627580.png"
            }`,
          }}
          style={styles.userImage}
          resizeMode="cover"
        />
        <View style={styles.postInfo}>
          <View style={styles.postInfoCategory}>
            {post && post.post_by_data[0]?.first_name && (
              <Text style={[styles.username, { color: color }]}>
                {post.post_by_data[0].first_name}
              </Text>
            )}

            <Text> posted in </Text>
            <Text style={{ textDecorationLine: "underline" }}>
              {" "}
              {post.subcategory_data[0].name}
            </Text>
          </View>

          <Text style={[styles.postTiming, { color: color }]}>
            {getTimeAgo(post)}
          </Text>
        </View>
      </View>
      <View style={{ rowGap: 15 }}>
        <Text style={[styles.postTitle, { color: color }]}>
          {post.title.length > 50
            ? post.title.slice(0, 40) + "..."
            : post.title}
        </Text>
      </View>

      <View style={styles.postFooter}>
        {totalVotes > -1 && (
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                columnGap: 5,
                marginRight: 10,
              }}
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
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => {                                  
            router.push({
              pathname: '/postcreation/createpost',
              params: {
                category: post.subcategory_data[0]._id,
              }
            });
          }}
        >
          <EvilIcons name="comment" size={24} color="black" />
          <Text>Create similar post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  my_topic_container: {
    backgroundColor: "white",
    columnGap: 20,
    paddingVertical: 20,
  },

  post: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    rowGap: 5,
    maxWidth: 500,
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
  },
  postInfo: {
    flexDirection: "column",
    gap: 3,
  },
  postInfoCategory: {
    flexDirection: "row",
    justifyContent: "center",
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 14,
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
  postFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  replyButton: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
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
  textNoPosts: {
    fontFamily: typography.appFont[600],
    fontSize: 16,
    color: colors.__01_light_n,
    textAlign: "center",
    marginTop: "10%",
  },
});

export default memo(GroupContentCH);
