import axios from "../axios/axiosConfig";
import { Storage } from "aws-amplify";

export const uriToBlob = (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error("uriToBlob failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

export const uploadToS3 = async (uri: string, mediaType: string): Promise<string | undefined> => {
  try {
    const fileType = uri.split(".").pop() as string;
    const fileName = `${new Date().getTime()}.${fileType}`;
    const blob = await uriToBlob(uri);
    const result = await Storage.put(fileName, blob, {
      contentType: mediaType === "image" ? "image/jpeg" : "video/mp4",
      acl: "public-read",
    });
    const cloudFrontURL = `https://dijtywqe2wqrv.cloudfront.net/public/${result.key}`;
    return cloudFrontURL;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const createRequest = async (
  mediaPost: { media_type: string; imageUri?: string; videoUri?: string; title: string; description: string; category: string; sub_category: string; }, 
  currentUser: { token: string }, 
): Promise<any> => {
  if (mediaPost.media_type === "image" && mediaPost.imageUri) {
    const cloudFrontURL = await uploadToS3(mediaPost.imageUri, "image");
    mediaPost.imageUri = cloudFrontURL;
  } else if (mediaPost.media_type === "video" && mediaPost.videoUri) {
    const cloudFrontURL = await uploadToS3(mediaPost.videoUri, "video");
    mediaPost.videoUri = cloudFrontURL;
  }
  try {
    const response = await axios.post(
      "/user/post/create-request",
      {
        type: mediaPost.media_type,
        title: mediaPost.title,
        description: mediaPost.description,
        category_id: mediaPost.category,
        subcategory_id: mediaPost.sub_category,
        images: [mediaPost.imageUri],
        videos: [mediaPost.videoUri],
      },
      {
        headers: { "x-access-token": currentUser.token },
      }
    );
    if (response.data && response.data.success) {
      const responseDataJson = JSON.stringify(response.data);
      // console.log("Request created successfully : ", responseDataJson);
      return true
    } else if (response.data.success === false) {
      const responseDataJson = JSON.stringify(response.data);
      console.log("something went wrong", responseDataJson);
    } else {
      console.log("Empty response or no data returned.");
      return false
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.message) {
      console.log(error.response.data.message);
    } else {
      console.error("Error creating Request", error);
    }
    return false
  }
};
