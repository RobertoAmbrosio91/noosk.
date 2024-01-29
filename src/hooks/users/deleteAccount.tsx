import axios from "../axios/axiosConfig";

// Define the structure of the API response
interface DeleteAccountResponse {
  success: boolean;
  message: string;
  result: {}; // Since the result is an empty object
}

const deleteAccount = async (
  token: string
): Promise<DeleteAccountResponse | undefined> => {
  try {
    const response = await axios.delete<DeleteAccountResponse>("/user/remove-account", {
      headers: {
        "x-access-token": token,
      },
    });

    const result = response.data;
    // console.log(result);
    return result;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error("Error deleting user: ", error);
    }
  }
};

export default deleteAccount;

