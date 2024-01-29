import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native";
import React, { useEffect, useRef, useState, memo } from "react";
import colors from "../../config/colors";
import Header from "../../components/header/header";
import typography from "../../config/typography";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import axios from "../../hooks/axios/axiosConfig";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import { updateUser } from "../../hooks/users/updateUser";
import fetchAllCategories from "../../hooks/categories/fetchAllCategories";
import fetchFCMfromAsync from "../../hooks/async_storage/fetchFCMfromAsync";
import saveToken from "../../hooks/fcm_token/saveFCM";
import SignupInput from "../../components/buttons&inputs/SignupInput";
import OnBoardingProgressBar from "../../components/progressbar/OnBoardingProgressBar";
import { CategoryData } from "../../types";
import { hideKeyboard } from "../../functionality/hideKeyboard";
import { useRouter } from "expo-router";




const OnBoardingCategories = () => {
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
  const [categoriesId, setCategoriesId] = useState<string[]>([]);

  //saving token im database
  useEffect(() => {
    if (tokenFCM && currentUser) {
      saveToken(tokenFCM, currentUser.token);
    }
  }, [tokenFCM, currentUser]);
  // handling topic selection
  const handleSelectTopic = ({ item }: any) => {
    const isSelected = selectedTopics.includes(item);
    const isMaxLimitReached = selectedTopics.length >= 3;
    if (isSelected) {
      setSelectedTopics((prevSelected) =>
        prevSelected.filter((t) => t !== item)
      );
      setCategoriesId((prevId) => prevId.filter((i) => i !== item._id));
    } else if (!isMaxLimitReached) {
      setSelectedTopics((prevSelected) => [...prevSelected, item]);
      setCategoriesId((prevId) => [...prevId, item._id]);
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
  const router=useRouter();
  const handleUpdate = (e: any) => {
    updateUser(e, categoriesId, currentUser?.token || '',router);
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
          <OnBoardingProgressBar progress={0.2} />
          <View style={styles.heading_container}>
            <Text style={styles.subTitle}>STEP 1.</Text>
            <Text style={styles.title}>What is your area of expertise?</Text>
            <Text style={styles.subTitle}>
              Choose up to three topics where you believe you can be helpful to
              the community
            </Text>
            <SignupInput
              value={searchTerm}
              onChangeText={handleSearch}
              placeholder="Search Categories"
            />
            {selectedTopics.length !== 0 && (
              <Text style={{ color: "#fff", marginBottom: -10, marginTop: 10 }}>
                Your Picks ({selectedTopics.length} of 3)
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                columnGap: 5,
                rowGap: 5,
                flexWrap: "wrap",
              }}
            >
              {selectedTopics &&
                selectedTopics.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.selectedChoice}
                    onPress={() => {
                      setCategoriesId((prevId) =>
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
            </View>
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
                  ? colors.__disabled_button
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
    backgroundColor: colors.__main_blue,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    backgroundColor: Platform.OS != "web" ? colors.__main_blue : colors.__main_blue,
    paddingHorizontal: 24,
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

export default memo(OnBoardingCategories);
