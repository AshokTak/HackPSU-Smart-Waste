import React from "react";

import {
  ScrollView,
  StyleSheet,
  Button,
  Text,
  Image,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";

import useStatusBar from "../hooks/useStatusBar";
import { logout } from "../components/Firebase/firebase";
import { uploadImage } from "../utils/uploadImage";
import { getImageClassification } from "../utils/getImageClassification";

export default function HomeScreen() {
  useStatusBar("dark-content");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [resultUrl, setResultUrl] = React.useState(null);
  const [result, setResult] = React.useState([]);

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
        const imageUrl = await uploadImage(result.uri, id);

        setResultUrl(imageUrl);

        const classificationResult = await getImageClassification(imageUrl);
        console.log(_modifyVisionJSON(classificationResult));

        setResult(_modifyVisionJSON(classificationResult));
      } catch (error) {
        setError(error);
      }
    }

    setLoading(false);
  }

  function _modifyVisionJSON(resultJSONObject) {
    return resultJSONObject.responses[0].labelAnnotations;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button title="Sign Out" onPress={handleSignOut} />
        <Button
          style={styles.uploadButton}
          title="Upload an Image"
          onPress={handleImageUpload}
        />

        {loading && <Text>Uploading</Text>}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {resultUrl != null && (
          <Image
            style={styles.imageStyle}
            source={{
              uri: resultUrl,
            }}
          />
        )}
        {result && <Text>{JSON.stringify(result, null, 4)}</Text>}
      </View>
    </ScrollView>
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
