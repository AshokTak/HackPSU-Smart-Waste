import { gcpKey } from "../components/Firebase/firebaseConfig";

export const getImageClassification = async (imageUrl) => {
  const body = JSON.stringify({
    requests: [
      {
        features: [{ type: "LABEL_DETECTION", maxResults: 3 }],
        image: {
          source: {
            imageUri: imageUrl,
          },
        },
      },
    ],
  });

  const response = await fetch(
    "https://vision.googleapis.com/v1/images:annotate?key=" + gcpKey,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: body,
    }
  );

  return await response.json();
};
