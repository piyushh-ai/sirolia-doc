import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useDocument } from "../../hooks/useDocuments";
import { useTheme } from "../../hooks/useTheme";
import { createStyles } from "../../styles/createDocument.styles";

// ─── Member config ────────────────────────────────────────────────────────────
const MEMBERS = [
  { name: "Piyush", initial: "PI", colorKey: "memberPiyush" },
  { name: "Dishant", initial: "DI", colorKey: "memberDishant" },
  { name: "Sapna", initial: "SA", colorKey: "memberSapna" },
  { name: "Santosh", initial: "SS", colorKey: "memberSantosh" },
];

// ─── Progress Step Indicator ──────────────────────────────────────────────────
const ProgressSteps = ({ step, colors, styles }) => {
  const steps = ["Name", "Member", "File"];
  return (
    <View style={styles.progressContainer}>
      {steps.map((label, idx) => {
        const done = idx < step;
        const active = idx === step;
        return (
          <React.Fragment key={label}>
            {idx > 0 && (
              <View
                style={[
                  styles.progressLine,
                  (done || active) && styles.progressLineFilled,
                ]}
              />
            )}
            <View style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  active && styles.progressDotActive,
                  done && styles.progressDotDone,
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "800",
                      color: active ? "#fff" : colors.textMuted,
                    }}
                  >
                    {idx + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  active && styles.progressLabelActive,
                ]}
              >
                {label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CreateDocument = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { createDocument, getAllDocument, loading } = useDocument();

  const [documentName, setDocumentName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [file, setFile] = useState(null);

  // Animated scale for upload zone press
  const uploadScale = useRef(new Animated.Value(1)).current;

  // Compute progress step (0 = Name, 1 = Member, 2 = File)
  const progressStep = file ? 2 : memberName ? 1 : documentName.trim() ? 1 : 0;

  const pressIn = () =>
    Animated.spring(uploadScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.spring(uploadScale, { toValue: 1, useNativeDriver: true }).start();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!documentName.trim()) {
      Alert.alert("Missing Field", "Please enter a document name.");
      return;
    }
    if (!memberName) {
      Alert.alert("Missing Field", "Please select a family member.");
      return;
    }
    if (!file) {
      Alert.alert("Missing Field", "Please select an image or PDF file.");
      return;
    }

    const response = await createDocument({
      documentName: documentName.trim(),
      memberName,
      file,
    });

    if (response?.status === 201) {
      // Clear form state before navigating back
      setDocumentName("");
      setMemberName("");
      setFile(null);
      getAllDocument();
      Alert.alert("✅ Success", "Document uploaded successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert(
        "Upload Failed",
        "The document might already exist or the file is too large.",
      );
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileExtension = (name) =>
    name?.split(".").pop()?.toUpperCase() ?? "";

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>New Document</Text>
            <Text style={styles.headerSubtitle}>Upload family document</Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
        >
          {/* ── Progress ── */}
          <ProgressSteps step={progressStep} colors={colors} styles={styles} />

          {/* ── Tips Card ── */}
          <View style={styles.tipsCard}>
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.tipsText}>
              Supported formats:{" "}
              <Text style={{ fontWeight: "700" }}>PDF, JPEG, PNG</Text>. Max
              size <Text style={{ fontWeight: "700" }}>10 MB</Text>. Documents
              are stored securely.
            </Text>
          </View>

          {/* ── Card 1: Document Name ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderIcon}>
                <Ionicons
                  name="document-text"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.cardHeaderTitleBlock}>
                <Text style={styles.cardHeaderTitle}>Document Name</Text>
                <Text style={styles.cardHeaderSubtitle}>
                  Give it a recognisable name
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Aadhar Card, Marksheet…"
                  placeholderTextColor={colors.textMuted}
                  value={documentName}
                  onChangeText={setDocumentName}
                  maxLength={50}
                  autoCorrect={false}
                  autoCapitalize="words"
                  returnKeyType="done"
                  underlineColorAndroid="transparent"
                />
                <Text style={styles.charCount}>{documentName.length}/50</Text>
              </View>
            </View>
          </View>

          {/* ── Card 2: Family Member ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderIcon}>
                <Ionicons name="people" size={20} color={colors.primary} />
              </View>
              <View style={styles.cardHeaderTitleBlock}>
                <Text style={styles.cardHeaderTitle}>Family Member</Text>
                <Text style={styles.cardHeaderSubtitle}>
                  Who does this belong to?
                </Text>
              </View>
            </View>

            <View style={styles.memberGrid}>
              {MEMBERS.map((m) => {
                const isSelected = memberName === m.name;
                const avatarColor = colors[m.colorKey] ?? colors.primary;
                return (
                  <TouchableOpacity
                    key={m.name}
                    style={[
                      styles.memberChip,
                      isSelected && styles.memberChipSelected,
                    ]}
                    onPress={() => setMemberName(m.name)}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.memberAvatarCircle,
                        {
                          backgroundColor: isSelected
                            ? avatarColor
                            : `${avatarColor}40`,
                        },
                      ]}
                    >
                      <Text style={styles.memberAvatarText}>{m.initial}</Text>
                    </View>
                    <Text
                      style={[
                        styles.memberChipText,
                        isSelected && styles.memberChipTextSelected,
                      ]}
                    >
                      {m.name}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={colors.primary}
                        style={{ marginLeft: "auto" }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Card 3: File Attachment ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderIcon}>
                <Ionicons name="attach" size={20} color={colors.primary} />
              </View>
              <View style={styles.cardHeaderTitleBlock}>
                <Text style={styles.cardHeaderTitle}>File Attachment</Text>
                <Text style={styles.cardHeaderSubtitle}>PDF or image file</Text>
              </View>
            </View>

            {!file ? (
              <Animated.View style={{ transform: [{ scale: uploadScale }] }}>
                <TouchableOpacity
                  style={styles.uploadArea}
                  onPress={handlePickDocument}
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  activeOpacity={1}
                >
                  <View style={styles.uploadIconCircle}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={30}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.uploadAreaText}>Tap to Browse Files</Text>
                  <Text style={styles.uploadSubtext}>
                    Select a PDF or image from your device
                  </Text>
                  <View style={styles.uploadBadgesRow}>
                    {["PDF", "JPEG", "PNG"].map((ext) => (
                      <View key={ext} style={styles.uploadBadge}>
                        <Text style={styles.uploadBadgeText}>{ext}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View style={styles.selectedFileContainer}>
                <View style={styles.fileIconCircle}>
                  <Ionicons
                    name={
                      file.mimeType?.includes("pdf") ? "document-text" : "image"
                    }
                    size={24}
                    color={colors.success}
                  />
                </View>

                <View style={styles.fileMetadata}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <View style={styles.fileSubRow}>
                    <Text style={styles.fileSize}>
                      {formatFileSize(file.size)}
                    </Text>
                    <View style={styles.fileDot} />
                    <Text style={styles.fileType}>
                      {getFileExtension(file.name)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => setFile(null)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleUpload}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>Upload Document</Text>
              </>
            )}
          </TouchableOpacity>

          {/* ── Cancel ── */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.cancelBtnText}>Go Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateDocument;
