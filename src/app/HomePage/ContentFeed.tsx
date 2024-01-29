import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ViewToken
} from "react-native";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import fetchAllPosts from "../../hooks/posts/fetchAllPosts";
import { BottomSheetModalProvider, BottomSheetModal } from "@gorhom/bottom-sheet";
import PostFullScreen from "../../components/content/full_screen/PostFullScreen";
import ReportContent from "../../components/bottomSheets/ReportContent";
import DeletePostModal from "../../components/bottomSheets/deletePostModal";
import { useRoute, RouteProp } from "@react-navigation/native";
import { PostType, CurrentUserType } from "../../types";


interface ContentFeedProps {
  route: RouteProp<{ params: { page: number; postID: string; } }, 'params'>;
}

interface RouteParams {
  params: {
    page: number;
    postID: string;
    posts: PostType[]; // Include the posts property
  };
}


const ContentFeed: React.FC<{ route: RouteParams }> = ({ route }) => {
  const currentAppPage = useRoute();
  const { page, postID } = route.params;
  const currentUser = useFetchUserDataAsync();
  const windowHeight = Dimensions.get("window").height;
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPostId, setCurrentPostId] = useState<string | undefined>();
  const [currentPostCreator, setCurrentPostCreator] = useState<string | undefined>();
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (route && route.params && route.params.posts) {
      setPosts(route.params.posts);
    }
  }, [route]);

  const morePosts = async () => {
    if (currentUser && !allPostsLoaded) {
      try {
        const fetchedPosts = await fetchAllPosts(
          currentPage + 1,
          20,
          currentUser.token
        );
        if (fetchedPosts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
          setCurrentPage((prevPage) => prevPage + 1);
        } else {
          setAllPostsLoaded(true);
        }
      } catch (error: any) {
        setError(error.message);
        if (retryCount < 3) {
          setRetryCount(retryCount + 1);
          morePosts();
        }
      }
    }
  };

  const startIndex =
    posts.length > 0 && postID
      ? posts.findIndex((item) => item._id === postID)
      : -1;

      const flatListRef = useRef<FlatList<PostType>>(null);

  useEffect(() => {
    if (posts && startIndex !== -1) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef?.current.scrollToIndex({
            index: startIndex,
            animated: false,
          });
        }
      }, 0);
    }
  }, [startIndex]);

  const getItemLayout = (data: any, index: number) => ({
    length: windowHeight,
    offset: windowHeight * index,
    index,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const deleteModalRef = useRef<BottomSheetModal>(null);

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  function handlePresentDeleteModal() {
    deleteModalRef.current?.present();
  }

  //handling upvote
  const [prevVotedIndex, setPrevVotedIndex] = useState<Record<string, number>>({});
  const handleUpvote = (postId: string, index: number) => {
    const updatedPosts = [...posts];
    const post = updatedPosts.find((p) => p._id === postId);

    if (!post) return; // Return early if the post is not found

    if (post.vote_data[index].voted) {
      post.vote_data[index].voted = false;
      post.vote_data[index].total_vote -= 1;
    } else {
      if (prevVotedIndex[postId] !== undefined) {
        post.vote_data[prevVotedIndex[postId]].total_vote -= 1;
      }

      post.vote_data.forEach((vote) => {
        vote.voted = false;
      });

      post.vote_data[index].voted = true;
      post.vote_data[index].total_vote += 1;
      setPrevVotedIndex({
        ...prevVotedIndex,
        [postId]: index,
      });
    }

    setPosts(updatedPosts);
};

const handleViewableItemsChanged = useRef((info: { viewableItems: ViewToken[]; }) => {
  setCurrentIndex(info.viewableItems[0]?.index);
});


  if (loading)
    return (
      <SafeAreaView>
        <Text>Loading</Text>
      </SafeAreaView>
    );
  if (error)
    return (
      <SafeAreaView>
        <Text>Something went wrong...please retry</Text>
      </SafeAreaView>
    );

  return (
    <View style={styles.container}>
      <BottomSheetModalProvider>
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={({ item, index }) => (
            currentUser && (
              <PostFullScreen
                item={item}
                currentUser={currentUser}
                handlePresentDeleteModal={handlePresentDeleteModal}
                handlePresentModal={handlePresentModal}
                setCurrentPostId={setCurrentPostId}
                setCurrentPostCreator={setCurrentPostCreator}
                handleUpvote={handleUpvote}
                isMuted={index !== currentIndex}
                shouldPlay={index === currentIndex}
              />
            )
          )}
          
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id.toString()}
          getItemLayout={getItemLayout}
          onEndReached={morePosts}
          onEndReachedThreshold={0.5}
          onViewableItemsChanged={handleViewableItemsChanged.current}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
        />
        {currentPostId && 
        <ReportContent
          bottomSheetModalRef={bottomSheetModalRef}
          current_post_id={currentPostId}
          currentPostCreator={currentPostCreator}
          currentUser={currentUser}
          setIsMessageVisible={setIsMessageVisible}
          isMessageVisible={isMessageVisible}
        />
        }
        {currentPostId && (
          <DeletePostModal
            deleteModalRef={deleteModalRef}
            current_post_id={currentPostId}
            currentUser={currentUser}
          />
        )}
      </BottomSheetModalProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});

export default ContentFeed;
