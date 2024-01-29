import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState, FC } from "react";
import colors from "../../config/colors";
import typography from "../../config/typography";
import CustomButton from "../buttons&inputs/CustomButton";
import getTimeAgo from "../../functionality/timeAgo";
import { Request } from "../../types";
import { router, useRouter } from "expo-router";


type RequestsProps = {
  requests: Request[];
};

const Requests: FC<RequestsProps> = ({ requests }) => {
  const router = useRouter()
  const isRequests = requests.length > 0;

  return (
    <View
      style={[
        styles.container,
        !isRequests
          ? { backgroundColor: "transparent", paddingTop: "30%" }
          : {},
      ]}
    >
      {isRequests && (
        <ScrollView style={{ marginBottom: "30%" }}>
          {requests.map((item) => (
            <RequestComponent
              key={item._id || item._id}
              request={item}
            />
          ))}
        </ScrollView>
      )}
      {!isRequests && (
        <View style={styles.noRequests}>
          <Text style={styles.textNoRequest}>
            Be the first to create a request
          </Text>
        </View>
      )}
    </View>
  );
};

type RequestProps = {
  request: Request;
};

const RequestComponent: FC<RequestProps> = ({ request }) => {
  const creator =
    request.post_by_data[0].user_name
      ? "@" + request.post_by_data[0].user_name
      : request.post_by_data[0].first_name;

  return (
    <TouchableOpacity
      style={styles.requestContainer}
      onPress={() => {
        router.push(`/request/${request._id}`);
      }}
    >
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
        borderStyle={styles.buttonStyle}
        source={require("../../../assets/turn-left.png")}
        onPress={() => {
          router.push(`/request/${request._id}`);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // takes up entire screen
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "flex-start",
    minHeight: 700,
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
    padding: 15,
    rowGap: 10,
  },
  noRequests: {
    alignItems: "center",
    justifyContent: "center",
  },
  textNoRequest: {
    fontFamily: typography.appFont[600],
    fontSize: 16,
    color: colors.__01_light_n,
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
export default Requests;
