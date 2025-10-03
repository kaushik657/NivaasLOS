import axios from "axios";
import GlobalConfig from "../utils/Configs";
import { buildEVerificationPayload } from "../helpers/DeepMerge";
import { getAuthToken } from "./Keychain";

type LatLng = {
  latitude: number;
  longitude: number;
};
console.log(GlobalConfig);

const API_KEY = "AIzaSyC1-MUz0bX_Bp_CXU97mm4Nmyf-Hj95rYw"; // Replace with your actual Google Maps API key

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

export const fetchTodayLeads = async () => {
  try {
    const soql =
      "SELECT Id, Name, Company, Status, CreatedDate,Location__c FROM Lead WHERE CreatedDate = TODAY";
    const url = `${
      GlobalConfig.instanceUrl
    }/services/data/v60.0/query?q=${encodeURIComponent(soql)}`;

    const token = await getAuthToken();
    console.log("token", token);
    if (!token) {
      throw new Error("No auth token found in Keychain");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // access token from OAuth
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching leads: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Today's Leads:", data.records);
    return data.records;
  } catch (error) {
    console.error("Fetch today leads error:", error);
    return [];
  }
};

async function getDistanceAndTime(currentLocation: LatLng, meetings: any[]) {
  if (!currentLocation || meetings.length === 0) return null;

  const destinations = meetings
    .map((m) => `${m.latitude},${m.longitude}`)
    .join("|");

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${currentLocation.latitude},${currentLocation.longitude}&destinations=${destinations}&mode=driving&key=${API_KEY}`;

  const response = await axios.get(url);
  const data = response.data;

  if (data.status === "OK") {
    // sum up all legs
    let totalDistance = 0;
    let totalDuration = 0;

    data.rows[0].elements.forEach((el: any) => {
      if (el.status === "OK") {
        totalDistance += el.distance.value; // in meters
        totalDuration += el.duration.value; // in seconds
      }
    });

    return {
      distance: (totalDistance / 1000).toFixed(1) + " km",
      duration:
        Math.floor(totalDuration / 3600) +
        " hr " +
        Math.floor((totalDuration % 3600) / 60) +
        " min",
    };
  }

  return null;
}
