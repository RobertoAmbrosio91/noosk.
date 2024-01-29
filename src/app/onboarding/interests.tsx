import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform
} from "react-native";
import React, { useEffect, useRef, useState, memo } from "react";
import colors from "../../config/colors";
import Header from "../../components/header/header";
import typography from "../../config/typography";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import "react-native-gesture-handler";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import axios from "../../hooks/axios/axiosConfig";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import { updateUserInterests } from "../../hooks/users/updateUser";
import fetchAllCategories from "../../hooks/categories/fetchAllCategories";
import fetchFCMfromAsync from "../../hooks/async_storage/fetchFCMfromAsync";
import saveToken from "../../hooks/fcm_token/saveFCM";
import SignupInput from "../../components/buttons&inputs/SignupInput";
import OnBoardingProgressBar from "../../components/progressbar/OnBoardingProgressBar";
import { CategoryData } from "../../types";
import { useRouter } from "expo-router";
import { hideKeyboard } from "../../functionality/hideKeyboard";





const OnBoardingInterests = () => {
  const router = useRouter()
  //fetching token from asyncstorage
  const tokenFCM = fetchFCMfromAsync();
  //  fetching the user from async storage
  const currentUser = useFetchUserDataAsync();

  // declaring state to fetch categories from api
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryData[]>([]);
  // handling Topics selection
  const [selectedTopics, setSelectedTopics] = useState<CategoryData[]>([]);
  const isDisabled = selectedTopics.length > 0 ? false : true;

  // initializing state to hold selected categories id
  const [interestsId, setInterestsId] = useState<string[]>([]);
  const sharer = currentUser && currentUser.user_type === "sharer";
  //saving token im database
  useEffect(() => {
    if (tokenFCM && currentUser) {
      saveToken(tokenFCM, currentUser.token);
    }
  }, [tokenFCM, currentUser]);
  // handling topic selection
  const handleSelectTopic = ({ item }: any) => {
    const isSelected = selectedTopics.includes(item);
    // const isMaxLimitReached = selectedTopics.length >= 3;
    if (isSelected) {
      setSelectedTopics((prevSelected) =>
        prevSelected.filter((t) => t !== item)
      );
      setInterestsId((prevId) => prevId.filter((i) => i !== item._id));
    } else {
      setSelectedTopics((prevSelected) => [...prevSelected, item]);
      setInterestsId((prevId) => [...prevId, item._id]);
    }
  };

  // handling style change on selection
  function setSelectedContainerStyle(value: CategoryData) {
    if (selectedTopics.includes(value)) return styles.selectedTopicContainer;
    return styles.topicContainer;
  }

  //fetching categories from database

  useEffect(() => {
    const fetchCategories = async () => {
      if (currentUser) {
        const fetchedCategories = await fetchAllCategories(currentUser.token);
        setCategories(fetchedCategories);
        setFilteredCategories(fetchedCategories);
      }
    };
    fetchCategories();
  }, [currentUser]);

  // updating the user
  
  const handleUpdate = (e: any) => {
    updateUserInterests(e, interestsId, currentUser?.token || '', sharer, router);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredCategories(categories);
      return;
    }
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  return (
    <TouchableWithoutFeedback onPress={()=>hideKeyboard}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <Header />
          <OnBoardingProgressBar progress={0.6} />
          <View style={styles.heading_container}>
            <Text style={styles.subTitle}>STEP 3.</Text>
            <Text style={styles.title}>What are your interests?</Text>
            <Text style={styles.subTitle}>
              Pick some areas you're interestedin and would like to explore
            </Text>
            <SignupInput
              value={searchTerm}
              onChangeText={handleSearch}
              placeholder="Search Topic"
            />
            {selectedTopics.length !== 0 && (
              <Text style={{ color: "#fff", marginTop: 10 }}>
                Your Picks {selectedTopics.length}
              </Text>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row", columnGap: 10 }}
            >
              {selectedTopics &&
                selectedTopics.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.selectedChoice}
                    onPress={() => {
                      setInterestsId((prevId) =>
                        prevId.filter((i) => i !== item._id)
                      );
                      setSelectedTopics((prevSelected) =>
                        prevSelected.filter((t) => t !== item)
                      );
                    }}
                  >
                    <Text style={styles.topicText}>{item.name}</Text>
                    <Ionicons name="close" size={15} color="#fff" />
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>

          <ScrollView
            style={styles.topicsScrollView}
            showsVerticalScrollIndicator={false}
          >
            <TouchableWithoutFeedback
              style={{
                flex: 1,
                width: "100%",
                zIndex: 10,
              }}
            >
              <View style={styles.topicsContainer}>
                {filteredCategories &&
                  filteredCategories.map((category, index) => {
                    return (
                      <TouchableOpacity
                        style={setSelectedContainerStyle(category)}
                        key={category._id}
                        onPress={() => handleSelectTopic({ item: category })}
                      >
                        <Text style={styles.topicText}>{category.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>

          <View style={styles.bottomContainer}>
            <CustomButton
              text={"Continue"}
              textStyle={{
                fontFamily: typography.appFont[700],
              }}
              borderStyle={{
                backgroundColor: isDisabled
                  ? "rgba(232, 232, 240, 0.72)"
                  : colors.__teal_light,
                borderRadius: 4,
              }}
              onPress={handleUpdate}
              disabled={isDisabled}
            />
            {/* <TouchableOpacity
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Home" }],
                })
              }
            ></TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : "gray",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : colors.__main_blue,
  },
  title: {
    fontFamily: typography.appFont[700],
    color: colors.w_contrast,
    fontSize: 20,
    textAlign: "center",
  },
  subTitle: {
    fontFamily: typography.appFont[400],
    color: colors.w_contrast,
    fontSize: 13,
    textAlign: "center",
  },
  heading_container: {
    marginTop: Platform.OS != 'web' ? "10%" : "3%",
    rowGap: 10,
  },
  selectedChoice: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.__teal_light,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(84, 215, 183, 0.50)",
  },
  topicsScrollView: {
    marginTop: "3%",
    marginBottom: Platform.OS != 'web' ? "15%" : "5%",
    height: Platform.OS != 'web' ? "50%" : "70%",
  },
  topicsContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 5,
    paddingBottom: 10,
  },

  topicContainer: {
    flexDirection: "row",
    columnGap: 5,
    borderColor: colors.__blue_dark,
    borderWidth: 1,
    padding: 10,
    marginRight: 20,
    // width: "48%",
    height: 40,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedTopicContainer: {
    flexDirection: "row",
    columnGap: 5,
    padding: Platform.OS != 'web' ? 10 : 5,
    marginRight: 20,
    height: 40,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: Platform.OS != 'web' ? 10 : 0,
    backgroundColor: "rgba(84, 215, 183, 0.50)",
  },

  topicText: {
    fontFamily: typography.appFont[400],
    color: colors.w_contrast,
  },

  scrollViewContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 10,
    paddingHorizontal: 5,
    marginBottom: Platform.OS != 'web' ? 50 : 0,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
    rowGap: 15,
  },
  bottomSheetContainer: {
    padding: 24,
  },
  subcatWrapper: {
    flexDirection: "row",
    columnGap: 10,
    rowGap: 10,
    flexWrap: "wrap",
  },
  subcatContainer: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  // selectedSubCatContainer: {
  //   paddingVertical: 6,
  //   paddingHorizontal: 12,
  //   borderRadius: 5,
  //   borderWidth: 1,
  //   borderColor: colors.__teal_light,
  //   backgroundColor: "rgba(84, 215, 183, 0.50)",
  // },
  selectedSubCatText: {
    fontFamily: typography.appFont[400],
    // color: "#fff",
  },
});

export default memo(OnBoardingInterests);
