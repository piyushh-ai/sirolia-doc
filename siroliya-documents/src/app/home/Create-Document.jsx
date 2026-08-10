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
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useDocument } from "../../hooks/useDocuments";
import { useTheme } from "../../hooks/useTheme";
import { createStyles } from "../../styles/createDocument.styles";

const { width: SW } = Dimensions.get("window");
const MAX_IMAGES = 5;

// ─── Member config ────────────────────────────────────────────────────────────
const MEMBERS = [
  { name: "Piyush",  initial: "PI", colorKey: "memberPiyush"  },
  { name: "Dishant", initial: "DI", colorKey: "memberDishant" },
  { name: "Sapna",   initial: "SA", colorKey: "memberSapna"   },
  { name: "Santosh", initial: "SS", colorKey: "memberSantosh" },
];

// ─── Progress Step Indicator ──────────────────────────────────────────────────
const ProgressSteps = ({ step, colors, styles }) => {
  const steps = ["Name", "Member", "File"];
  return (
    <View style={styles.progressContainer}>
      {steps.map((label, idx) => {
        const done   = idx < step;
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
                  done   && styles.progressDotDone,
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : (
                  <Text style={{ fontSize: 11, fontWeight: "800", color: active ? "#fff" : colors.textMuted }}>
                    {idx + 1}
                  </Text>
                )}
              </View>
              <Text style={[styles.progressLabel, active && styles.progressLabelActive]}>
                {label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

// ─── Image Preview Thumbnail ──────────────────────────────────────────────────
const ImageThumb = ({ file, index, onRemove, colors }) => {
  const isPdf = file.mimeType?.includes("pdf");
  return (
    <View style={[thumbStyles.wrap, { borderColor: `${colors.primary}40` }]}>
      {isPdf ? (
        <View style={[thumbStyles.pdfBox, { backgroundColor: `${colors.danger}15` }]}>
          <Ionicons name="document-text" size={28} color={colors.danger} />
        </View>
      ) : (
        <Image source={{ uri: file.uri }} style={thumbStyles.image} resizeMode="cover" />
      )}

      {/* Remove button */}
      <TouchableOpacity
        style={[thumbStyles.removeBtn, { backgroundColor: colors.danger }]}
        onPress={() => onRemove(index)}
        activeOpacity={0.8}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        <Ionicons name="close" size={11} color="#fff" />
      </TouchableOpacity>

      {/* Index badge */}
      <View style={[thumbStyles.indexBadge, { backgroundColor: `${colors.primary}CC` }]}>
        <Text style={thumbStyles.indexText}>{index + 1}</Text>
      </View>
    </View>
  );
};

const thumbStyles = StyleSheet.create({
  wrap: {
    width: (SW - 80) / 3,
    height: (SW - 80) / 3,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pdfBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  indexBadge: {
    position: "absolute",
    bottom: 5,
    left: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────
const CreateDocument = () => {
  const { colors }  = useTheme();
  const styles      = useMemo(() => createStyles(colors), [colors]);

  const { createDocument, getAllDocument, loading } = useDocument();

  const [documentName, setDocumentName] = useState("");
  const [memberName,   setMemberName]   = useState("");
  const [files,        setFiles]        = useState([]); // array of file objects

  const uploadScale = useRef(new Animated.Value(1)).current;

  // Progress step
  const progressStep = files.length > 0 ? 2 : memberName ? 1 : documentName.trim() ? 1 : 0;

  const pressIn  = () => Animated.spring(uploadScale, { toValue: 0.97, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(uploadScale, { toValue: 1,    useNativeDriver: true }).start();

  // ── File pick ──
  const handlePickDocument = async () => {
    try {
      // Ek ya multiple baar pick kar sakte hain
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: true, // expo-document-picker v57+ mein multiple support
      });

      if (!result.canceled && result.assets?.length > 0) {
        const picked = result.assets;

        // Agar PDF pick hua — sirf woh ek file rakhenge
        const hasPdf = picked.some((f) => f.mimeType?.includes("pdf"));
        if (hasPdf) {
          if (picked.length > 1) {
            Alert.alert("PDF Selected", "PDF ke saath sirf ek file allowed hai.");
          }
          setFiles([picked[0]]); // PDF: override karo, sirf ek
          return;
        }

        // Images ke liye combine karo
        const combined = [...files, ...picked];
        if (combined.length > MAX_IMAGES) {
          Alert.alert("Limit Reached", `Maximum ${MAX_IMAGES} images allowed.`);
          setFiles(combined.slice(0, MAX_IMAGES));
        } else {
          setFiles(combined);
        }
      }
    } catch (err) {
      Alert.alert("Error", "Failed to select document. Please try again.");
    }
  };

  // ── Remove file ──
  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Upload ──
  const handleUpload = async () => {
    if (!documentName.trim()) {
      Alert.alert("Missing Field", "Please enter a document name.");
      return;
    }
    if (!memberName) {
      Alert.alert("Missing Field", "Please select a family member.");
      return;
    }
    if (files.length === 0) {
      Alert.alert("Missing Field", "Please select at least one image or PDF file.");
      return;
    }

    const response = await createDocument({
      documentName: documentName.trim(),
      memberName,
      files,
    });

    if (response?.status === 201) {
      setDocumentName("");
      setMemberName("");
      setFiles([]);
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

  const getFileExtension = (name) => name?.split(".").pop()?.toUpperCase() ?? "";

  const isPdf       = files.length === 1 && files[0].mimeType?.includes("pdf");
  const canAddMore  = !isPdf && files.length < MAX_IMAGES;
  const totalSize   = files.reduce((acc, f) => acc + (f.size || 0), 0);

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
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
            <Ionicons name="information-circle" size={20} color={colors.secondary} />
            <Text style={styles.tipsText}>
              Supported formats: <Text style={{ fontWeight: "700" }}>PDF, JPEG, PNG</Text>. Max{" "}
              <Text style={{ fontWeight: "700" }}>10 MB</Text> per file. Up to{" "}
              <Text style={{ fontWeight: "700" }}>{MAX_IMAGES} images</Text> per document.
            </Text>
          </View>

          {/* ── Card 1: Document Name ── */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderIcon}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
              </View>
              <View style={styles.cardHeaderTitleBlock}>
                <Text style={styles.cardHeaderTitle}>Document Name</Text>
                <Text style={styles.cardHeaderSubtitle}>Give it a recognisable name</Text>
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="create-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
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
                <Text style={styles.cardHeaderSubtitle}>Who does this belong to?</Text>
              </View>
            </View>
            <View style={styles.memberGrid}>
              {MEMBERS.map((m) => {
                const isSelected  = memberName === m.name;
                const avatarColor = colors[m.colorKey] ?? colors.primary;
                return (
                  <TouchableOpacity
                    key={m.name}
                    style={[styles.memberChip, isSelected && styles.memberChipSelected]}
                    onPress={() => setMemberName(m.name)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.memberAvatarCircle, { backgroundColor: isSelected ? avatarColor : `${avatarColor}40` }]}>
                      <Text style={styles.memberAvatarText}>{m.initial}</Text>
                    </View>
                    <Text style={[styles.memberChipText, isSelected && styles.memberChipTextSelected]}>
                      {m.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: "auto" }} />
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
                <Ionicons name="images" size={20} color={colors.primary} />
              </View>
              <View style={styles.cardHeaderTitleBlock}>
                <Text style={styles.cardHeaderTitle}>File Attachment</Text>
                <Text style={styles.cardHeaderSubtitle}>
                  {files.length === 0
                    ? "PDF ya images select karo"
                    : `${files.length} file${files.length > 1 ? "s" : ""} selected${isPdf ? " (PDF)" : ""}`}
                </Text>
              </View>

              {/* Total size badge */}
              {files.length > 0 && (
                <View style={[fileCardStyles.sizeBadge, { backgroundColor: `${colors.success}18`, borderColor: `${colors.success}40` }]}>
                  <Text style={[fileCardStyles.sizeBadgeText, { color: colors.success }]}>
                    {formatFileSize(totalSize)}
                  </Text>
                </View>
              )}
            </View>

            {/* ── Image Preview Grid ── */}
            {files.length > 0 && (
              <View style={fileCardStyles.previewGrid}>
                {files.map((f, idx) => (
                  <ImageThumb
                    key={`${f.uri}-${idx}`}
                    file={f}
                    index={idx}
                    onRemove={handleRemoveFile}
                    colors={colors}
                  />
                ))}

                {/* Add more button — sirf image type aur limit nahi hua */}
                {canAddMore && (
                  <TouchableOpacity
                    style={[
                      fileCardStyles.addMoreBtn,
                      {
                        width: (SW - 80) / 3,
                        height: (SW - 80) / 3,
                        borderColor: `${colors.primary}50`,
                        backgroundColor: `${colors.primary}08`,
                      },
                    ]}
                    onPress={handlePickDocument}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
                    <Text style={[fileCardStyles.addMoreText, { color: colors.primary }]}>
                      Add More
                    </Text>
                    <Text style={[fileCardStyles.addMoreSub, { color: colors.textMuted }]}>
                      {MAX_IMAGES - files.length} left
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* ── Upload Zone (no files selected) ── */}
            {files.length === 0 && (
              <Animated.View style={{ transform: [{ scale: uploadScale }] }}>
                <TouchableOpacity
                  style={styles.uploadArea}
                  onPress={handlePickDocument}
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  activeOpacity={1}
                >
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="cloud-upload-outline" size={30} color={colors.primary} />
                  </View>
                  <Text style={styles.uploadAreaText}>Tap to Browse Files</Text>
                  <Text style={styles.uploadSubtext}>
                    Select up to {MAX_IMAGES} images or 1 PDF
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
            )}

            {/* ── Quick re-pick for single PDF ── */}
            {isPdf && (
              <View style={fileCardStyles.singleFile}>
                <View style={[fileCardStyles.pdfIconBox, { backgroundColor: `${colors.danger}15` }]}>
                  <Ionicons name="document-text" size={22} color={colors.danger} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[fileCardStyles.fileName, { color: colors.textPrimary }]} numberOfLines={1}>
                    {files[0].name}
                  </Text>
                  <Text style={[fileCardStyles.fileMeta, { color: colors.textMuted }]}>
                    {formatFileSize(files[0].size)} · {getFileExtension(files[0].name)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[fileCardStyles.changeBtn, { borderColor: `${colors.primary}40`, backgroundColor: `${colors.primary}10` }]}
                  onPress={handlePickDocument}
                  activeOpacity={0.75}
                >
                  <Text style={[fileCardStyles.changeBtnText, { color: colors.primary }]}>Change</Text>
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
                <Text style={styles.submitBtnText}>
                  Upload {files.length > 1 ? `${files.length} Files` : "Document"}
                </Text>
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
            <Ionicons name="arrow-back-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.cancelBtnText}>Go Back</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ─── Extra styles for file card ────────────────────────────────────────────────
const fileCardStyles = StyleSheet.create({
  previewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  addMoreBtn: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addMoreText: {
    fontSize: 12,
    fontWeight: "700",
  },
  addMoreSub: {
    fontSize: 10,
    fontWeight: "500",
  },
  singleFile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  pdfIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    fontSize: 13,
    fontWeight: "700",
  },
  fileMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  sizeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: "auto",
  },
  sizeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});

export default CreateDocument;
