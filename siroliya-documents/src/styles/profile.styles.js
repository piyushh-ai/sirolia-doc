import { StyleSheet, Dimensions } from "react-native";
import { Typography } from "../constants/fonts";

const { width } = Dimensions.get("window");

export const makeProfileStyles = (colors) =>
  StyleSheet.create({
    // ─── Root ────────────────────────────────────────────────────────────────
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ─── Header ──────────────────────────────────────────────────────────────
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 14,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      ...Typography.h3,
      color: colors.textPrimary,
    },

    // ─── Scroll ──────────────────────────────────────────────────────────────
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 40 },

    // ─── Avatar Card ─────────────────────────────────────────────────────────
    avatarSection: {
      alignItems: "center",
      paddingVertical: 32,
      gap: 12,
    },
    avatarRing: {
      width: 90,
      height: 90,
      borderRadius: 45,
      padding: 3,
      backgroundColor: colors.primary,
    },
    avatarInner: {
      flex: 1,
      borderRadius: 42,
      backgroundColor: `${colors.primary}20`,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarPhoto: {
      width: 84,
      height: 84,
      borderRadius: 42,
    },
    avatarInitial: {
      ...Typography.h1,
      color: colors.primary,
      fontSize: 32,
    },
    userName: {
      ...Typography.h2,
      color: colors.textPrimary,
      textAlign: "center",
    },
    userEmail: {
      ...Typography.body,
      color: colors.textMuted,
      textAlign: "center",
    },
    memberBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 2,
    },
    memberBadgeText: {
      ...Typography.label,
      fontWeight: "700",
    },

    // ─── Stats Row ────────────────────────────────────────────────────────────
    statsRow: {
      flexDirection: "row",
      marginHorizontal: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      overflow: "hidden",
      marginBottom: 20,
    },
    statBox: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginVertical: 10,
    },
    statCount: {
      ...Typography.h2,
      color: colors.textPrimary,
    },
    statLabel: {
      ...Typography.caption,
      color: colors.textMuted,
      marginTop: 2,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },

    // ─── Section ─────────────────────────────────────────────────────────────
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    sectionTitle: {
      ...Typography.h3,
      color: colors.textPrimary,
    },
    sectionCount: {
      ...Typography.caption,
      color: colors.textMuted,
    },

    // ─── Doc Card ────────────────────────────────────────────────────────────
    docCard: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginBottom: 10,
      padding: 14,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 14,
    },
    docIconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    docTextBlock: {
      flex: 1,
    },
    docName: {
      ...Typography.cardTitle,
      color: colors.textPrimary,
    },
    docMeta: {
      ...Typography.caption,
      color: colors.textMuted,
      marginTop: 2,
    },
    docArrow: {
      opacity: 0.4,
    },

    // ─── Empty State ─────────────────────────────────────────────────────────
    emptyBox: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
      paddingHorizontal: 40,
      gap: 10,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: `${colors.primary}12`,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    emptyTitle: {
      ...Typography.h3,
      color: colors.textPrimary,
      textAlign: "center",
    },
    emptySubtitle: {
      ...Typography.body,
      color: colors.textMuted,
      textAlign: "center",
    },

    // ─── Divider ─────────────────────────────────────────────────────────────
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 20,
      marginVertical: 20,
    },

    // ─── Settings / Info Rows ─────────────────────────────────────────────────
    infoCard: {
      marginHorizontal: 20,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 14,
      gap: 14,
    },
    infoRowBorder: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    infoIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    infoRowText: {
      flex: 1,
    },
    infoRowLabel: {
      ...Typography.label,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      fontSize: 10,
      marginBottom: 2,
    },
    infoRowValue: {
      ...Typography.body,
      color: colors.textPrimary,
      fontWeight: "600",
    },

    // ─── Sign Out Button ─────────────────────────────────────────────────────
    signOutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginHorizontal: 20,
      marginTop: 4,
      paddingVertical: 15,
      borderRadius: 16,
      backgroundColor: `${colors.danger}12`,
      borderWidth: 1.5,
      borderColor: `${colors.danger}40`,
    },
    signOutText: {
      ...Typography.button,
      color: colors.danger,
    },
  });
