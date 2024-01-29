import { Amplify, Storage } from "aws-amplify";
import config from "../../aws_export/aws-exports.js";

Amplify.configure(config);

const uploadImageTos3 = async (uri: string) => {
  // URI to Blob function
  const uriToBlob = (uri: string) => {
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

  // Upload to S3
  try {
    const fileType = uri.split(".").pop();
    const fileName = `${new Date().getTime()}.${fileType}`;
    const blob = await uriToBlob(uri);

    const configObj = {
      contentType: "image/jpeg",
      ACL: "public-read",
    };

    // Logging the configuration object
    // console.log("Uploading with config:", configObj);

    const result = await Storage.put(fileName, blob, configObj);

    const cloudFrontURL = `https://dijtywqe2wqrv.cloudfront.net/public/${result.key}`;
    return cloudFrontURL;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export { uploadImageTos3 };
