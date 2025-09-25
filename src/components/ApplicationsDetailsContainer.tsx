import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Colors } from "../constants/colors";
import Stepper from "./Stepper";

interface ContainerProps {
  applicationId: string;
  loanProduct: string;
  loanAmount: string;
  loanTenure: number;
  applicationOwner: string;
}

const ApplicationsDetailsContainer: React.FC<ContainerProps> = ({
  applicationId,
  loanProduct,
  loanAmount,
  loanTenure,
  applicationOwner,
}) => {
  return (
    <View style={styles.container}>
      {/* Gray header background */}
      <View style={styles.headerContainer} />

      {/* Actual header content */}
      <View style={styles.headerContent}>
        <View style={styles.icon}>
          <Image
            source={require("../assets/crown.png")}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.headerTitle}>Application</Text>
          <Text style={styles.headerSubtitle}>{applicationId}</Text>
        </View>
      </View>

      {/* Loan details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailsColumn}>
          <Text style={styles.label}>Loan Product</Text>
          <Text style={styles.value}>{loanProduct}</Text>
        </View>
        <View style={styles.detailsColumn}>
          <Text style={styles.label}>Loan amount Requested</Text>
          <Text style={styles.value}>{loanAmount}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailsColumn}>
          <Text style={styles.label}>Loan Tenure (months)</Text>
          <Text style={styles.value}>{loanTenure}</Text>
        </View>
        <View style={styles.detailsColumn}>
          <Text style={styles.label}>Application Owner</Text>
          <Text
            style={[styles.value, { color: Colors.PRIMARY, fontWeight: "400" }]}
          >
            {applicationOwner}
          </Text>
        </View>
      </View>
      <Stepper />
      {/* <View style={styles.pathContainer}>
        <Image
          source={require("../assets/path.png")}
          style={styles.pathImage}
          resizeMode="contain"
        />
      </View> */}
      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Mark Loan Stage as Complete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ApplicationsDetailsContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: Colors.BACKGROUND_LIGHT,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: moderateScale(4),
    elevation: 2,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(70), // Adjust to cover icon + title + some extra space
    backgroundColor: Colors.LIGHT_GRAY,
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),
    zIndex: 0, // Ensures background stays behind content
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
    zIndex: 1, // Content appears above gray background
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(8),
    backgroundColor: Colors.CROWN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(10),
  },
  iconImage: {
    width: moderateScale(34),
    height: moderateScale(34),
  },
  headerTitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(14),
    color: Colors.TEXT_GRAY,
  },
  headerSubtitle: {
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: Colors.BLACK,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: verticalScale(4),
  },
  detailsColumn: {
    flex: 1,
  },
  label: {
    fontFamily: "Montserrat-Medium",
    fontSize: moderateScale(11),
    color: Colors.TEXT_GRAY,
  },
  value: {
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(12),
    fontWeight: "500",
    color: Colors.BLACK,
  },
  pathContainer: {
    width: "100%", // Full width of the parent
    alignItems: "center", // Center content if neede
  },

  pathImage: {
    width: "100%", // Fully responsive width
    height: verticalScale(50), // Fixed responsive height
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(6),
    alignItems: "center",
    //marginTop: verticalScale(10),
  },
  buttonText: {
    fontFamily: "Montserrat-Regular",
    color: Colors.WHITE,
    fontWeight: "600",
    fontSize: moderateScale(11),
  },
});
