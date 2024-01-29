import axios from "../axios/axiosConfig";


export const upvote = async (
  post_id: string,
  type: string,
  token: string
): Promise<void> => {
  try {
    const response = await axios.post(
      "/user/post-vote",
      {
        post_id: post_id,
        type: type,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (response.data && response.data.success) {
      console.log("Successfully upvoted");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const responseData = error.response.data;
      if (responseData && responseData.message) {
        console.error(responseData.message);
      } else {
        console.error(error.message);
      }
    } else {
      console.error(error);
    }
  }
};

export const removeVote = async (
  post_id: string,
  type: string,
  token: string
): Promise<void> => {
  try {
    const response = await axios.post(
      "/user/post-vote-remove",
      {
        post_id: post_id,
        type: type,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (response.data && response.data.success) {
      console.log("Successfully removed");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const responseData = error.response.data;
      if (responseData && responseData.message) {
        console.error(responseData.message);
      } else {
        console.error(error.message);
      }
    } else {
      console.error(error);
    }
  }
};



