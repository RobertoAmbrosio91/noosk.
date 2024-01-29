import axios from "../axios/axiosConfig";
import { Request } from "../../types";

const fetchAllRequests = async (token: string): Promise<Request[]> => {
  try {
    const response = await axios.post(
      "/user/post/request-list",
      {
        current_page: 0,
        no_of_docs_each_page: 30,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    if (response.data && response.data.success) {
      return response.data.result.posts;
    } else {
      console.error("No requests found");
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching requests:", error);
    return []; // Return an empty array in case of exception
  }
};

export default fetchAllRequests;

