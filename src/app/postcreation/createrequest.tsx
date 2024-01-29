import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  GestureResponderEvent
} from "react-native";
import React, { useRef, useState, useEffect, RefObject } from "react";
import colors from "../../config/colors";
import typography from "../../config/typography";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import HeaderSelection from "../../components/createpost/HeaderSelection";
import TextPost from "../../components/createpost/TextPost";
import MediaPost from "../../components/createpost/MediaPost";
import "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import CameraComponent from "../../components/createpost/CameraComponent";
import CategorySelector from "../../components/createpost/CategorySelector";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import { createRequest } from "../../hooks/requests/createRequestHandler";
import { handleSelectMedia } from "../../functionality/handleSelectMedia";
import awsmobile from "../../../aws_export/aws-exports.js";
import { Amplify } from "aws-amplify";
import fetchAllCategories from "../../hooks/categories/fetchAllCategories";
import { CategoryData, UserData } from "../../types";
import { MediaPostType } from "../../types";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";

Amplify.configure(awsmobile);

interface Category {
  _id: string;
  name: string;
  // ... other properties of a category
}

const CreateRequest = () => {
  const router = useRouter()
  // check if requestID exist
  const params = useLocalSearchParams();
  const requestID = Array.isArray(params.requestID) ? params.requestID[0] : params.requestID;
  // fetching current user from async storage
  const currentUser = useFetchUserDataAsync();
  //fetching userdata from database
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileIsTooBig, setFileIsTooBig] = useState(false);

  //fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (currentUser) {
        const categories = await fetchAllCategories(currentUser.token);
        if (categories) {
          const sortedCategories = categories.sort((a: CategoryData, b: CategoryData) =>
            a.name.localeCompare(b.name)
          );
          setUserCategories(sortedCategories);
        }
      }
    };
    fetchCategories();
  }, [currentUser]);

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [selectedMediaType, setSelectedMediaType] = useState("text");
  const handleMediaTypeChange = (type: string) => {
    setSelectedMediaType(type);
    setMediaPost({
      ...mediaPost,
      media_type: type,
    });
  };

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
    });
  };

  // toggle BottomSheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = ["25%"];
  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  //check if publish button is ready to be clicked
  function isDisabled() {
    if (selectedMediaType === "text") {
      const result =
        mediaPost.title === "" ||
        mediaPost.description === "" ||
        !mediaPost.sub_category;
      return result;
    } else {
      const media =
        selectedMediaType === "video" ? mediaPost.videoUri : mediaPost.imageUri;
      const result =
        media === "" ||
        mediaPost.sub_category === null ||
        mediaPost.description?.length === 0;
      return result;
    }
  }

  const handleCreateRequest = async () => {
    if (!currentUser) {
      console.error('No current user data available');
      // Handle the case when currentUser is null (maybe show an error message)
      return;
    }
    setIsLoading(true);
    const success = await createRequest(mediaPost, currentUser); // Assume createPost returns a boolean indicating success
    setIsLoading(false);
    if (success) {
      router.push('/'); // Navigate to home on success
    } else {
      "Something went wrong"
    }
  };

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
            userCategories={userCategories}
            setMediaPost={setMediaPost}
            mediaPost={mediaPost}
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
                {/* {currentUser && currentUser && (
                  <View>
                    <Text style={styles.text}>Publishing as:</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      @{currentUser.user_name}
                    </Text>
                  </View>
                )} */}
                <View style={{ maxWidth: "60%" }}>
                <CustomButton
                  text={"Publish Request"}
                  hasIcon={true}
                  icon={"paper-airplane"}
                  borderStyle={[
                    styles.button,
                    isDisabled() ? { backgroundColor: "rgba(23, 28, 36, 0.3)" } : {},
                  ]}
                  textStyle={styles.button_text}
                  onPress={() => {
                    if (currentUser) { // Ensure currentUser is not null
                      createRequest(mediaPost, currentUser);
                      setIsLoading(!isLoading);
                    } else {
                      alert("You must be logged in to publish a request. Please log in and try again.");
                    }
                  }}
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
  mediaType: string; // Adjust based on your valid media types
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
    padding: Platform.OS != 'web' ? 0 : 10,
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
    justifyContent: "flex-end",
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

export default CreateRequest;
