import React from "react";

import * as firebase from "firebase";
import { View, StyleSheet, Button, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";

import useStatusBar from "../hooks/useStatusBar";
import { logout } from "../components/Firebase/firebase";
import { uploadImage } from "../utils/uploadImage";

export default function HomeScreen() {
  useStatusBar("dark-content");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [resultUri, setResultUri] = React.useState(null);

  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleImageUpload() {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      try {
        setLoading(true);

        const id = uuidv4();
        await uploadImage(result.uri, id);

        const imageUrl = await firebase
          .storage()
          .ref()
          .child(`images/${id}`)
          .getDownloadURL();

        console.log(imageUrl);

        setResultUri(imageUrl);
      } catch (error) {
        setError(error);
      }
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button
        style={styles.uploadButton}
        title="Upload an Image"
        onPress={handleImageUpload}
      />

      {loading && <Text>Uploading</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {resultUri != null && (
        <Image
          style={styles.imageStyle}
          source={{
            uri: resultUri,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  uploadButton: {
    marginVertical: 16,
  },
  imageStyle: {
    marginVertical: 16,
    height: 400,
    width: 300,
  },
});
