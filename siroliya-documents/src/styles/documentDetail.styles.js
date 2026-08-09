import { StyleSheet, Dimensions } from "react-native";
import { Typography } from "../constants/fonts";

const { width, height } = Dimensions.get("window");

export const detailStyles = (colors) =>
  StyleSheet.create({
    // ─── Root ────────────────────────────────────────────────────────
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ─── Header ──────────────────────────────────────────────────────
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    headerTitleBlock: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      ...Typography.h3,
      color: colors.textPrimary,
    },
    headerSubtitle: {
      ...Typography.caption,
      color: colors.textMuted,
      marginTop: 1,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 12,
    },

    // ─── Scroll ──────────────────────────────────────────────────────
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },

    // ─── Preview Area ─────────────────────────────────────────────────
    previewContainer: {
      width: "100%",
      height: height * 0.32,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    previewImage: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    pdfPreviewBox: {
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    pdfIconCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: `${colors.primary}18`,
      alignItems: "center",
      justifyContent: "center",
    },
    pdfLabel: {
      ...Typography.body,
      color: colors.textMuted,
    },
    viewPdfBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 4,
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: `${colors.primary}15`,
      borderWidth: 1,
      borderColor: `${colors.primary}40`,
    },
    viewPdfBtnText: {
      ...Typography.label,
      color: colors.primary,
    },

    // ─── Body ────────────────────────────────────────────────────────
    body: {
      padding: 20,
      gap: 14,
    },

    // ─── Title Row ────────────────────────────────────────────────────
    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10,
    },
    titleBlock: {
      flex: 1,
    },
    documentTitle: {
      ...Typography.h2,
      color: colors.textPrimary,
      flexShrink: 1,
    },
    fileTypeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: "flex-start",
      marginTop: 6,
    },
    fileTypeBadgeText: {
      ...Typography.caption,
      fontWeight: "700",
      textTransform: "uppercase",
    },

    // ─── Info Card ────────────────────────────────────────────────────
    infoCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 14,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    infoIconBox: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    infoTextBlock: {
      flex: 1,
    },
    infoLabel: {
      ...Typography.caption,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      marginBottom: 2,
    },
    infoValue: {
      ...Typography.body,
      color: colors.textPrimary,
      fontWeight: "600",
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 4,
    },

    // ─── Uploader Card ────────────────────────────────────────────────
    uploaderCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    uploaderAvatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: `${colors.primary}20`,
      alignItems: "center",
      justifyContent: "center",
    },
    uploaderAvatarText: {
      ...Typography.h3,
      color: colors.primary,
      fontSize: 18,
    },
    uploaderTextBlock: {
      flex: 1,
    },
    uploaderName: {
      ...Typography.body,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    uploaderEmail: {
      ...Typography.caption,
      color: colors.textMuted,
      marginTop: 2,
    },
    ownerBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      backgroundColor: `${colors.success}18`,
      borderWidth: 1,
      borderColor: `${colors.success}30`,
    },
    ownerBadgeText: {
      ...Typography.caption,
      color: colors.success,
      fontWeight: "700",
    },

    // ─── Action Buttons (owner only) ─────────────────────────────────
    actionRow: {
      flexDirection: "row",
      gap: 12,
    },
    editBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: `${colors.primary}15`,
      borderWidth: 1.5,
      borderColor: `${colors.primary}40`,
    },
    editBtnText: {
      ...Typography.button,
      color: colors.primary,
    },
    deleteBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: `${colors.danger}12`,
      borderWidth: 1.5,
      borderColor: `${colors.danger}40`,
    },
    deleteBtnText: {
      ...Typography.button,
      color: colors.danger,
    },

    // ─── Loader / Error ──────────────────────────────────────────────
    centerBox: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: 40,
    },
    loaderText: {
      ...Typography.body,
      color: colors.textMuted,
    },
    errorText: {
      ...Typography.body,
      color: colors.danger,
      textAlign: "center",
    },

    // ─── Edit Modal ───────────────────────────────────────────────────
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      padding: 24,
      gap: 16,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 4,
    },
    modalTitle: {
      ...Typography.h3,
      color: colors.textPrimary,
      textAlign: "center",
    },
    modalLabel: {
      ...Typography.label,
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      marginBottom: 6,
    },
    modalInput: {
      backgroundColor: colors.background,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      ...Typography.input,
      color: colors.textPrimary,
    },
    modalMemberGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    modalMemberChip: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    modalMemberChipSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}15`,
    },
    modalMemberChipText: {
      ...Typography.body,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    modalMemberChipTextSelected: {
      color: colors.primary,
    },
    modalSaveBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 15,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    modalSaveBtnText: {
      ...Typography.button,
      color: "#FFFFFF",
    },
    modalCancelBtn: {
      alignItems: "center",
      paddingVertical: 12,
    },
    modalCancelBtnText: {
      ...Typography.button,
      color: colors.textMuted,
    },
  });

