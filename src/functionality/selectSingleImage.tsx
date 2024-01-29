import * as ImagePicker from "expo-image-picker";

const selectSingleImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    base64: true,
  });

  if (result?.assets && result.assets.length > 0) {
    const selectedUri = result.assets[0].uri;
    return selectedUri;
  }
};

export default selectSingleImage;
