import { Alert, Linking } from "react-native";
import { oauth } from "react-native-force";
import { clearAuthToken } from "../services/Keychain";

export const openSalesforceOne = async (leadId: any): Promise<void> => {
  // const leadId = "00QC400000GA6MHMA1";
  const url = `salesforce1://sObject/${leadId}/view`;
// 00QC100000FhybOMAR
//  const url = `salesforce1://sObject/00QC100000FhybOMAR/view`;
 console.log("lead id",url);
 
  try {
    // On Android, canOpenURL will now work correctly
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Salesforce One is not installed",
        "Please install Salesforce One from Play Store / App Store."
      );
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Could not open Salesforce One");
  }
};

export const openSalesforce = async (leadId: any): Promise<void> => {
  // const leadId = "00QC400000GA6MHMA1";
  const url = `salesforce1://`;

  try {
    // On Android, canOpenURL will now work correctly
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Salesforce One is not installed",
        "Please install Salesforce One from Play Store / App Store."
      );
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Could not open Salesforce One");
  }
};

export const handleSalesforceLogout =  async () => {
  oauth.logout(
   async () => {
      clearAuthToken()
      console.log('Logged out from Salesforce successfully');
      // Optionally navigate to your login screen
    },
    (error) => {
      console.error('Salesforce logout failed', error);
    }
  );
};