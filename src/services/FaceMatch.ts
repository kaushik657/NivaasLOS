import RNFS from "react-native-fs";
import axios from "axios";
import mime from "mime"; // npm install mime

const FACE_MATCH_URL =
  "https://api-preproduction.signzy.app/api/v3/studio/68679f5ec22d2fb9419a73b8/face-match";
const AUTH_KEY = "e4IBYeRtGH9urB9rDEyNL4TVP5c06qSd";

// Helper to detect if string is already a data URI
const isBase64Image = (input: string) =>
  typeof input === "string" &&
  input.startsWith("data:image/") &&
  input.includes("base64,");

// Convert input (file path | base64 string | picker object) → data URI
const convertToDataUri = async (input: any) => {
  if (!input) throw new Error("Invalid image input");

  // Case 1: Already base64 string
  if (typeof input === "string" && isBase64Image(input)) {
    return input;
  }

  // Case 2: Object with uri + type (React Native Image Picker style)
  if (typeof input === "object" && input.uri) {
    const mimeType = input.type || mime.getType(input.uri) || "image/jpeg";
    const base64Data = await RNFS.readFile(input.uri, "base64");
    return `data:${mimeType};base64,${base64Data}`;
  }

  // Case 3: Plain file path string
  if (typeof input === "string") {
    const mimeType = mime.getType(input) || "image/jpeg";
    const base64Data = await RNFS.readFile(input, "base64");
    return `data:${mimeType};base64,${base64Data}`;
  }

  throw new Error("Unsupported input type for image");
};

export const faceMatch = async (
  firstImage: string | any,
  secondImage: string | any
) => {
  try {
    const first = await convertToDataUri(firstImage);
    const second = await convertToDataUri(secondImage);

    const payload = {
      firstImage: first,
      secondImage: second,
      threshold: 0.05,
    };

    const response = await axios.post(FACE_MATCH_URL, payload, {
      headers: {
        Authorization: AUTH_KEY,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Face match error:", error.response?.data || error.message);
    throw error;
  }
};
