import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
  CameraViewRef,
  CameraProps,
  CameraPictureOptions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useRef, useState, createRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const camera = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState<string | null>();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function takePicture() {
    console.log("takePicture");
    camera.current?.takePictureAsync()
    .then((data) => {
        setPhoto(data?.uri)
        console.log("Picture taken: ", data?.uri);

        if (data?.uri) {
          console.log('photo is a string', photo);
          // Save the photo to the device's photo library
          MediaLibrary.saveToLibraryAsync(data?.uri)
          .then(() => console.log("Photo saved to library"))
          .catch((error) => console.error("Error saving photo to library: ", error));
      }
      })


}

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={camera} onCameraReady={() => {
        console.log("Camera is ready");
        setIsCameraReady(true);
      }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take pic</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
