import axios from "../axios/axiosConfig";

// Define the type for the return value if necessary.
// For example, if the result is an array of objects, you might define it like this:
// type Category = { id: string; name: string; };
// type FetchAllCategoriesResponse = Category[];

const fetchAllCategories = async (token: string): Promise<any> => {  // Replace 'any' with 'FetchAllCategoriesResponse' if you have a specific type
  try {
    const response = await axios.post(
      "/master/subcategories",
      {
        category_id: "64cc1b42c695a7581244010c",
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    if (response.data && response.data.success) {
      const result = response.data.result;
      return result;
    }
  } catch (error: any) {  // Consider using a more specific error type if available
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error(error);
    }
  }
};

export default fetchAllCategories;

