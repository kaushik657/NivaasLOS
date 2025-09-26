import React, { useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { moderateScale, verticalScale, scale } from "react-native-size-matters";
import CustomDropdown from "../components/CustomDropdown";
import ApplicationsDetailsContainer from "../components/ApplicationsDetailsContainer";
import { Colors } from "../constants/colors";
import DocumentTable from "../components/DocumentTable";
import { ScreenNames } from "../navigation/AppNavigator";
import {
  EVerification,
  GetApplicationDetails,
  fetchApplications,
} from "../services/Api";
import { getData, storeData } from "../services/AsyncStorage";

interface Props {
  navigation: any;
}

const DashboardScreen = ({ navigation }: Props) => {
  useEffect(() => {
    async function apicall() {
      const result = await EVerification();
      console.log("resulttttt", result);

      const apiresponse = await fetchApplications();
      console.log("responsee", apiresponse);

      if (apiresponse) {
        console.log("application iddd", apiresponse.records[0].Id);
      }

      await storeData("applicationId", apiresponse.records[0].Id);
      const idWeGot = await getData("applicationId");

      console.log(idWeGot, "id we got");

      const response = await GetApplicationDetails(idWeGot);
      console.log("get application detail", response);
    }
    apicall();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={globalStyles.container}
    >
      {/* Card Wrapper */}

      <ApplicationsDetailsContainer
        applicationId="SHF/Shubh Vikas-LAP/001"
        loanProduct="Shubh Vikas-LAP"
        loanAmount="INR 270,000.00"
        loanTenure={25}
        applicationOwner="Shubh Mathur"
      />

      <View style={globalStyles.card}>
        {/* Dropdowns Inside the Card */}
        <CustomDropdown disabled={true} title="Applicant Details">
          <Text>Name: Hemant Sharma</Text>
          <Text>Email: hemant@example.com</Text>
          <Text>Phone: +91 9876543210</Text>
        </CustomDropdown>

        <CustomDropdown disabled={true} title="Collateral Details">
          <Text>Type: Property</Text>
          <Text>Value: ₹50,00,000</Text>
        </CustomDropdown>

        <CustomDropdown disabled={true} title="PD">
          <Text>PD Score: 780</Text>
          <Text>Status: Approved</Text>
        </CustomDropdown>

        {/* ---- E-Verification Section ---- */}
        <CustomDropdown title="E-Verification">
          <View style={styles.eVerificationContainer}>
            {/* Option 1 */}
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNames.FACE_LIVENESS)}
              style={styles.eVerificationButton}
            >
              <Text style={styles.eVerificationButtonText}>Liveliness</Text>
            </TouchableOpacity>

            {/* Option 2 */}
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNames.FACE_MATCH)}
              style={styles.eVerificationButton}
            >
              <Text style={styles.eVerificationButtonText}>Face match</Text>
            </TouchableOpacity>

            {/* Option 3 */}
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNames.DOC_UPLOAAD)}
              style={styles.eVerificationButton}
            >
              <Text style={styles.eVerificationButtonText}>Geo tagging</Text>
            </TouchableOpacity>
          </View>
        </CustomDropdown>

        <CustomDropdown title="Document Checklist">
          <DocumentTable />
        </CustomDropdown>

        <CustomDropdown disabled={true} title="Application Form Generation">
          <Text>Click Generate to create the application form.</Text>
        </CustomDropdown>
        <TouchableOpacity
          onPress={() => navigation.navigate(ScreenNames.ROUTE_PLAN)}
          style={[
            styles.eVerificationButton,
            { alignSelf: "center", marginBottom: verticalScale(10) },
          ]}
        >
          <Text style={styles.eVerificationButtonText}>Route Plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const FONT_SIZES = {
  small: moderateScale(11),
  medium: moderateScale(14),
  large: moderateScale(20),
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(16),
  },
  text: {
    fontSize: FONT_SIZES.medium,
    color: Colors.BLACK,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: "600",
    color: Colors.BLACK,
    marginBottom: verticalScale(8),
  },
  card: {
    backgroundColor: Colors.WHITE,
    marginVertical: verticalScale(5),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: Colors.BORDER_GRAY,
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(10),
  },
});

/* ---- Local Styles for E-Verification Section ---- */
const styles = StyleSheet.create({
  eVerificationContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    gap: verticalScale(10), // spacing between buttons
  },
  eVerificationButton: {
    width: "80%",
    paddingVertical: verticalScale(8),
    backgroundColor: Colors.PRIMARY,
    borderRadius: moderateScale(5),
    alignItems: "center",
    justifyContent: "center",

    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(3),

    // Shadows for Android
    elevation: 2,
  },
  eVerificationButtonText: {
    fontFamily: "Montserrat-Regular",
    color: Colors.WHITE,
    fontSize: FONT_SIZES.medium,
    fontWeight: "400",
  },
});
