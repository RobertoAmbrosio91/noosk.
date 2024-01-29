import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModalProvider, BottomSheetModal } from "@gorhom/bottom-sheet";
import Header from "../../components/header/header";
import colors from "../../config/colors";
import typography from "../../config/typography";
import CustomButton from "../../components/buttons&inputs/CustomButton";
import useFetchUserDataAsync from "../../hooks/async_storage/useFetchUserDataAsync";
import fetchRequestReplies from "../../hooks/requests/fetchRequestReplies";
import getRequestDetails from "../../hooks/requests/getRequestDetails";
import getTimeAgo from "../../functionality/timeAgo";
import GroupContentNew from "../../components/content/GroupContentNew";
import ReportRequest from "../../components/bottomSheets/ReportRequest";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Request as RequestType } from "src/types";




const SingleRequest = () => {
  const currentUser = useFetchUserDataAsync();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const requestId = id as string;  // Retrieve the dynamic segment as 'requestId'
  const [request, setRequest] = useState<RequestType | null>(null);
  const [replies, setReplies] = useState<any[]>([]); // Define a specific type if possible
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
  }

  //handling reply button by category
//handling reply button by category
  const requestCategory = request?.subcategory_data && request.subcategory_data.length > 0
  ? request.subcategory_data[0]._id
  : null;


  const userCategories = currentUser ? currentUser.subcategory_id : null;
  //  console.log(requestCategory);
  //  console.log(userCategories);
  const isVisible =
    userCategories &&
    requestCategory &&
    userCategories.includes(requestCategory)
      ? true
      : false;

      useEffect(() => {
        const fetchReplies = async () => {
          if (currentUser && requestId) {
            const fetchedReplies = await fetchRequestReplies(
              0,
              40,
              requestId,
              currentUser.token
            );
            setReplies(fetchedReplies);
          }
        };
        const fetchRequestDetails = async () => {
          if (currentUser && requestId) {
            const fetchedRequest = await getRequestDetails(
              requestId,
              currentUser.token
            );
            if (fetchedRequest) {
              setRequest(fetchedRequest);
            }
          }
        };
      
        // Initiate both fetch operations concurrently
        fetchReplies();
        fetchRequestDetails();
      }, [currentUser, requestId]);



  return (
    <View style={styles.container}>
      <BottomSheetModalProvider>
        <ScrollView
          style={{
            marginBottom: 100,
          }}
        >
          <View style={styles.headerContainer}>
            <Header />
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ rowGap: 20, top: -60 }}>
            <Request
              key={requestId}
              request={request}
              handlePresentModal={handlePresentModal}
              // currentUser={currentUser}
              isVisible={isVisible}
            />

            <View style={styles.contentContainer}>
              <GroupContentNew posts={replies} />
            </View>
          </View>
        </ScrollView>
        {isVisible && (
          <View style={styles.buttonContainer}>
            <CustomButton
              text="Submit a Reply"
              borderStyle={[styles.buttonStyle, { width: "100%" }]}
              onPress={() =>
                router.push({
                  pathname: `/requestresponse/${requestId}`, 
                  params: { requestID: request?.subcategory_data && request.subcategory_data.length > 0 ? request.subcategory_data[0]._id : null }
                })
              }              
              source={require("../../../assets/turn-left.png")}
            />
          </View>
        )}

        <ReportRequest
          bottomSheetModalRef={bottomSheetModalRef}
          current_request_id={requestId}
          currentUser={currentUser}
          setIsMessageVisible={setIsMessageVisible}
          isMessageVisible={isMessageVisible}
        />
        {isMessageVisible && (
          <Message
            setIsMessageVisible={setIsMessageVisible}
            isMessageVisible={isMessageVisible}
          />
        )}
      </BottomSheetModalProvider>
    </View>
  );
};

type RequestProps = {
  request: any; // Define a more specific type for request
  handlePresentModal: () => void;
  isVisible: boolean;
};



const Request: React.FC<RequestProps> = ({ request, handlePresentModal, isVisible }) => {
  if (!request) {
    // Render a loading spinner, return null, or render some placeholder content
    return <Text>Loading...</Text>;
  }
  const requestId = request._id;
  // Now that we've handled the null case, we can safely assume `request` is not null below
  const creator = request.post_by_data[0].user_name
    ? "@" + request.post_by_data[0].user_name
    : request.post_by_data[0].first_name;
  return (
    <View style={styles.requestContainer}>
      <TouchableOpacity
        style={{ position: "absolute", top: 10, right: 10, zIndex: 100 }}
        onPress={() => handlePresentModal()}
      >
        <Feather name="alert-triangle" size={24} color={colors.__01_light_n} />
      </TouchableOpacity>
      {request && request.images[0] !== "" && (
        <Image
          source={{ uri: `${request.images[0]}` }}
          style={{ width: 100, height: 100, borderRadius: 4 }}
        />
      )}
      <Text>
        Request by <Text style={styles.creator}>{creator}</Text>
      </Text>
      <Text style={styles.requestCategory}>
        in {request.subcategory_data[0].name}
      </Text>
      <Text style={styles.creator}>{request.title}</Text>
      <Text>{request.description}</Text>
      <Text style={{ position: "absolute", bottom: 15, left: 15 }}>
        {getTimeAgo(request)}
      </Text>
      <CustomButton
        text="Reply"
        borderStyle={[
          styles.buttonStyle,
          !isVisible ? { backgroundColor: "rgba(84, 215, 183, 0.5)" } : {},
        ]}
        source={require("../../../assets/turn-left.png")}
        onPress={() =>
          router.push({
            pathname: `/requestresponse/${requestId}`, 
            params: { requestID: request?.subcategory_data && request.subcategory_data.length > 0 ? request.subcategory_data[0]._id : null }
          })
        }         
        disabled={isVisible ? false : true}
      />
    </View>
  );
};


type MessageProps = {
  setIsMessageVisible: (isVisible: boolean) => void;
  isMessageVisible: boolean;
};


const Message: React.FC<MessageProps> =  ({ setIsMessageVisible, isMessageVisible }) => {
  return (
    <TouchableOpacity
      style={styles.messageContainer}
      onPress={() => setIsMessageVisible(!isMessageVisible)}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.messageText}>Thank you for flagging!</Text>
        <MaterialCommunityIcons name="window-close" size={16} color="#fff" />
      </View>
      <Text style={{ fontFamily: typography.appFont[400], color: "#fff" }}>
        We will review this request ASAP and take action if necessary
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center"
  },
  buttonStyle: {
    width: 100,
    alignSelf: "flex-end",
    borderRadius: 4,
    backgroundColor: colors.__teal_light,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    position: "absolute",
    bottom: "9%",
    alignSelf: "center",
    width: "100%",
  },
  headerContainer: {
    height: 200,
    backgroundColor: colors.__main_blue,
    paddingTop: Platform.OS != "web" ? "15%" : "0%",
    paddingHorizontal: 24,
    rowGap: 0,
  },
  categoryName: {
    alignSelf: "center",
    fontFamily: typography.appFont[700],
    color: "#fff",
    fontSize: 20,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 20,
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
    color: colors.secondary_contrast,
  },
  currentSelectionText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: typography.appFont[700],
  },
  requestContainer: {
    width: "90%",
    borderWidth: 1,
    borderColor: colors.__blue_light,
    borderRadius: 4,
    padding: 15,
    rowGap: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    // position: "absolute",
    // width: "90%",
    // top: 135,
    zIndex: 10,
  },
  contentContainer: {
    paddingHorizontal: 24,
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
  creator: {
    fontFamily: typography.appFont[600],
  },
  requestCategory: {
    color: colors.__teal_dark,
    fontStyle: "italic",
    fontWeight: "500",
  },
});
export default SingleRequest;