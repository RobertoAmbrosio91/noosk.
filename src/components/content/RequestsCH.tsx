import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from "react-native";
import React, { FC } from "react";
import colors from "../../config/colors";
import typography from "../../config/typography";
import CustomButton from "../buttons&inputs/CustomButton";
import getTimeAgo from "../../functionality/timeAgo";
import { Request } from "../../types";
import { useRouter, useLocalSearchParams, router } from "expo-router";


// Define the props for RequestsCH component
interface RequestsCHProps {
  requests: Request[];
}

const RequestsCH: FC<RequestsCHProps> = ({ requests }) => {
  const router = useRouter()
  const isRequests = requests.length > 0;
  return (
    <View
      style={[
        styles.container,
        !isRequests
          ? { backgroundColor: "transparent", paddingTop: "10%" }
          : {},
      ]}
    >
      {isRequests && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollViewStyle}
        >
          {requests.map((item, index) => (
            <RequestItem
              key={item._id || item._id}
              request={item}
              index={index}
            />
          ))}
        </ScrollView>
      )}
      {!isRequests && (
        <View style={styles.noRequests}>
          <Text style={styles.textNoRequest}>
            There are no requests in your areas of expertise
          </Text>
        </View>
      )}
    </View>
  );
};

// Define the props for Request component
interface RequestProps {
  request: Request;
  index: number;
}

const RequestItem: FC<RequestProps> = ({ request, index }) => {
  const windowWidth = Dimensions.get("window").width - 32;

  return (
    <TouchableOpacity
      style={[
        styles.requestContainer,
        index === 0 ? { marginLeft: 16, width: windowWidth } : { width: windowWidth },
      ]}
      onPress={() => router.push(`/request/${request._id}`)}
    >
      <Text>
        Request by @{request.post_by_data[0].user_name} in {request.subcategory_data[0].name} - {getTimeAgo(request)}
      </Text>
      <Text style={{ fontWeight: "bold" }}>{request.title}</Text>
      <Text>{request.description}</Text>
      <CustomButton
        text="Reply"
        borderStyle={styles.buttonStyle}
        source={require("../../../assets/turn-left.png")}
        onPress={() => router.push(`/request/${request._id}`)}

      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // takes up entire screen
    backgroundColor: "#fff",
    // paddingHorizontal: 24,
    justifyContent: "flex-start",
    minHeight: 300,
  },
  scrollViewStyle: {
    flexDirection: "row",
    marginBottom: Platform.OS != "web" ? "30%" : "10%", // Ensures the children are laid out in a row
  },
  buttonStyle: {
    width: 100,
    alignSelf: "flex-end",
    borderRadius: 4,
    backgroundColor: colors.__teal_light,
  },
  headerContainer: {
    height: 200,
    backgroundColor: colors.__main_blue,
    paddingTop: "15%",
    paddingHorizontal: 24,
    rowGap: 20,
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
    borderWidth: 1,
    borderColor: colors.__blue_light,
    borderRadius: 4,
    marginTop: 12,
    marginRight: 50,
    padding: 15,
    rowGap: 10,
    height: 200,
    maxWidth: 500,
  },
  noRequests: {
    alignItems: "center",
    justifyContent: "center",
  },
  textNoRequest: {
    fontFamily: typography.appFont[600],
    fontSize: 16,
    color: colors.__01_light_n,
    textAlign: "center",
  },
});
export default RequestsCH;
