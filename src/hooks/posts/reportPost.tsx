import axios from "../axios/axiosConfig";


const reportPost = async (
  post_id: string | null,
  message: string,
  token: string
): Promise<any> => {
  try {
    const response = await axios.post(
      "/user/post-report",
      {
        post_id: post_id,
        report_message: message,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    if (response.data && response.data.success) {
      // console.log("Post reported successfully", response.data.message);
      return response.data;
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

export default reportPost;

