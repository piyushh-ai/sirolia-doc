import { StyleSheet, Dimensions } from "react-native";
import { Typography } from "../constants/fonts";

const { width } = Dimensions.get("window");

export const createStyles = (colors) =>
  StyleSheet.create({
    // ─── Root ───────────────────────────────────────────────────────────────
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ─── Header ─────────────────────────────────────────────────────────────
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
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
      marginTop: 2,
    },
    headerRight: {
      width: 40,
    },

    // ─── Scroll ─────────────────────────────────────────────────────────────
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 40,
    },

    // ─── Progress Steps ─────────────────────────────────────────────────────
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 28,
    },
    progressStep: {
      alignItems: "center",
    },
    progressDot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    progressDotActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    progressDotDone: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    progressLabel: {
      ...Typography.caption,
      color: colors.textMuted,
      marginTop: 5,
      textAlign: "center",
    },
    progressLabelActive: {
      color: colors.primary,
    },
    progressLine: {
      flex: 1,
      height: 2,
      backgroundColor: colors.border,
      marginHorizontal: 6,
      marginBottom: 20,
    },
    progressLineFilled: {
      backgroundColor: colors.primary,
    },

    // ─── Form Card ──────────────────────────────────────────────────────────
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 22,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 18,
      gap: 10,
    },
    cardHeaderIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: `${colors.primary}18`,
      alignItems: "center",
      justifyContent: "center",
    },
    cardHeaderTitleBlock: {
      flex: 1,
    },
    cardHeaderTitle: {
      ...Typography.h3,
      color: colors.textPrimary,
    },
    cardHeaderSubtitle: {
      ...Typography.caption,
      color: colors.textSecondary,
      marginTop: 1,
    },

    // ─── Form Inputs ────────────────────────────────────────────────────────
    formGroup: {
      marginBottom: 18,
    },
    label: {
      ...Typography.label,
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 14,
    },
    inputWrapperFocused: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 2,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      paddingVertical: 13,
      ...Typography.input,
      color: colors.textPrimary,
    },
    charCount: {
      ...Typography.caption,
      color: colors.textMuted,
    },

    // ─── Member Grid ────────────────────────────────────────────────────────
    memberGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 4,
    },
    memberChip: {
      flex: 1,
      minWidth: "44%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    memberChipSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}15`,
    },
    memberAvatarCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    memberAvatarText: {
      fontSize: 11,
      color: "#FFFFFF",
      fontWeight: "800",
    },
    memberChipText: {
      ...Typography.body,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    memberChipTextSelected: {
      color: colors.primary,
    },

    // ─── Upload Area ─────────────────────────────────────────────────────────
    uploadArea: {
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.border,
      borderRadius: 18,
      paddingVertical: 32,
      paddingHorizontal: 20,
      alignItems: "center",
      backgroundColor: colors.background,
    },
    uploadAreaActive: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}08`,
    },
    uploadIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    uploadAreaText: {
      ...Typography.body,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    uploadSubtext: {
      ...Typography.caption,
      color: colors.textMuted,
      textAlign: "center",
    },
    uploadBadgesRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 14,
    },
    uploadBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      backgroundColor: colors.border,
    },
    uploadBadgeText: {
      ...Typography.caption,
      color: colors.textSecondary,
      fontWeight: "600",
    },

    // ─── Selected File ───────────────────────────────────────────────────────
    selectedFileContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${colors.success}12`,
      borderWidth: 1.5,
      borderColor: `${colors.success}40`,
      borderRadius: 16,
      padding: 14,
      gap: 12,
    },
    fileIconCircle: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: `${colors.success}20`,
      alignItems: "center",
      justifyContent: "center",
    },
    fileMetadata: {
      flex: 1,
    },
    fileName: {
      ...Typography.body,
      fontWeight: "700",
      color: colors.success,
    },
    fileSubRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 3,
    },
    fileSize: {
      ...Typography.caption,
      color: colors.success,
      opacity: 0.8,
    },
    fileDot: {
      width: 3,
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.success,
      opacity: 0.5,
    },
    fileType: {
      ...Typography.caption,
      color: colors.success,
      opacity: 0.8,
      textTransform: "uppercase",
      fontWeight: "700",
    },
    removeBtn: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: `${colors.danger}18`,
      alignItems: "center",
      justifyContent: "center",
    },

    // ─── Submit Button ────────────────────────────────────────────────────────
    submitBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    },
    submitBtnDisabled: {
      backgroundColor: colors.textMuted,
      shadowOpacity: 0,
      elevation: 0,
    },
    submitBtnText: {
      ...Typography.button,
      color: "#FFFFFF",
      fontSize: 16,
    },

    // ─── Cancel Button ────────────────────────────────────────────────────────
    cancelBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 14,
    },
    cancelBtnText: {
      ...Typography.button,
      color: colors.textSecondary,
    },

    // ─── Tips Card ─────────────────────────────────────────────────────────────
    tipsCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      backgroundColor: `${colors.secondary}12`,
      borderWidth: 1,
      borderColor: `${colors.secondary}30`,
      borderRadius: 16,
      padding: 14,
      marginBottom: 24,
    },
    tipsText: {
      flex: 1,
      ...Typography.caption,
      color: colors.textSecondary,
      lineHeight: 17,
    },
  });

