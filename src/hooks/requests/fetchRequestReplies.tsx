import axios from "../axios/axiosConfig";



const fetchRequestReplies = async (
  current_page: number,
  no_docs_each_page: number,
  request_id: string,
  token: string
): Promise<any | undefined> => {
  try {
    const response = await axios.post(
      "/user/post/request-replies",
      {
        current_page,
        no_docs_each_page,
        request_id,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    if (response.data && response.data.success) {
      const replies = response.data.result.posts;
      return replies;
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error("Error fetching replies :", error);
    }
  }
};

export default fetchRequestReplies;
