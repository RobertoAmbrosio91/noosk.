import axios from "../axios/axiosConfig";

// Assuming notification_id is a string. Change to 'number' if IDs are numeric
const readNotification = async (
  notification_id: string, 
  token: string
): Promise<void> => {  // Function doesn't return anything, hence Promise<void>
  try {
    const response = await axios.get(`/user/notification/${notification_id}`, {
      headers: {
        "x-access-token": token,
      },
    });
    if (response.data && response.data.success) {
      console.log("Notification is now read");
    }
  } catch (error: any) {  // Consider using a more specific error type if available
    if (error.response && error.response.data && error.response.data.message) {
      console.log(error.response.data.message);
    } else {
      console.log(error);
    }
  }
};

export default readNotification;

