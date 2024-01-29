import React, { useRef, useEffect, FC } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Animated, Platform } from 'react-native';
import colors from '../../config/colors';
import Header from '../../components/header/header';
import typography from '../../config/typography';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingScreen: FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Define the fade in-out animation
  const fadeInOut = () => {
    // This will fade in the view
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      // This will fade out the view after the fade in is done
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    fadeInOut();
    const intervalId = setInterval(fadeInOut, 1600); // repeats every 4 seconds
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  const CustomGradient = () => {
    return (
      <LinearGradient
        colors={["#4a5a75", "#323e50"]}
        start={[0, 0]}
        end={[0, 1]}
        style={styles.gradient}
      />
    );
  };
  const CustomGradient2 = () => {
    return (
      <LinearGradient
        colors={["#1d232d", "#202834"]}
        start={[0, 0]}
        end={[0, 1]}
        style={[styles.gradient, { borderRadius: 10 }]}
      />
    );
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Header />
        <View>
          {/* <Text style={styles.text}>Welcome!</Text> */}
          <Text style={styles.text}>Give us a minute</Text>
        </View>

        <Animated.View
          style={[styles.my_topic_container, { opacity: fadeAnim }]}
        >
          <View style={styles.my_topic_left}>
            <View style={styles.left_inner}>
              <CustomGradient2 />
            </View>
            <View style={styles.left_inner}>
              <CustomGradient2 />
            </View>
            <View style={styles.left_inner}>
              <CustomGradient2 />
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.__main_blue,
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    rowGap: 25,
  },
  text: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontFamily: typography.appFont[700],
  },

  shortVideo: {
    width: 60,
    height: 80,
    borderRadius: 4,
  },
  gradient: {
    flex: 1,
    borderRadius: 4,
  },
  my_topic_container: {
    flexDirection: "row",
    columnGap: 20,
  },

  my_topic_left: {
    flex: 1,
    rowGap: 15,
  },
  left_inner: {
    height: 200,
    borderRadius: 10,
  },
  my_topic_right: {
    flex: 1,
    rowGap: 15,

    width: 150,
  },
  right_inner: {
    height: 170,
    borderRadius: 10,
  },
});

export default LoadingScreen;
