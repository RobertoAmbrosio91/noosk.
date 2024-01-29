import axios from "../axios/axiosConfig";

// Assuming both fcm_token and token are strings
// Update the types if they are different
const saveToken = async (fcm_token: string, token: string): Promise<void> => {
  try {
    const response = await axios.post(
      "/user/save-token",
      {
        firebase_token: fcm_token,
      },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (response.data && response.data.success) {
      console.log("Token successfully saved");
    }
  } catch (error: any) { 
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error("Error saving token : ", error);
    }
  }
};

export default saveToken;
