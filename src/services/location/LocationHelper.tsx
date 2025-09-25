// src/services/location/LocationHelper.tsx
import {PermissionsAndroid, Platform} from 'react-native';
import Geocoder from 'react-native-geocoding';

// Initialize Google Geocoding API
// const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
Geocoder.init('GOOGLE_MAPS_API_KEY'); 

// Ask for location permission
export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS automatically asks for permission
};

// Convert latitude & longitude to address
export const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
  try {
    const response = await Geocoder.from(latitude, longitude);
    return response.results[0].formatted_address;
  } catch (error) {
    console.error('Geocoding Error:', error);
    return null;
  }
};
