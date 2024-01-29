import axios from "../axios/axiosConfig";

// Define the type for the return value if necessary.
// For example, if the result is an array of objects, you might define it like this:
// type Category = { id: string; name: string; };
// type FetchAllCategoriesResponse = Category[];

const fetchMacroCategories = async (token: string): Promise<any> => {
  // console.log("Fetching categories with token:", token);

  try {
      const response = await axios.get("/master/categorieslist", {
          headers: {
            "x-access-token": token,
          },
      });
  
      // console.log("Received response:", response.data);

      if (response.data && response.data.success) {
        const result = response.data.result;
        return result;
      }
  } catch (error: any) {
      console.error("Error fetching categories:", error);
      if (error.response && error.response.data && error.response.data.message) {
        console.error(error.response.data.message);
      } else {
        console.error(error);
      }
  }
};
export default fetchMacroCategories;