import * as firebase from "firebase";

export const uploadImage = async (uri, imageName) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const ref = firebase.storage().ref().child(`images/${imageName}`);
  await ref.put(blob);

  blob.close();

  return await ref.getDownloadURL();
};
