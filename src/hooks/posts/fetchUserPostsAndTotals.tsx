import axios from "../axios/axiosConfig";

// Define a type for the response data if you know its structure
// For example, if it returns an object with posts and total count:
// type UserPostsResponse = { posts: Post[], total: number };

// Replace 'any' with 'UserPostsResponse' if you have a defined type
const fetchUserPostsAndTotals = async (
  current_page: number,
  no_of_docs: number,
  user_id: string | number, // Use 'number' if user_id is numeric
  token: string
): Promise<any> => { // Replace 'any' with the actual return type, e.g., 'UserPostsResponse'
  try {
    const response = await axios.post(
      "/user/list-owned-post",
      {
        current_page,
        no_of_docs_each_page: no_of_docs,
        user_id,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (response.data && response.data.success) {
      const posts = response.data.result; // The structure of 'posts' depends on your API response
      return posts;
    }
  } catch (error: any) { // Consider using a more specific error type if available
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error("Error fetching posts", error);
    }
  }
};

export default fetchUserPostsAndTotals;

