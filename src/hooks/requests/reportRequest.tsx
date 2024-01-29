import axios from "../axios/axiosConfig";

// Define the structure of the API response
interface ReportResponse {
  success: boolean;
  message: string;
  // Add any other relevant fields that the response might have
}

const reportRequest = async (
  request_id: string,
  message: string,
  token: string
): Promise<ReportResponse | undefined> => {
  try {
    const response = await axios.post<ReportResponse>(
      "/user/post-request-report",
      {
        post_request_id: request_id,
        report_message: message,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    if (response.data && response.data.success) {
      // console.log("Request reported successfully", response.data.message);
      return response.data;
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error(error);
    }
  }
};

export default reportRequest;

