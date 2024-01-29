import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";
import typography from "../../config/typography";
import fetchAllCategories from "../../hooks/categories/fetchAllCategories";

const SearchComponent = ({ token, selectedFilters, setSelectedFilters }) => {
  const [categories, setCategories] = useState();

  const handleCategoriesId = (id) => {
    setSelectedFilters((prevFilters) => {
      const isIdPresent = prevFilters.categories_id.includes(id);
      if (isIdPresent) {
        return {
          ...prevFilters,
          categories_id: prevFilters.categories_id.filter(
            (existingId) => existingId !== id
          ),
        };
      } else {
        return {
          ...prevFilters,
          categories_id: [...prevFilters.categories_id, id],
        };
      }
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (token) {
        const fetchedCategories = await fetchAllCategories(token);
        setCategories(fetchedCategories);
      }
    };
    fetchCategories();
  }, [token]);
  return (
    <View style={styles.searchContainer}>
      <SearchBar
        setSelectedFilters={setSelectedFilters}
        selectedFilters={selectedFilters}
      />
      <Categories
        categories={categories}
        handleCategoriesId={handleCategoriesId}
        selectedFilters={selectedFilters}
      />
    </View>
  );
};

const SearchBar = ({ setSelectedFilters, selectedFilters }) => {
  return (
    <View style={styles.searchBar}>
      <View>
        <Feather name="search" size={24} color={colors.__main_blue} />
      </View>
      <TextInput
        placeholder="Search on Noosk"
        style={{ flex: 1, paddingLeft: 10 }}
        onChangeText={(value) =>
          setSelectedFilters({ ...selectedFilters, text_input: value })
        }
      />
    </View>
  );
};

const Categories = ({ categories, handleCategoriesId, selectedFilters }) => {
  return (
    <View style={{ rowGap: 10, marginTop: 10 }}>
      <Text style={styles.categories}>All Categories</Text>
      <ScrollView style={{ height: 200 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: 10,
            rowGap: 10,
          }}
        >
          {categories &&
            categories.map((category) => {
              return (
                <SingleCategory
                  category={category}
                  key={category._id}
                  handleCategoriesId={handleCategoriesId}
                  selectedFilters={selectedFilters}
                />
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};
const SingleCategory = ({ category, handleCategoriesId, selectedFilters }) => {
  const { _id, name } = category;
  function handleStyle(id) {
    if (selectedFilters.categories_id.includes(id))
      return styles.selectedCategory;
    return styles.category;
  }
  return (
    <TouchableOpacity
      style={handleStyle(_id)}
      key={_id}
      onPress={() => handleCategoriesId(_id)}
    >
      <Text style={styles.categoryName}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: "100%",
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 5,
    flexDirection: "row",
  },
  categories: {
    fontFamily: typography.appFont[700],
    color: colors.__01_light_n,
    fontSize: 16,
    alignSelf: "center",
  },
  category: {
    padding: 7,
    borderWidth: 1,
    borderColor: colors.__blue_light,
    borderRadius: 4,
  },
  selectedCategory: {
    padding: 7,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: colors.__teal_dark,
  },
  categoryName: {
    fontFamily: typography.appFont[400],
    color: colors.__01_light_n,
  },
});
export default SearchComponent;
