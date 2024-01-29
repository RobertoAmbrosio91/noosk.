import axios from "../axios/axiosConfig";

// Assuming 'badge' is of type string and 'token' is also of type string.
// Adjust these types if your actual use case is different.
const changeIsShown = async (badge: string, token: string): Promise<void> => {
  try {
    const response = await axios.post(
      "/user/badge/shown-update",
      { badge },
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    if (response.data && response.data.success) {
      console.log("Badge updated");
    }
  } catch (error: any) {
    // Using 'any' for the error type is a common practice in TypeScript.
    // However, if you can determine a more specific type, it's better to use that.
    if (error.response && error.response.data && error.response.data.message) {
      console.error(error.response.data.message);
    } else {
      console.error(error);
    }
  }
};

export default changeIsShown;

