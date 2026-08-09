import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Linking,
  StatusBar,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useDocument } from "../../hooks/useDocuments";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { detailStyles } from "../../styles/documentDetail.styles";
import { shareDocument } from "../../utils/shareDocument";
import { downloadDocument } from "../../utils/downloadDocument";

// ─── Helpers ────────────────────────────────────────────────────────────────

const MEMBERS = ["Piyush", "Dishant", "Sapna", "Santosh"];

const getMemberColor = (colors, name) => {
  const map = {
    piyush: colors.memberPiyush,
    dishant: colors.memberDishant,
    sapna: colors.memberSapna,
    santosh: colors.memberSantosh,
  };
  return map[(name ?? "").toLowerCase()] ?? colors.primary;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ─── Component ───────────────────────────────────────────────────────────────

const DocumentDetail = () => {
  const { documentId } = useLocalSearchParams();
  const {
    documentDetail,
    getDocumentDetail,
    loading,
    deleteDocument,
    editDocument,
  } = useDocument();
  const { user } = useAuth();
  const { colors, mode } = useTheme();

  const styles = detailStyles(colors);
  const isDark = mode === "dark";

  // ── Edit modal state ──
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editMember, setEditMember] = useState("");
  const [saving,        setSaving]        = useState(false);
  const [sharing,       setSharing]       = useState(false);
  const [downloading,   setDownloading]   = useState(false);
  const [imageFullscreen, setImageFullscreen] = useState(false);
  // Separate loading states for fullscreen modal actions
  const [fsSharing,     setFsSharing]     = useState(false);
  const [fsDownloading, setFsDownloading] = useState(false);

  // ── Fetch on mount / id change ──
  useEffect(() => {
    if (documentId) getDocumentDetail(documentId);
  }, [documentId]);

  const doc = documentDetail?.document;

  // Seed edit fields when doc loads
  useEffect(() => {
    if (doc) {
      setEditName(doc.documentName ?? "");
      setEditMember(doc.memberName ?? "");
    }
  }, [doc]);

  // ── Is this user the uploader? ──
  // Backend getMeController returns `user.id` (not `user._id`)
  // doc.uploadedBy._id comes from the populated document field
  const isOwner =
    user &&
    doc?.uploadedBy?._id &&
    String(user.id ?? user._id) === String(doc.uploadedBy._id);

  // ── Badge colours by file type ──
  const fileTypeMeta = useCallback(() => {
    const ft = (doc?.fileType ?? "").toLowerCase();
    if (ft === "image")
      return {
        bg: `${colors.primary}18`,
        text: colors.primary,
        icon: "image-outline",
      };
    if (ft === "pdf")
      return {
        bg: `${colors.danger}15`,
        text: colors.danger,
        icon: "document-text-outline",
      };
    return {
      bg: `${colors.textMuted}15`,
      text: colors.textMuted,
      icon: "document-outline",
    };
  }, [doc, colors]);

  // ── Delete handler ──
  const handleDelete = () => {
    Alert.alert(
      "Delete Document",
      `Are you sure you want to delete "${doc?.documentName}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const res = await deleteDocument(doc._id);
            if (res) router.back();
          },
        },
      ],
    );
  };

  // ── Save edit handler ──
  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert("Validation", "Document name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await editDocument(doc._id, {
        documentName: editName.trim(),
        memberName: editMember,
      });
      await getDocumentDetail(doc._id);
      setEditVisible(false);
    } catch (e) {
      Alert.alert("Error", "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading && !doc) {
    return (
      <View style={styles.safeArea}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.surface}
        />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>Document Detail</Text>
          </View>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Loading document…</Text>
        </View>
      </View>
    );
  }

  // ─── Error / not found state ──────────────────────────────────────────────
  if (!doc) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleBlock}>
            <Text style={styles.headerTitle}>Document Detail</Text>
          </View>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerBox}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.danger}
          />
          <Text style={styles.errorText}>
            Document not found or failed to load.
          </Text>
          <TouchableOpacity
            onPress={() => getDocumentDetail(documentId)}
            activeOpacity={0.75}
          >
            <Text
              style={{ color: colors.primary, fontWeight: "700", marginTop: 8 }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const ftMeta = fileTypeMeta();
  const memberColor = getMemberColor(colors, doc.memberName);
  const uploaderInitial = (doc.uploadedBy?.name ?? "?")[0].toUpperCase();

  // ─── Main render ─────────────────────────────────────────────────────────
  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {doc.documentName}
          </Text>
          <Text style={styles.headerSubtitle}>{doc.memberName}</Text>
        </View>
        <View style={styles.headerRight}>
          {/* Share */}
          <TouchableOpacity
            onPress={() => shareDocument(doc, setSharing)}
            disabled={sharing || downloading}
            style={{ alignItems: "center", justifyContent: "center", marginRight: 14 }}
          >
            {sharing ? (
              <ActivityIndicator size="small" color={colors.textPrimary} />
            ) : (
              <Ionicons name="share-social-outline" size={22} color={colors.textPrimary} />
            )}
          </TouchableOpacity>

          {/* Download */}
          <TouchableOpacity
            onPress={() => downloadDocument(doc, setDownloading)}
            disabled={sharing || downloading}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {downloading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="download-outline" size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Document Preview ── */}
        <View style={styles.previewContainer}>
          {doc.fileType === "image" ? (
            // Tap image → opens full-screen viewer
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => setImageFullscreen(true)}
            >
              <Image
                source={{ uri: doc.fileUrl }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.pdfPreviewBox}>
              <View style={styles.pdfIconCircle}>
                <Ionicons name="document-text" size={44} color={colors.primary} />
              </View>
              <Text style={styles.pdfLabel}>PDF Document</Text>

              {/* Action buttons row */}
              <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                {/* Open PDF */}
                <TouchableOpacity
                  style={styles.viewPdfBtn}
                  onPress={() => Linking.openURL(doc.fileUrl)}
                  activeOpacity={0.75}
                >
                  <Ionicons name="open-outline" size={14} color={colors.primary} />
                  <Text style={styles.viewPdfBtnText}>Open PDF</Text>
                </TouchableOpacity>

                {/* Download PDF */}
                <TouchableOpacity
                  style={[
                    styles.viewPdfBtn,
                    { backgroundColor: `${colors.success}18`, borderColor: colors.success },
                  ]}
                  onPress={() => downloadDocument(doc, setDownloading)}
                  disabled={downloading}
                  activeOpacity={0.75}
                >
                  {downloading ? (
                    <ActivityIndicator size="small" color={colors.success} />
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={14} color={colors.success} />
                      <Text style={[styles.viewPdfBtnText, { color: colors.success }]}>Download</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>
          {/* ── Title & File-type badge ── */}
          <View style={styles.titleRow}>
            <View style={styles.titleBlock}>
              <Text style={styles.documentTitle}>{doc.documentName}</Text>
              <View
                style={[styles.fileTypeBadge, { backgroundColor: ftMeta.bg }]}
              >
                <Ionicons name={ftMeta.icon} size={11} color={ftMeta.text} />
                <Text
                  style={[styles.fileTypeBadgeText, { color: ftMeta.text }]}
                >
                  {doc.fileType}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Info Card ── */}
          <View style={styles.infoCard}>
            {/* Member */}
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconBox,
                  { backgroundColor: `${memberColor}18` },
                ]}
              >
                <Ionicons name="person-outline" size={18} color={memberColor} />
              </View>
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Member</Text>
                <Text style={[styles.infoValue, { color: memberColor }]}>
                  {doc.memberName}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* File Type */}
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconBox,
                  { backgroundColor: `${ftMeta.text}18` },
                ]}
              >
                <Ionicons name={ftMeta.icon} size={18} color={ftMeta.text} />
              </View>
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>File Type</Text>
                <Text style={styles.infoValue}>
                  {(doc.fileType ?? "—").toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Uploaded At */}
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconBox,
                  { backgroundColor: `${colors.success}18` },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.success}
                />
              </View>
              <View style={styles.infoTextBlock}>
                <Text style={styles.infoLabel}>Uploaded On</Text>
                <Text style={styles.infoValue}>
                  {formatDate(doc.createdAt)}
                </Text>
              </View>
            </View>

            {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View
                    style={[
                      styles.infoIconBox,
                      { backgroundColor: `${colors.warning}18` },
                    ]}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={18}
                      color={colors.warning}
                    />
                  </View>
                  <View style={styles.infoTextBlock}>
                    <Text style={styles.infoLabel}>Last Updated</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(doc.updatedAt)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* ── Uploader Card ── */}
          <View style={styles.uploaderCard}>
            <View style={styles.uploaderAvatar}>
              <Text style={styles.uploaderAvatarText}>{uploaderInitial}</Text>
            </View>
            <View style={styles.uploaderTextBlock}>
              <Text style={styles.uploaderName}>
                {doc.uploadedBy?.name ?? "Unknown"}
              </Text>
              <Text style={styles.uploaderEmail}>
                {doc.uploadedBy?.email ?? ""}
              </Text>
            </View>
            {isOwner && (
              <View style={styles.ownerBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={11}
                  color={colors.success}
                />
                <Text style={styles.ownerBadgeText}>You</Text>
              </View>
            )}
          </View>

          {/* ── Owner Actions ── */}
          {isOwner && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setEditVisible(true)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDelete}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.danger}
                />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Edit Bottom Sheet Modal ── */}
      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setEditVisible(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalSheet}>
              {/* Handle */}
              <View style={styles.modalHandle} />

              <Text style={styles.modalTitle}>Edit Document</Text>

              {/* Document Name input */}
              <View>
                <Text style={styles.modalLabel}>Document Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="e.g. Aadhaar Card"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </View>

              {/* Member selector */}
              <View>
                <Text style={styles.modalLabel}>Member</Text>
                <View style={styles.modalMemberGrid}>
                  {MEMBERS.map((m) => {
                    const selected = editMember === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[
                          styles.modalMemberChip,
                          selected && styles.modalMemberChipSelected,
                        ]}
                        onPress={() => setEditMember(m)}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            styles.modalMemberChipText,
                            selected && styles.modalMemberChipTextSelected,
                          ]}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Save button */}
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#fff"
                    />
                    <Text style={styles.modalSaveBtnText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditVisible(false)}
                activeOpacity={0.75}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Full-Screen Image Viewer Modal ── */}
      <Modal
        visible={imageFullscreen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setImageFullscreen(false)}
        statusBarTranslucent
      >
        <View style={fsStyles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

          {/* Close button */}
          <TouchableOpacity
            style={fsStyles.closeBtn}
            onPress={() => setImageFullscreen(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={fsStyles.title} numberOfLines={1}>
            {doc?.documentName}
          </Text>

          {/* Full image */}
          <Image
            source={{ uri: doc?.fileUrl }}
            style={fsStyles.image}
            resizeMode="contain"
          />

          {/* Bottom action bar */}
          <View style={fsStyles.actionBar}>
            {/* Share */}
            <TouchableOpacity
              style={fsStyles.actionBtn}
              onPress={() => shareDocument(doc, setFsSharing)}
              disabled={fsSharing || fsDownloading}
              activeOpacity={0.8}
            >
              {fsSharing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="share-social-outline" size={22} color="#fff" />
              )}
              <Text style={fsStyles.actionBtnText}>Share</Text>
            </TouchableOpacity>

            {/* Download */}
            <TouchableOpacity
              style={[fsStyles.actionBtn, fsStyles.actionBtnDownload]}
              onPress={() => downloadDocument(doc, setFsDownloading)}
              disabled={fsSharing || fsDownloading}
              activeOpacity={0.8}
            >
              {fsDownloading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="download-outline" size={22} color="#fff" />
              )}
              <Text style={fsStyles.actionBtnText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const fsStyles = {
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 48,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    position: "absolute",
    top: 54,
    left: 64,
    right: 16,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    opacity: 0.85,
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H * 0.78,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingBottom: 32,
    paddingTop: 16,
    paddingHorizontal: 24,
    gap: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  actionBtnDownload: {
    backgroundColor: "rgba(46,107,255,0.45)",
    borderColor: "rgba(80,140,255,0.5)",
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
};

export default DocumentDetail;

