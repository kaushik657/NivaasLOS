import axios from "axios";
import GlobalConfig from "../utils/Configs";
import { getAuthToken } from "./Keychain";

const BASE_URL = GlobalConfig.instanceUrl;
const API_URL = BASE_URL + "/services/data/v64.0/sobjects/E_Verification__c";

export const SendLivnessResponseToSf = async () => {
  try {
    const token = await getAuthToken();
    console.log("token", token);
    if (!token) {
      throw new Error("No auth token found in Keychain");
    }

    const payload = {
      Raw_Response__c: "",
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error calling API:", error.response?.data || error.message);
    throw error;
  }
};

export const SendTransIdToSf = async () => {
  try {
    const token = await getAuthToken();
    console.log("token", token);
    if (!token) {
      throw new Error("No auth token found in Keychain");
    }

    const payload = {
      secretToken: "",
      Transaction_Id__c: "",
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error calling API:", error.response?.data || error.message);
    throw error;
  }
};

export const SendDescToSf = async () => {
  try {
    const token = await getAuthToken();
    console.log("token", token);
    if (!token) {
      throw new Error("No auth token found in Keychain");
    }

    const payload = {
      Description__c: "",
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error calling API:", error.response?.data || error.message);
    throw error;
  }
};

export const SendFaceMatchDataToSf = async (data: any) => {
  try {
    const token = await getAuthToken();
    console.log("token", token);
    if (!token) {
      throw new Error("No auth token found in Keychain");
    }

    const payload = {
      Status__c: data.result.verified,
      Match_Percentage__c: data.result.matchPercentage,
      Description__c: data.result.message,
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error calling API:", error.response?.data || error.message);
    throw error;
  }
};
