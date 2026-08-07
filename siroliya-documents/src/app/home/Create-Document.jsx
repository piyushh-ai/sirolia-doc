import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { useDocument } from "../../hooks/useDocuments";
import { Typography } from "../../constants/fonts";

const MEMBERS = ["Piyush", "Dishant", "Sapna", "Santosh"];

const CreateDocument = () => {
  const { createDocument, getAllDocument, loading } = useDocument();
  
  const [documentName, setDocumentName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [file, setFile] = useState(null);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!documentName.trim()) {
      Alert.alert("Validation Error", "Please enter a document name.");
      return;
    }
    if (!memberName) {
      Alert.alert("Validation Error", "Please select a family member.");
      return;
    }
    if (!file) {
      Alert.alert("Validation Error", "Please select an image or PDF file to upload.");
      return;
    }

    const response = await createDocument({
      documentName: documentName.trim(),
      memberName,
      file,
    });

    if (response && response.status === 201) {
      Alert.alert("Success", "Document uploaded successfully!");
      getAllDocument(); // Refresh document list
      router.back();
    } else {
      Alert.alert(
        "Upload Failed",
        "Failed to upload document. The document might already exist or the file size is too large."
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>Upload New Document</Text>
        <Text style={styles.subtitle}>Upload your family documents securely to the cloud.</Text>

        {/* Document Name Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Document Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Aadhar Card, Marksheet"
            placeholderTextColor="#94a3b8"
            value={documentName}
            onChangeText={setDocumentName}
            maxLength={50}
          />
        </View>

        {/* Member Selector Grid */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Family Member</Text>
          <View style={styles.memberGrid}>
            {MEMBERS.map((member) => {
              const isSelected = memberName === member;
              return (
                <TouchableOpacity
                  key={member}
                  style={[
                    styles.memberChip,
                    isSelected && styles.memberChipSelected,
                  ]}
                  onPress={() => setMemberName(member)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.memberChipText,
                      isSelected && styles.memberChipTextSelected,
                    ]}
                  >
                    {member}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* File Picker */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>File Attachment (PDF or Image)</Text>
          {!file ? (
            <TouchableOpacity
              style={styles.uploadArea}
              onPress={handlePickDocument}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadIcon}>📁</Text>
              <Text style={styles.uploadAreaText}>Click to select PDF or Image</Text>
              <Text style={styles.uploadSubtext}>Supports PDF, JPEG, PNG</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.selectedFileContainer}>
              <View style={styles.fileDetails}>
                <Text style={styles.fileIcon}>
                  {file.mimeType && file.mimeType.includes("pdf") ? "📄" : "🖼️"}
                </Text>
                <View style={styles.fileMetadata}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => setFile(null)}
                activeOpacity={0.6}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleUpload}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Upload Document</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    ...Typography.h2,
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    ...Typography.body,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    ...Typography.label,
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Typography.input,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  memberChip: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    minWidth: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  memberChipSelected: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  memberChipText: {
    ...Typography.body,
    fontWeight: "600",
    color: "#475569",
  },
  memberChipTextSelected: {
    color: "#ffffff",
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadAreaText: {
    ...Typography.button,
    color: "#475569",
    marginBottom: 4,
  },
  uploadSubtext: {
    ...Typography.caption,
    color: "#94a3b8",
  },
  selectedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 16,
    padding: 16,
  },
  fileDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  fileMetadata: {
    flex: 1,
  },
  fileName: {
    ...Typography.body,
    fontWeight: "600",
    color: "#166534",
  },
  fileSize: {
    ...Typography.caption,
    color: "#15803d",
    marginTop: 2,
  },
  removeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
  },
  removeBtnText: {
    ...Typography.caption,
    fontWeight: "600",
    color: "#991b1b",
  },
  submitBtn: {
    backgroundColor: "#4f46e5",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  submitBtnDisabled: {
    backgroundColor: "#a5b4fc",
  },
  submitBtnText: {
    ...Typography.button,
    color: "#ffffff",
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  cancelBtnText: {
    ...Typography.button,
    color: "#64748b",
  },
});

export default CreateDocument;