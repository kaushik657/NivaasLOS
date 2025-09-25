import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Linking,
} from "react-native";
import { pick } from "@react-native-documents/picker";
import { Colors } from "../constants/colors";
import Icon from "react-native-vector-icons/Feather";
import { moderateScale, verticalScale, scale } from "react-native-size-matters";
import RNFS from "react-native-fs";
import { faceExtraction } from "../services/FaceExtraction";
import Loader from "./Loader";
import { showErrorToast } from "../utils/ToastUtils";
interface DocumentItem {
  id: number;
  category: string;
  type: string;
  name: string;
  fileName: string | null;
  fileUri: string | null;
}

const DocumentTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      category: "KYC Documents",
      type: "Identity Proof",
      name: "Aadhar Card",
      fileName: null,
      fileUri: null,
    },
    {
      id: 2,
      category: "KYC Documents",
      type: "Identity Proof",
      name: "PAN Card",
      fileName: null,
      fileUri: null,
    },
  ]);

  /** Handle document upload */
  const handleUpload = async (index: number) => {
    try {
      const result = await pick({
        type: ["image/*"],
        allowMultiSelection: false,
      });

      if (!result || result.length === 0) {
        console.log("User cancelled document picker");
        return;
      }

      setLoading(true);
      const selectedFile = result[0];
      let filePath = selectedFile.uri;

      if (filePath.startsWith("content://")) {
        const destPath = `${RNFS.TemporaryDirectoryPath}/${selectedFile.name}`;
        await RNFS.copyFile(selectedFile.uri, destPath);
        filePath = destPath;
      }

      const base64Data = await RNFS.readFile(filePath, "base64");
      const mimeType = selectedFile.type || "image/png";
      const base64Uri = `data:${mimeType};base64,${base64Data}`;

      const resp = await faceExtraction({ url: base64Uri });
      if (resp.faceUrl === "No face detected") {
        // alert("No face detected in the image. Please select another image.");
        showErrorToast(
          "No face detected",
          "No face detected in the image. Please select another image."
        );
        setLoading(false);
        return;
      }
      // setPreviewUri(resp.faceUrl);

      setDocuments((prevDocs) =>
        prevDocs.map((doc, i) =>
          i === index
            ? {
                ...doc,
                fileName: selectedFile.name || "Unnamed File",
                fileUri: resp.faceUrl,
              }
            : doc
        )
      );
    } catch (err: any) {
      if (!err.isCancel) console.error("Document Picker Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** Upload Button Component */
  const UploadButton = ({
    onPress,
    isUploaded,
  }: {
    onPress: () => void;
    isUploaded: boolean;
  }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon
        name="upload"
        size={moderateScale(18)}
        color={isUploaded ? Colors.SUCCESS_GREEN : Colors.PRIMARY}
      />
      <Text
        style={[
          styles.buttonText,
          { color: isUploaded ? Colors.SUCCESS_GREEN : Colors.PRIMARY },
        ]}
      >
        {isUploaded ? "Uploaded" : "Upload"}
      </Text>
    </TouchableOpacity>
  );

  /** Preview Button Component */
  const PreviewButton = ({ uri }: { uri: string | null }) => {
    const isImage = uri?.startsWith("data:image");

    return (
      <TouchableOpacity
        style={[styles.button, { opacity: uri ? 1 : 0.5 }]}
        disabled={!uri}
        onPress={() => {
          if (!uri) return;

          if (isImage) {
            setPreviewUri(uri);
            setOpenModal(true);
          } else {
            Linking.openURL(uri).catch(() =>
              alert("Preview not supported for this file type")
            );
          }
        }}
      >
        <Icon
          name="eye"
          size={moderateScale(18)}
          color={uri ? Colors.PRIMARY : Colors.BORDER_GRAY}
        />
        <Text
          style={[
            styles.buttonText,
            { color: uri ? Colors.PRIMARY : Colors.BORDER_GRAY },
          ]}
        >
          Preview
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />

      {/* Preview Modal */}
      <Modal visible={openModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setOpenModal(false)}
          >
            <Icon name="x" size={24} color={Colors.WHITE} />
          </TouchableOpacity>
          {previewUri && (
            <Image source={{ uri: previewUri }} style={styles.previewImage} />
          )}
        </View>
      </Modal>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text
              style={[styles.cell, styles.headerCell, { width: scale(60) }]}
            >
              S. No.
            </Text>
            <Text
              style={[styles.cell, styles.headerCell, { width: scale(150) }]}
            >
              Category
            </Text>
            <Text
              style={[styles.cell, styles.headerCell, { width: scale(150) }]}
            >
              Type
            </Text>
            <Text
              style={[styles.cell, styles.headerCell, { width: scale(150) }]}
            >
              Name
            </Text>
            <Text
              style={[styles.cell, styles.headerCell, { width: scale(150) }]}
            >
              Upload
            </Text>
            <Text
              style={[styles.cell, styles.headerCell, { width: scale(150) }]}
            >
              Preview
            </Text>
          </View>

          {/* Table Rows */}

          {documents.map((doc, index) => (
            <View key={doc.id} style={styles.row}>
              <Text style={[styles.cell, { width: scale(60) }]}>
                {index + 1}
              </Text>
              <Text style={[styles.cell, { width: scale(150) }]}>
                {doc.category}
              </Text>
              <Text style={[styles.cell, { width: scale(150) }]}>
                {doc.type}
              </Text>
              <Text style={[styles.cell, { width: scale(150) }]}>
                {doc.name}
              </Text>
              <View style={[styles.cell, { width: scale(150) }]}>
                <UploadButton
                  onPress={() => handleUpload(index)}
                  isUploaded={!!doc.fileUri}
                />
              </View>
              <View style={[styles.cell, { width: scale(150) }]}>
                <PreviewButton uri={doc.fileUri} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(8),
    backgroundColor: Colors.WHITE,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: Colors.BORDER_GRAY,
    alignItems: "center",
  },
  headerRow: {
    backgroundColor: Colors.LIGHT_GRAY,
  },
  cell: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(8),
    textAlign: "center",
    color: Colors.BLACK,
  },
  headerCell: {
    fontWeight: "bold",
  },
  button: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.BORDER_GRAY,
    borderRadius: moderateScale(4),
    paddingVertical: verticalScale(4),
    paddingHorizontal: moderateScale(8),
    justifyContent: "center",
  },
  buttonText: {
    fontSize: moderateScale(12),
    fontWeight: "500",
    marginLeft: moderateScale(6),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 8,
  },
  previewImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
});

export default DocumentTable;
