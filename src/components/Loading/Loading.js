import { View, Text, SafeAreaView, StyleSheet, Image } from "react-native";
import React from "react";
import colors from "../../config/colors";

const Loading = () => {
  const loading = require("../../../assets/loading.gif");
  return (
    <SafeAreaView style={styles.wrapper}>
      <Image source={loading} style={{ width: 40, height: 40 }} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.__main_blue,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Loading;
