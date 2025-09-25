import axios from "axios";

const BASE_URL = "https://api-preproduction.signzy.app/api/v3/studio";
const Authorization = "e4IBYeRtGH9urB9rDEyNL4TVP5c06qSd";
const COOKIE = "CAKEPHP=o7mk83gd17liht3li2uamlfgm5";

export async function faceExtraction(body:any) {
  try {
    // Step 1: Get Secret Token
    const tokenResp = await axios.post(
      `${BASE_URL}/68665bd3ace0f577197bde7a/face-extraction`,
      body,
      {
        headers: {
          Authorization: Authorization,
          "Content-Type": "application/json",
        },
      }
    );
   // console.log("Face Extraction Response:", tokenResp.data);
    return tokenResp.data;
   // const encryptedData = tokenResp.data.responseData;


  } catch (error) {
    console.error("Face extraction Error", error);
    throw error;
  }
}
export async function aadharMasking(body:any) {
    try {
      // Step 1: Get Secret Token
      const tokenResp = await axios.post(
        `${BASE_URL}/6867c6641a891c2569fa32fd/id-masking-api`,
        body,
        {
          headers: {
            Authorization: Authorization,
            "Content-Type": "application/json",
          },
        }
      );
     // console.log("Face Extraction Response:", tokenResp.data);
      return tokenResp.data;
     // const encryptedData = tokenResp.data.responseData;
  
  
    } catch (error) {
      console.error("Aadhar masking Error", error);
      throw error;
    }
  }
