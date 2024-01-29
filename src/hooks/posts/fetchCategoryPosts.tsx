import axios from "../axios/axiosConfig";

// Replace 'any[]' with the actual type of your post objects, if available
const fetchCategoryPosts = async (
  subcategories: string[], // or number[] if your categories are numeric
  page: number, 
  doc_x_page: number, 
  token: string
): Promise<any[]> => { // Replace 'any[]' with the actual return type
  try {
    const response = await axios.post(
      "/user/list-postsPersonalized",
      {
        subcategory_id: subcategories,
        current_page: page,
        no_of_docs_each_page: doc_x_page,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (response.data && response.data.success) {
      const posts = response.data.result.posts;
      return posts;
    }
  } catch (error: any) { // Consider using a more specific error type if available
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error("Error fetching posts", error);
    }
  }
  return []; // Return an empty array in case of failure
};

export default fetchCategoryPosts;

