// src/services/location/LocationHelper.tsx
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import Geocoder from "react-native-geocoding";

// Initialize Google Geocoding API
Geocoder.init("GOOGLE_MAPS_API_KEY"); // Replace with env variable in production

// Request location permission
export const requestLocationPermission = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app needs access to your location.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS automatically asks
};

// Get current location
export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error("Location error:", error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  });
};

// Reverse geocoding: lat/lng → address
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await Geocoder.from(latitude, longitude);
    return response.results[0].formatted_address;
  } catch (error) {
    console.error("Geocoding Error:", error);
    return null;
  }
};
