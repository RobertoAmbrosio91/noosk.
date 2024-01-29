import axios from "../axios/axiosConfig";
import { Request } from "../../types";



const fetchUserRequests = async (
  current_page: number,
  num_docs: number,
  user_id: string,
  token: string
): Promise<Request[] | undefined> => {
  try {
    const response = await axios.post(
      "/user/post/owned-request-list",
      {
        current_page,
        no_of_docs_each_page: num_docs,
        user_id,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    if (response.data && response.data.success) {
      return response.data.result.posts;
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error("Error fetching requests", error);
    }
  }
};

export default fetchUserRequests;

