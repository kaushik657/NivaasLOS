import * as Keychain from "react-native-keychain";
// use a unique identifier

// Save auth token
export const saveAuthToken = async (token: string) => {
  try {
    await Keychain.setGenericPassword("auth", token);
    console.log("Auth token saved successfully");
  } catch (error) {
    console.error("Error saving auth token:", error);
  }
};

// Get auth token
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};
