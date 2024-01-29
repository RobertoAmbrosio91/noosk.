import axios from "../axios/axiosConfig";




const getRequestDetails = async (requestId: string, token: string) => {
  try {
    const response = await axios.get(
      `/user/post-request/${requestId}`,

      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (response.data && response.data.success) {
      // console.log("request details fetched successfully");
      const result = response.data.result;
      return result;
    } else if (
      response.data &&
      response.data.success == false &&
      response.data.message === "Post request id is not valid"
    ) {
      console.log("Request not found");
      const result = response.data.result;
      return result;
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.message === "Post request id is not valid") {
        console.log("Request not found");
      }
    } else {
      console.error(
        "Something went wrong while fetching request details",
        error
      );
    }
  }
};

export default getRequestDetails;