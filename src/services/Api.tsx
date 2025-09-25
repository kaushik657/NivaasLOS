import axios from "axios";
import GlobalConfig from "../utils/Configs";
import { buildEVerificationPayload } from "../helpers/DeepMerge";
import { getAuthToken } from "./Keychain";

console.log(GlobalConfig);

const BASE_URL = GlobalConfig.instanceUrl;

// Example function to send POST request
export const EVerification = async () => {
  // API endpoint
  const API_URL = BASE_URL + "/services/data/v64.0/sobjects/E_Verification__c";

  try {
    const token = await getAuthToken();
    console.log("token", token);
    if (!token) {
      throw new Error("No auth token found in Keychain");
    }
    // console.log("GlobalConfig.instanceUrl", GlobalConfig.instanceUrl);

    const payload = buildEVerificationPayload({});

    console.log("apiiii urll", API_URL);

    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    //console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error calling API:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchApplications = async () => {
  try {
    const token = await getAuthToken();
    console.log("token", token);
    if (!token) {
      throw new Error("No auth token found in Keychain");
    }

    const url = `${GlobalConfig.instanceUrl}/services/data/v64.0/query/?q=SELECT+Id,Name+FROM+Application__c+LIMIT+1`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Your Salesforce OAuth token
        "Content-Type": "application/json",
      },
    });

    // console.log("Salesforce Query Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetApplicationDetails = async (id: any) => {
  // API endpoint
  const API_URL = `${GlobalConfig.instanceUrl}/services/data/v64.0/sobjects/Application__c/${id}`;

  try {
    const token = await getAuthToken();
    console.log("token", token);
    if (!token) {
      throw new Error("No auth token found in Keychain");
    }

    const payload = buildEVerificationPayload({});

    console.log("apiiii urll", API_URL);

    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    //console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error calling API:", error.response?.data || error.message);
    throw error;
  }
};
