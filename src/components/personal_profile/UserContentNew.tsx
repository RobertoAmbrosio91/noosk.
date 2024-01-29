import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from "react-native";
import colors from "../../config/colors";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import fetchUserPosts from "../../hooks/posts/fetchUserPosts";
import typography from "../../config/typography";
import CustomButton from "../buttons&inputs/CustomButton";
import { useNavigation } from "@react-navigation/native";
import GroupContentNew from "../content/GroupContentNew";
import { MaterialIcons } from '@expo/vector-icons';
import { PostType, UserData } from "../../types";


interface Post {
  _id: string;
  vote_data: Array<{ total_vote: number }>;
  post_by_data: Array<{
    user_name?: string;
    first_name?: string;
    profile?: string;
    _id: string;
  }>;
  subcategory_data: Array<{
    _id: string;
    name: string;
  }>;
  type_of_post: string;
  title: string;
  description: string;
  type: string;
  images?: string[];
  videos?: string[];
}

interface UserContentNewProps {
  userData: UserData;
}

const UserContentNew: React.FC<UserContentNewProps> = ({ userData }) => {
  const navigation = useNavigation();
  const currentUser = useFetchUserDataAsync();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [requests, setRequests] = useState<any>(); // Specify the type for requests if available
  const [section, setSection] = useState<string>("shares");
  const [page, setPage] = useState<number>(0);
  const [allPostsLoaded, setAllPostsLoaded] = useState<boolean>(false);
  const [activeSections, setActiveSections] = useState<number[]>([]);

    //fetching user's posts
    useEffect(() => {
      const fetchPosts = async () => {
        if (currentUser) {
          const fetchedPosts = await fetchUserPosts(
            page,
            500,
            userData._id,
            currentUser.token
          );

          setPosts(fetchedPosts);
        }
      };
      fetchPosts();
    }, [currentUser, userData]);

    const filterPostsBySubcategory = (subcategoryId: string) => {
      return posts.filter(post => 
        post.subcategory_data.some(subcategory => subcategory._id === subcategoryId)
      );
    };

    const toggleSection = (index: number) => {
      // Check if the current index is already in the activeSections array
      const isActive = activeSections.includes(index);
      if (isActive) {
        // It's active, so we remove it from the array to collapse the section
        setActiveSections(activeSections.filter(section => section !== index));
      } else {
        // It's not active, so we add it to the array to expand the section
        setActiveSections([...activeSections, index]);
      }
    };


    return (
      <ScrollView style={styles.profile_content}>
        {userData?.subcategory_data?.map((subcategory, index) => {
          const postsForSubcategory = filterPostsBySubcategory(subcategory._id);
          const isSectionActive = activeSections.includes(index);
          return (
            <View key={subcategory._id}>
              <TouchableOpacity style={styles.subcategoryHeader} onPress={() => toggleSection(index)}>
                <Text style={styles.subcategoryHeaderText}>{subcategory.name}</Text>
                <MaterialIcons
                 name={isSectionActive ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                 size={24} 
                 color="#647189" />
              </TouchableOpacity>
              {isSectionActive && (
                postsForSubcategory.length > 0 ? (
                  <GroupContentNew posts={postsForSubcategory} isProfile={true} page={page} />
                ) : (
                  <Text>No content available</Text>
                )
              )}
            </View>
          );
        })}
      </ScrollView>
    );

  };


  const styles = StyleSheet.create({
    profile_content: {
      flex: Platform.OS != 'web' ? 1 : 0.5,
      paddingHorizontal: 13,
      // backgroundColor: 'red'
    },
    subcategoryHeader: {
      flexDirection: 'row',
      paddingVertical: 13,
      alignContent: 'center',
      justifyContent: 'space-between'
    },
    subcategoryHeaderText:{
      color: '#647189',
      fontSize: 18,
      fontFamily: 'Instrument Sans',
      fontWeight: '700',
      lineHeight: 30,
      flexWrap: 'wrap',

    },
    selectionContainer: {
      flexDirection: "row",
      justifyContent: "center",
      columnGap: 15,
      marginBottom: 15,
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
      color: colors.__blue_light,
    },
    currentSelectionText: {
      fontSize: 14,
      color: colors.__black,
      fontFamily: typography.appFont[700],
    },
    buttonStyle: {
      width: 100,
      alignSelf: "flex-end",
      borderRadius: 4,
      backgroundColor: colors.__teal_light,
    },
    requestContainer: {
      borderWidth: 1,
      borderColor: colors.__blue_light,
      borderRadius: 4,
      marginTop: 12,
      padding: 15,
      rowGap: 10,
    },
  });

  export default UserContentNew;
