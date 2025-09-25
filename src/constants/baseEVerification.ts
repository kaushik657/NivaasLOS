// types/EVerification.ts
export interface EVerification {
  // Id: string;
  // OwnerId: string;
  // IsDeleted: boolean;
  // Name: string;
  RecordTypeId: string;
  // CreatedDate: string;
  // CreatedById: string;
  // LastModifiedDate: string;
  // LastModifiedById: string;
  // SystemModstamp: string;
  // LastActivityDate: string | null;
  // LastViewedDate: string | null;
  // LastReferencedDate: string | null;

  PAN_Full_Name__c: string | null;
  PAN_First_Name__c: string | null;
  PAN_Middle_Name__c: string | null;
  PAN_Last_Name__c: string | null;
  PAN_Father_Name__c: string | null;
  // Date_of_Birth__c: string | null;
  URL__c: string | null;
  // Is_Individual__c: boolean;

  // Sub_Status__c: string;
  // Masked_Aadhar_No__c: string | null;
  // Email__c: string | null;
  // Mobile__c: string | null;
  // Aadhar_linked__c: boolean;

  // Full_Address__c: string | null;
  // Address_Line_1__c: string | null;
  // Address_Line_2__c: string | null;
  // Street__c: string | null;
  // City__c: string | null;
  // State__c: string | null;
  // Pincode__c: string | null;
  // Country__c: string | null;

  // Description__c: string | null;
  // Mobile_IsFound__c: boolean;
  // Error_Message__c: string | null;

  // Type_Of_Holder__c: string | null;
  // Failed_Reason__c: string | null;
  // Transaction_Id__c: string | null;
  // KYC_URL__c: string | null;

  // Status__c: string;
  // Gender__c: string | null;
  // Category__c: string | null;
  // Document_Link__c: string | null;

  // CKYC_Reference_ID__c: string | null;
  // CKYC_Date__c: string | null;
  // CKYC_Updated_Date__c: string | null;

  // Request_Id__c: string | null;
  // Masked_Identity_Number__c: string | null;
  // Aadhaar_Full_Name__c: string | null;

  // Name_Match_Result__c: string | null;
  // Name_Match_Score__c: number | null;
  // Match_Percentage__c: number | null;

  // Bill_Number__c: string | null;
  // Bill_Amount__c: number | null;
  // Amount_Payable__c: number | null;
  // Total_Amount__c: number | null;

  // Consumer_Number__c: string | null;
  // Consumer_Name__c: string | null;
  // Bill_Due_Date__c: string | null;
  // Bill_Issue_Date__c: string | null;
  // Bill_Date__c: string | null;

  // Business_Date__c: string | null;
  // Penny_Date__c: string | null;
  // Verification__c: string | null;
  // Receipt_Number__c: string | null;
  // Link_Receipt__c: boolean;

  // Date_of_Registration__c: string | null;
  // Date_Of_Commencement__c: string | null;
  // Date_Of_Incorporation__c: string | null;

  // Score__c: number | null;
  // Hunter_Match__c: string | null;
  // Raw_Response__c: string | null;

  // Warning_Code__c: string | null;
  // Warning_Message__c: string | null;

  // Loan_Applicant_Type__c: string | null;
  // IsFinancial_Applicant__c: string | null;

  // Cover_Note_Creation_Date__c: string | null;
  // Cover_Note_Number__c: string | null;
  // Coverage_Type__c: string | null;
  // End_Date__c: string | null;

  // Insurance_Provider__c: string;
  // Insured__c: string | null;
  // Loss_Payee__c: string | null;
  // Policy_Number__c: string | null;
  // Premium_Amount__c: number | null;
  // Start_Date__c: string | null;
  // Sum_Insured__c: number;
  // Type_Of_Insurance__c: string | null;
}

export const baseEVerification : EVerification= {
    // "Id": "a06C100000Dxqj4IAB",
    // "OwnerId": "005C1000004O6bRIAS",
    // "IsDeleted": false,
    // "Name": "E-VER-00225",
    "RecordTypeId": "012C1000000xA1lIAE",
    // "CreatedDate": "2025-07-03T04:49:24.000+0000",
    // "CreatedById": "005C1000004O6bRIAS",
    // "LastModifiedDate": "2025-07-03T04:49:24.000+0000",
    // "LastModifiedById": "005C1000004O6bRIAS",
    // "SystemModstamp": "2025-07-03T04:49:24.000+0000",
    // "LastActivityDate": null,
    // "LastViewedDate": null,
    // "LastReferencedDate": null,
    "PAN_Full_Name__c": null,
    "PAN_First_Name__c": null,
    "PAN_Middle_Name__c": null,
    "PAN_Last_Name__c": null,
    "PAN_Father_Name__c": null,
    // "Date_of_Birth__c": null,
    "URL__c": null,
    // "Is_Individual__c": false,
    // "Sub_Status__c": "ERROR",
    // "Masked_Aadhar_No__c": null,
    // "Email__c": null,
    // "Mobile__c": null,
    // "Aadhar_linked__c": false,
    // "Full_Address__c": null,
    // "Address_Line_1__c": null,
    // "Address_Line_2__c": null,
    // "Street__c": null,
    // "City__c": null,
    // "State__c": null,
    // "Pincode__c": null,
    // "Country__c": null,
    // "Description__c": "CIBIL",
    // "Mobile_IsFound__c": false,
    // "Error_Message__c": "[{\"DESCRIPTION\":\"Date of birth is either blank or invalid format\",\"CODE\":\"E143\"},{\"DESCRIPTION\":\"Gender is not in permitted values\",\"CODE\":\"E164\"}]",
    // "Type_Of_Holder__c": null,
    // "Failed_Reason__c": null,
    // "Transaction_Id__c": null,
    // "KYC_URL__c": null,
    // "Status__c": "COMPLETED",
    // "Gender__c": null,
    // "Category__c": null,
    // "Document_Link__c": null,
    // "CKYC_Reference_ID__c": null,
    // "CKYC_Date__c": null,
    // "CKYC_Updated_Date__c": null,
    // "Request_Id__c": null,
    // "Masked_Identity_Number__c": null,
    // "Aadhaar_Full_Name__c": null,
    // "Name_Match_Result__c": null,
    // "Name_Match_Score__c": null,
    // "Match_Percentage__c": null,
    // "Bill_Number__c": null,
    // "Bill_Amount__c": null,
    // "Amount_Payable__c": null,
    // "Total_Amount__c": null,
    // "Consumer_Number__c": null,
    // "Consumer_Name__c": null,
    // "Bill_Due_Date__c": null,
    // "Bill_Issue_Date__c": null,
    // "Bill_Date__c": null,
    // "Business_Date__c": null,
    // "Penny_Date__c": null,
    // "Verification__c": null,
    // "Receipt_Number__c": null,
    // "Link_Receipt__c": false,
    // "Date_of_Registration__c": null,
    // "Date_Of_Commencement__c": null,
    // "Date_Of_Incorporation__c": null,
    // "Score__c": null,
    // "Hunter_Match__c": null,
    // "Raw_Response__c": null,
    // "Warning_Code__c": null,
    // "Warning_Message__c": null,
    // "Loan_Applicant_Type__c": null,
    // "IsFinancial_Applicant__c": null,
    // "Cover_Note_Creation_Date__c": null,
    // "Cover_Note_Number__c": null,
    // "Coverage_Type__c": null,
    // "End_Date__c": null,
    // "Insurance_Provider__c": "ICICI Life Insurance",
    // "Insured__c": null,
    // "Loss_Payee__c": null,
    // "Policy_Number__c": null,
    // "Premium_Amount__c": null,
    // "Start_Date__c": null,
    // "Sum_Insured__c": 0.0,
    // "Type_Of_Insurance__c": null
}