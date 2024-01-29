import axios from "../axios/axiosConfig";

// Assuming the function returns an array of a certain type, for example, Post[]
// Replace 'any[]' with the actual type of your post objects, if available
const fetchAllPosts = async (
  current_page: number, 
  no_docs: number, 
  token: string
): Promise<any[]> => { // Replace 'any[]' with the actual return type
  try {
    const response = await axios.post(
      "/user/list-posts",
      {
        current_page,
        no_of_docs_each_page: no_docs,
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

export default fetchAllPosts;

