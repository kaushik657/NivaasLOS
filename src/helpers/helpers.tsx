import { Alert, Linking } from "react-native";

export const openSalesforceOne = async (leadId: any): Promise<void> => {
  // const leadId = "00QC400000GA6MHMA1";
  const url = `salesforce1://sObject/${leadId}/view`;

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
