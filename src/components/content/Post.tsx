import React from "react";
import { Image, Text, View, StyleSheet, ImageSourcePropType } from "react-native";

// Define an interface for the component props
interface PostProps {
  src: string;
  title: string;
  description: string;
  id: string; // Assuming id is a string. Adjust the type if needed.
  img: ImageSourcePropType; // Use ImageSourcePropType for image sources
}

const Post: React.FC<PostProps> = ({ src, title, description, id, img }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Image source={img} style={styles.profileImage} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <Image
        source={{
          uri: src,
        }}
        style={styles.image}
      />
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomColor: "red",
    borderBottomWidth: 2,
    marginBottom: 20,
  },

  title: {
    fontSize: 16,
    padding: 5,
  },

  description: {
    padding: 5,
    fontSize: 14,
  },

  image: {
    width: "100%",
    height: 450,
    resizeMode: "contain",
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
});

export default Post;
