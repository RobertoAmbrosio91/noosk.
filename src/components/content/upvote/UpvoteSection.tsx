import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../config/colors";
import useFetchUserDataAsync from "../../../hooks/async_storage/useFetchUserDataAsync";
import { upvote, removeVote } from "../../../hooks/posts/upvote";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type PostType = {
  _id: string;
  vote_data: Array<{
    voted: boolean;
  }>;
  post_by: string;
  // ... other properties of post
};

type UpvoteSectionProps = {
  handlePresentModal?: () => void;
  setCurrentPostId?: (postId: string) => void;
  setCurrentPostCreator?: (creatorId: string) => void;
  post: PostType;
  handleUpvote: (postId: string, index: number, type: string) => void;
  onShare?: () => void;
  upvoteVisible?: boolean;
  setUpvoteVisible: (visible: boolean) => void;
};

const UpvoteSection: React.FC<UpvoteSectionProps> = ({
  handlePresentModal,
  setCurrentPostId,
  setCurrentPostCreator,
  post,
  handleUpvote,
  onShare,
  upvoteVisible,
  setUpvoteVisible,
}) => {
  const currentPage = useRoute();
  const noReport =
    currentPage.name === "PostFull" || currentPage.name === "TextFull";
  //getting current user from async
  const currentUser = useFetchUserDataAsync();
  const userToken = currentUser ? currentUser.token : null;
  // const [upvoteVisible, setUpvoteVisible] = useState(false);
  //handling upvote

  const upvotePost = async (type: string) => {
    if (currentUser && currentUser && userToken) {
      const response = await upvote(post._id, type, userToken);
    }
  };
  //handling remove upvote
  const removePostVote = async (type: string) => {
    if (currentUser && currentUser && userToken) {
      const response = await removeVote(post._id, type, userToken);
    }
  };
  function votingFunction(post: PostType, index: number, type: string) {
    if (post.vote_data[index].voted) {
      removePostVote(type);
      setTimeout(() => setUpvoteVisible(!upvoteVisible), 1000);
    } else {
      upvotePost(type);
      setTimeout(() => setUpvoteVisible(!upvoteVisible), 1000);
    }
    handleUpvote(post._id, index, type);
  }

  //handling upvoted style
  // function upvotedStyle(index) {
  //   if (post.vote_data[index].voted) return colors.__teal_light;
  //   return colors.__01_light_n;
  // }
  function votedColor(index: number) {
    if (post.vote_data[index].voted) return colors.__teal_dark;
    return colors.__main_blue;
  }
  function isUpvoted(post: PostType) {
    return post.vote_data.some((item) => item.voted === true);
  }
  return (
    <View style={[styles.iconContainer]}>
      <View style={{ flexDirection: "row", columnGap: 10 }}>
        <TouchableOpacity
          style={[
            styles.icon,
            isUpvoted(post) ? { borderColor: colors.__teal_light } : {},
          ]}
          onPress={() => setUpvoteVisible(!upvoteVisible)}
        >
          <Text
            style={
              isUpvoted(post)
                ? { color: colors.__teal_light }
                : { color: colors.__01_light_n }
            }
          >
            {isUpvoted(post) ? "Praised" : "Praise this content"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.icon]} onPress={onShare}>
          <MaterialCommunityIcons
            name="share"
            size={25}
            color={colors.__01_light_n}
          />
        </TouchableOpacity>
      </View>
      {!noReport && (
        <TouchableOpacity
          style={[{ marginRight: 24 }]}
          onPress={() => {
            handlePresentModal?.(),
              setCurrentPostId?.(post._id),
              setCurrentPostCreator?.(post.post_by);
          }}
        >
          <Feather
            name="alert-triangle"
            size={24}
            color={colors.__01_light_n}
          />
        </TouchableOpacity>
      )}
      {upvoteVisible && (
        <UpvotePopUp
          votingFunction={votingFunction}
          post={post}
          votedColor={votedColor}
          setUpvoteVisible={setUpvoteVisible}
        />
      )}
    </View>
  );
};


type UpvotePopUpProps = {
  votingFunction: (post: PostType, index: number, type: string) => void;
  post: PostType;
  votedColor: (index: number) => string;
  setUpvoteVisible: (visible: boolean) => void;
};

const UpvotePopUp: React.FC<UpvotePopUpProps> = ({
  votingFunction,
  post,
  votedColor,
  setUpvoteVisible,
}) => {
  return (
    <View style={[styles.popupContainer]}>
      <Text>Praise this content as:</Text>
      <TouchableOpacity
        style={{ flexDirection: "row", columnGap: 15, alignItems: "center" }}
        onPress={() => votingFunction(post, 0, "Inspiring")}
      >
        <MaterialCommunityIcons
          name="lightbulb-on-outline"
          size={24}
          color={votedColor(0)}
        />
        <Text style={{ color: votedColor(0) }}>Inspiring</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flexDirection: "row", columnGap: 15, alignItems: "center" }}
        onPress={() => votingFunction(post, 1, "Problem-Solving")}
      >
        <MaterialCommunityIcons
          name="bullseye-arrow"
          size={25}
          color={votedColor(1)}
        />
        <Text style={{ color: votedColor(1) }}>Problem-Solving</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flexDirection: "row", columnGap: 15, alignItems: "center" }}
        onPress={() => votingFunction(post, 2, "Educational")}
      >
        <Entypo name="graduation-cap" size={25} color={votedColor(2)} />
        <Text style={{ color: votedColor(2) }}>Educational</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  iconContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  icon: {
    borderColor: colors.__01_light_n,
    borderWidth: 2,
    borderRadius: 100,
    padding: 5,
    flexDirection: "row",
    columnGap: 3,
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: colors.__01_light_n,
    borderRadius: 10,
    position: "absolute",
    bottom: "110%",
    left: "20%",
    padding: 20,
    rowGap: 20,
  },
});
export default UpvoteSection;
