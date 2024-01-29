import axios from "../axios/axiosConfig";
import { Request } from "../../types";

const fetchRequestsByCategory = async (
  subcategory: string[], 
  page: number, 
  no_of_docs: number, 
  token: string
): Promise<Request[] | undefined> => {
  try {
    const response = await axios.post(
      "/user/post/requestsByCategory",
      {
        subcategory_id: subcategory,
        current_page: page,
        no_of_docs_each_page: no_of_docs,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );

    if (response.data && response.data.success) {
      const posts: Request[] = response.data.result.posts;
      return posts;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export default fetchRequestsByCategory;
