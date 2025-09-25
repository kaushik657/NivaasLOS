import axios from "axios";
import RNFS from "react-native-fs";

const BASE_URL = "https://www.truthscreen.com";
//const USERNAME = "production@shubham.co";
const USERNAME = "test@shubham.co";
const COOKIE = "AWSALBTG=QczihKUjwwEVtf8mcCITsMlcvL4UAvuvBeJ0itwJDh4tc+7xvQXzq69yo92F2LIuo1OSl3vUQmJTltGagKA52j0sDFwhKwiUy197Vj0YjIw99FYNejWBnIb2m03TkFyArP7wurC9fML7Qj7G0oxc8A+jKn1AfxaXjGdKvZX0i2Xvyv8IUKY=; AWSALBTGCORS=QczihKUjwwEVtf8mcCITsMlcvL4UAvuvBeJ0itwJDh4tc+7xvQXzq69yo92F2LIuo1OSl3vUQmJTltGagKA52j0sDFwhKwiUy197Vj0YjIw99FYNejWBnIb2m03TkFyArP7wurC9fML7Qj7G0oxc8A+jKn1AfxaXjGdKvZX0i2Xvyv8IUKY=";

export async function runLivenessCheck(finalPhotoPath: string) {
  try {
    // Step 1: Get Secret Token
    const formDataForEncryption = new FormData();
    formDataForEncryption.append ("transID", "1235");
    formDataForEncryption.append("docType", "366");
    const tokenResp = await axios.post(
      `${BASE_URL}/v1/apicall/others/liveness/token`,
      formDataForEncryption,
      {
        headers: {
          username: USERNAME,
          "Content-Type": "multipart/form-data",
         // "Content-Type": "application/json",
          Cookie: COOKIE,
        },
      }
    );
    
    const encryptedData = tokenResp.data.responseData;

    // Step 2: Decrypt Token
    const decryptResp = await axios.post(
      `${BASE_URL}/v1/apicall/decrypt`,
      { responseData: encryptedData },
      {
        headers: {
          username: USERNAME,
          "Content-Type": "application/json",
          Cookie: COOKIE,
        },
      }
    );

    const { secretToken, tsTransID } = decryptResp.data.msg;
    
    // Step 3: Upload only final photo
    const base64Data = await RNFS.readFile(finalPhotoPath, "base64");
     console.log("Base64 Data Length:", decryptResp.data);
    const formData = new FormData();
    formData.append("tsTransID", tsTransID);
    formData.append("secretToken", secretToken);
    formData.append("docType", "366");
    formData.append("file", `${base64Data}`);
    //console.log("Form Data:", formData);
    const uploadResp = await axios.post(
      `${BASE_URL}/v1/apicall/others/liveness/request`,
      formData,
      {
        headers: {
          username: USERNAME,
          "Content-Type": "multipart/form-data",
          Cookie: COOKIE,
        },
      }
    );

    const fileEncryptedData  = uploadResp.data.responseData;
    console.log("Liveness Check Encrypted Response:", fileEncryptedData);
    const decryptResponse =  await axios.post(
        `${BASE_URL}/v1/apicall/decrypt`,
        { responseData: fileEncryptedData },
        {
          headers: {
            username: USERNAME,
            "Content-Type": "application/json",
            Cookie: COOKIE,
          },
        }
      );
      return decryptResponse.data;
  } catch (error) {
    console.error("Liveness Check Error", error);
    throw error;
  }
}
