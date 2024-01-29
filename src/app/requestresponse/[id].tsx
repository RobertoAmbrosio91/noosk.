import React, { useRef, useState, useEffect, RefObject } from "react";
import { View, SafeAreaView, StyleSheet, TouchableWithoutFeedback, Keyboard, Text, TouchableOpacity, Image, 
  Platform, Dimensions } from "react-native";
import colors from "../../config/colors";
import typography from "../../config/typography";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import HeaderSelection from "../../components/createpost/HeaderSelection";
import TextPost from "../../components/createpost/TextPost";
import MediaPost from "../../components/createpost/MediaPost";
import "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import CameraComponent from "../../components/createpost/CameraComponent";
import * as Progress from "react-native-progress";
import CategorySelector from "../../components/createpost/CategorySelector";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import fetchUserData from "../../hooks/users/fetchUserData";
import { createPost } from "../../hooks/posts/createPostHandler";
import { handleSelectMedia } from "../../functionality/handleSelectMedia";
import awsmobile from "../../../aws_export/aws-exports";
import { Amplify } from "aws-amplify";
import NotASharer from "../../components/posts/NotASharer";
import SelectPostColor from "../../components/bottomSheets/selectPostColor";
import { MediaPostType } from "../../types";
import { UserData } from "../../types";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import TypeOfPost from "../../components/createpost/TypeOfPost";

Amplify.configure(awsmobile);


interface Category {
  _id: string;
  name: string;
  // ... other properties of a category
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;  

const RespondRequest = () => {

  const router = useRouter()
  // check if requestID exist
  const params = useLocalSearchParams();
  const requestID = Array.isArray(params.requestID) ? params.requestID[0] : params.requestID;
  // fetching current user from async storage
  const currentUser = useFetchUserDataAsync();
  const sharer =
    currentUser && currentUser.user_type === "sharer" ? true : false;
  //fetching userdata from database
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [userCategories, setUserCategories] = useState<Category[] | undefined>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [fileIsTooBig, setFileIsTooBig] = useState(false);
  //fetching user data
  useEffect(() => {
    const fetch_User_Data = async () => {
      if (currentUser) {
        const user = await fetchUserData(currentUser._id, currentUser.token);
        setUserData(user);
        setUserCategories(user?.subcategory_data);

      }
    };
    fetch_User_Data();
  }, [currentUser]);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | 'text'>('text');
  const handleMediaTypeChange = (type: 'text' | 'image' | 'video' /* add other media types as needed */) => {
    setSelectedMediaType(type);
    setMediaPost({
      ...mediaPost,
      media_type: type,
    });
  };
  
  const preSelectedCategory =params.requestID || null;

    const [mediaPost, setMediaPost] = useState<MediaPostType>({
    media_type: "text",
    videoUri: "",
    imageUri: "",
    title: "",
    description: "",
    category: "",
    sub_category: "",
    request_id: requestID ? requestID : "",
    backgroundColor: "#54D7B7",
    type_of_post: "",
  });

  const resetMediaPost = () => {
    setMediaPost({
      media_type: "",
      videoUri: "",
      imageUri: "",
      title: "",
      description: "",
      category: "",
      sub_category: "",
      request_id: requestID ? requestID : " ",
      backgroundColor: "#54D7B7",
      type_of_post: "",
    });
  };

  const handleCreatePost = async () => {
    setIsLoading(true);
    const success = await createPost(mediaPost, currentUser); // Assume createPost returns a boolean indicating success
    setIsLoading(false);
    if (success) {
      router.push('/feed'); // Navigate to home on success
    } else {
      "Something went wrong"
    }
  };

  // toggle BottomSheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetTypeOfPostModalRef = useRef<BottomSheetModal>(null);
  function handlePresentTypeOfPostModal() {
    bottomSheetTypeOfPostModalRef.current?.present();
  }
  const snapPoints = [Platform.OS === "web" ? "50%" : "25%"];
  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }
  //check if publish button is ready to be clicked
  function isDisabled() {
    // Check if the type of post is not selected
    if (mediaPost.type_of_post === "") {
      return true;
    }
  
    // Conditions for 'text' media type
    if (selectedMediaType === "text") {
      return mediaPost.title === "" ||
             mediaPost.description === "" ||
             mediaPost.sub_category === null;
    } else {
      // Conditions for 'video' or 'image' media type
      const media = selectedMediaType === "video" ? mediaPost.videoUri : mediaPost.imageUri;
      return mediaPost.title === "" ||
             media === "" ||
             mediaPost.sub_category === null ||
             mediaPost.description?.length === 0;
    }
  }

  const categoryId = params.requestID || null;
  const specificCategory = userCategories?.find(category => category._id === categoryId);

  

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <BottomSheetModalProvider>
        <SafeAreaView
          style={[
            styles.wrapper,
            isCameraOpen
              ? { backgroundColor: "black" }
              : { backgroundColor: "#fff" },
          ]}
        >
          {!sharer && <NotASharer />}

          {isLoading && (
            <View style={styles.isLoading}>
              <Image
                source={require("../../../assets/loading.gif")}
                style={{ width: 40, height: 40 }}
              />
            </View>
          )}
          {!isCameraOpen && (
            <View style={styles.container}>
              <HeaderSelection
                mediaType={selectedMediaType}
                onMediaTypeChange={handleMediaTypeChange}
                mediaPost={mediaPost}
                resetMediaPost={resetMediaPost}
                // setMediaPost={setMediaPost}
              />
                <CategorySelector
                  userCategories={specificCategory ? [specificCategory] : []}
                  setMediaPost={setMediaPost}
                  mediaPost={mediaPost}
                  preSelectedCategory={categoryId}
                />
              {fileIsTooBig && (
                <Text style={styles.tooBig}>
                  The file you selected is too big (no larger than 70mb)
                </Text>
              )}
              {selectedMediaType === "text" && (
                <TextPost
                  mediaPost={mediaPost}
                  onPostChange={setMediaPost}
                  mediaType={selectedMediaType}
                />
              )}

              {(selectedMediaType === "video" ||
                selectedMediaType === "image") && (
                <MediaPost
                  mediaPost={mediaPost}
                  onPostChange={setMediaPost}
                  mediaType={selectedMediaType}
                  handlePresentModal={handlePresentModal}
                />
              )}


              <View style={styles.bottomContainer}>
                <View style={{ width: "45%" }}>
                <TypeOfPost
                setMediaPost={setMediaPost}
                mediaPost={mediaPost}
                handlePresentModal={handlePresentTypeOfPostModal}
                />
                </View>
                {/* {currentUser && currentUser && (
                  <View>
                    <Text style={styles.text}>Publishing as:</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {sharer
                        ? currentUser.first_name + " " + currentUser.last_name
                        : "@" + currentUser.user_name}
                    </Text>
                  </View>
                )} */}

                <View style={{ width: "45%" }}>
                  <CustomButton
                    text={"Publish Post"}
                    hasIcon={true}
                    icon={"paper-airplane"}
                    borderStyle={[
                      styles.button,
                      isDisabled()
                        ? { backgroundColor: colors.__01_light_n }
                        : {},
                    ]}
                    textStyle={styles.button_text}
                    onPress={handleCreatePost}
                    disabled={isDisabled()}
                  />
                </View>
              </View>

              
              <BottomSheet
                snapPoints={snapPoints}
                bottomSheetModalRef={bottomSheetModalRef}
                mediaType={selectedMediaType}
                setIsCameraOpen={setIsCameraOpen}
                setMediaPost={setMediaPost}
                setFileIsTooBig={setFileIsTooBig}
              />
              <SelectPostColor
                bottomSheetModalRef={bottomSheetTypeOfPostModalRef}
                mediaPost={mediaPost}
                setMediaPost={setMediaPost}
              />
            </View>
          )}

          {isCameraOpen && (selectedMediaType === 'video' || selectedMediaType === 'image') && (
            <CameraComponent
              setIsCameraOpen={setIsCameraOpen}
              setMediaPost={setMediaPost}
              selectedMediaType={selectedMediaType}
              setSelectedMediaType={setSelectedMediaType}
            />
          )}

        </SafeAreaView>
      </BottomSheetModalProvider>
    </TouchableWithoutFeedback>
  );
};

type BottomSheetProps = {
  snapPoints: (number | string)[];
  bottomSheetModalRef: RefObject<BottomSheetModal>; // Replace BottomSheetModal with the correct type
  mediaType: 'image' | 'video' | 'text'; // Adjust based on your valid media types
  setIsCameraOpen: (isOpen: boolean) => void;
  setMediaPost: (value: MediaPostType | ((prevState: MediaPostType) => MediaPostType)) => void; // Replace MediaPostType with the correct type
  setFileIsTooBig: (isTooBig: boolean) => void;
};



const BottomSheet: React.FC<BottomSheetProps> = ({
  snapPoints,
  bottomSheetModalRef,
  mediaType,
  // handleSelectMedia,
  setIsCameraOpen,
  setMediaPost,
  setFileIsTooBig,
}) => {
  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={{
        borderRadius: 50,
        backgroundColor: "#fff",
        width: "100%", 
        alignSelf: "center"
      }}
    >
      <View style={styles.bottomSheetContainer}>
        <TouchableOpacity
          onPress={() => {
            handleSelectMedia(mediaType, setMediaPost, setFileIsTooBig);
            bottomSheetModalRef.current?.dismiss();
          }}
        >
          <View style={styles.optionContainer}>
            <Feather name="image" size={24} color={colors.primary} />
            <Text style={styles.bottomSheetText}>Media library</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsCameraOpen(true)}>
          <View style={styles.optionContainer}>
            <Feather name="camera" size={24} color={colors.primary} />
            <Text style={styles.bottomSheetText}>Camera</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancel}
          onPress={() => bottomSheetModalRef.current?.dismiss()}
        >
          <Text style={styles.bottomSheetText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 30 : 0,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center"
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 24,
    backgroundColor: "white"
  },
  button: {
    backgroundColor: colors.__main_blue,
    borderRadius: 4,
    // padding: Platform.OS != 'web' ? 0 : 10,
    borderColor: "gray",
    borderWidth: 1,
    height: "100%",
  },
  button_text: {
    color: "#fff",
    fontFamily: typography.appFont[700],
  },

  title: {
    fontFamily: typography.appFont[700],
    fontSize: 20,
  },
  bottomSheetText: {
    fontFamily: typography.appFont[400],
    fontSize: 18,
    color: "#1d232d",
  },
  bottomSheetContainer: {
    marginTop: "10%",
    rowGap: 10,
  },
  cancel: {
    alignSelf: "center",
  },
  optionContainer: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 1,
    width: "100%",
    paddingLeft: 15,
    paddingBottom: 5,
  },
  text: {
    fontFamily: typography.appFont[400],
    color: colors.__blue_dark,
  },
  bottomContainer: {
    flexDirection: "row",
    // position: Platform.OS != "web" ? "absolute" : "relative",
    // bottom: 30,
    // alignContent: "space-between",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "100%",
    maxHeight: 45,

  },
  tooBig: {
    alignSelf: "center",
    color: "red",
    position: "absolute",
  },
  isLoading: {
    backgroundColor: "rgba(189, 189, 189, 0.7)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10000,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RespondRequest;