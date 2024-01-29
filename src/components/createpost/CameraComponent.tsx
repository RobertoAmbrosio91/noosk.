import React, { useEffect, useState, useRef, FC } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';


// Define your prop types here
interface CameraComponentProps {
  setIsCameraOpen: (isOpen: boolean) => void;
  setMediaPost: (mediaPost: any) => void; // Replace 'any' with a more specific type if available
  selectedMediaType: 'video' | 'image';
  setSelectedMediaType: (mediaType: 'video' | 'image') => void;
}

const CameraComponent: FC<CameraComponentProps> = ({
  setIsCameraOpen,
  setMediaPost,
  selectedMediaType,
  setSelectedMediaType,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.back);
  const [isVideoMode, setIsVideoMode] = useState(selectedMediaType === 'video');
  const [isPhotoMode, setIsPhotoMode] = useState(selectedMediaType === 'image');
  const [isRecording, setIsRecording] = useState(false);
  const [capturedMediaUri, setCapturedMediaUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCameraType = () => {
    setCameraType(
      cameraType === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  };
  

  const handleCapture = async () => {
    if (cameraRef.current) {
      setIsRecording(!isRecording);
      if (isPhotoMode) {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedMediaUri(photo.uri);
      } else {
        if (isRecording) {
          cameraRef.current.stopRecording();
        } else {
          try {
            setIsRecording(true);
            const video = await cameraRef.current.recordAsync();
            setCapturedMediaUri(video.uri);
          } catch (error) {
            if (error instanceof Error) {
              // Now TypeScript knows this is a standard JavaScript Error
              console.log("Error recording:", error.message);
            } else {
              // Handle any other types of unknown errors
              console.error("Unknown error occurred while recording:", error);
            }
          }
        }
      }
    }
  };

  type MediaPostType = {
    //... (other properties of MediaPostType)
    [key: string]: any; // This line allows for dynamic key access like you do with `[${selectedMediaType}Uri]`
  };

  const handleConfirmMedia = () => {
    setMediaPost((prevState: MediaPostType) => ({
      ...prevState,
      [`${selectedMediaType}Uri`]: capturedMediaUri,
      media_type: selectedMediaType,
    }));
  
    setIsCameraOpen(false);
  };

  const handleRetakeMedia = () => {
    setCapturedMediaUri(null);
  };

  //recording duration
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isRecording && isVideoMode) {
      timer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
  
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, isVideoMode]);


  // Convert the recording duration (in seconds) to mm:ss format
  const formatRecordingDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={cameraType} ref={cameraRef}>
        <View style={styles.cameraContainer}>
          <TouchableOpacity
            onPress={handleCloseCamera}
            style={styles.closeIcon}
          >
            <AntDesign name="close" size={35} color="white" />
          </TouchableOpacity>
          {isRecording && isVideoMode && (
            <Text style={styles.recordingTimer}>
              {formatRecordingDuration(recordingDuration)}
            </Text>
          )}

          {capturedMediaUri ? (
            <View style={styles.previewContainer}>
              {isPhotoMode ? (
                <Image
                  style={styles.previewImage}
                  source={{ uri: capturedMediaUri }}
                />
              ) : (
                <Video
                  source={{ uri: capturedMediaUri }}
                  style={styles.previewVideo}
                  shouldPlay
                  useNativeControls={true}
                  resizeMode={ResizeMode.COVER}
                />
              )}
              <View style={styles.confirmButtonsContainer}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmMedia}
                >
                  <MaterialIcons name="done" size={35} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={handleRetakeMedia}
                >
                  <MaterialIcons name="delete" size={35} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.cameraControlsContainer}>
              <TouchableOpacity
                style={styles.switchModeIcon}
                // onPress={() => {
                //   setIsPhotoMode((prev) => !prev);
                //   setIsVideoMode((prev) => !prev);
                // }}
              >
                <Ionicons
                  name={isPhotoMode ? "camera-outline" : "videocam-outline"}
                  size={35}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.captureIcon}
                onPress={handleCapture}
              >
                <View style={styles.captureBorder}>
                  <View
                    style={[
                      isPhotoMode
                        ? styles.shoot
                        : isRecording
                        ? styles.isRecording
                        : styles.record,
                    ]}
                  ></View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.switchCameraIcon}
                onPress={handleCameraType}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={35}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    width: "100%",
  },
  cameraControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  switchModeIcon: {
    padding: 10,
  },
  captureIcon: {
    padding: 10,
  },
  switchCameraIcon: {
    padding: 10,
  },
  captureBorder: {
    width: 77,
    height: 77,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 100,
    borderColor: "#fff",
    borderWidth: 1,
    // padding: 5,
  },
  shoot: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: "#fff",
  },
  record: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: "red",
  },
  isRecording: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: "red",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  previewVideo: {
    width: "100%",
    height: "100%",
  },
  confirmButtonsContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 100,
    marginRight: 30,
  },
  retakeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 100,
  },
  recordingTimer: {
    position: "absolute",
    alignSelf: "center",
    color: "#fff",
    fontSize: 15,
    bottom: 8,
  },
});

export default CameraComponent;
