import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleProp, 
  ViewStyle, 
  TextStyle,
  Platform
} from 'react-native';
import React, { useState, useEffect, FC } from "react";
import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import typography from "../../config/typography";
import SignupInput from "../buttons&inputs/SignupInput";

interface CategorySelectorProps {
  setMediaPost: (mediaPost: any) => void; // Use a more specific type instead of 'any' if available
  mediaPost: any; // Use a more specific type instead of 'any' if available
  userCategories: Category[] | undefined; // Define 'Category' type based on your data structure
  preSelectedCategory?: any;
}

interface Category {
  _id: string;
  name: string;
  // ... other properties of a category
}



const CategorySelector: React.FC<CategorySelectorProps> = ({
  setMediaPost,
  mediaPost,
  userCategories,
  preSelectedCategory,
}) => {
  const bgColor = (tag: string) => {
    if (tag === "Analysis") return colors.__teal_light;
    else if (tag === "Latest Trends") return "#816C49";
    else if (tag === "Tips & Tricks") return "#D0D0D0";
    else if (tag === "Skills & Crafts") return "#1d232d";
    else if (tag === "Facts & Figures") return colors.__teal_dark;
  };
  // console.log(preSelectedCategory);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const handleTopicChange = (topic: string) => {
    setSelectedCategory(topic);
    setMediaPost({
      ...mediaPost,
      sub_category: topic,
    });
  };
  const handleSelectedContainerStyle = (value: string): StyleProp<ViewStyle> => {
    if (value == selectedCategory) return styles.selectedCategory;
    return styles.category;
  }
  const handleSelectedTextStyle = (value: string): StyleProp<TextStyle> => {
    if (value == selectedCategory) return styles.selectedCategoryText;
    return styles.categoryText;
  }

  useEffect(() => {
    const changeCategory = () => {
      setSelectedCategory(preSelectedCategory);
      setMediaPost({
        ...mediaPost,
        sub_category: preSelectedCategory,
      });
    };
    changeCategory();
  }, [preSelectedCategory]);
  return (
    <View
      style={{
        flexDirection: "row",
        alignSelf: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 20,

      }}
    >
      <Text>Post on</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.wrapper}>
          {userCategories &&
            userCategories.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  handleSelectedContainerStyle(topic._id),
                  index === 0 ? { marginLeft: 10 } : {},
                ]}
                onPress={() => handleTopicChange(topic._id)}
              >
                <Text style={handleSelectedTextStyle(topic._id)}>
                  {topic.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>


    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 40,
  },
  category: {
    borderWidth: 1,
    borderColor: colors.__blue_dark,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  selectedCategory: {
    backgroundColor: colors.__teal_light,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  categoryText: {
    fontFamily: typography.appFont[400],
    color: colors.__blue_dark,
  },
  selectedCategoryText: {
    fontFamily: typography.appFont[400],
    color: colors.primary,
  },
  postType: {

  },
  typeColor: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
});

export default CategorySelector;
