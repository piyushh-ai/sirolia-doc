import { StyleSheet } from "react-native";

/**
 * homePage.styles.js
 * Factory function that returns themed styles for the Home screen.
 * Usage: const styles = makeHomeStyles(colors);
 */
export const makeHomeStyles = (colors) =>
  StyleSheet.create({
    // ── Root container ──────────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ── Header ──────────────────────────────────────────────────
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flex: 1,
    },
    headerGreeting: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: "500",
      marginBottom: 2,
    },
    headerName: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    themeBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    themeBtnIcon: {
      fontSize: 18,
    },

    // ── Search bar (replaces greeting when active) ──────────────
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 10,
      gap: 8,
    },
    searchIcon: {
      fontSize: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
      paddingVertical: 0,
    },
    searchCloseBtn: {
      padding: 4,
    },
    searchCloseText: {
      fontSize: 15,
      fontWeight: "700",
    },

    // ── Section title ────────────────────────────────────────────
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    sectionCount: {
      fontSize: 13,
      color: colors.textMuted,
      fontWeight: "500",
    },

    // ── List ─────────────────────────────────────────────────────
    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },

    // ── Document card ─────────────────────────────────────────────
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },

    // ── Thumbnail / icon ─────────────────────────────────────────
    thumbContainer: {
      width: 52,
      height: 52,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    thumbImage: {
      width: 52,
      height: 52,
    },
    thumbIconText: {
      fontSize: 26,
    },

    // ── Card text content ──────────────────────────────────────
    cardContent: {
      flex: 1,
    },
    cardDocName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    cardMemberRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      gap: 6,
    },
    memberBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 20,
      alignSelf: "flex-start",
    },
    memberBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#ffffff",
    },
    cardMeta: {
      fontSize: 11,
      color: colors.textMuted,
    },
    cardMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    cardMetaDot: {
      fontSize: 11,
      color: colors.textMuted,
    },

    // ── Chevron arrow ─────────────────────────────────────────────
    cardArrow: {
      fontSize: 18,
      color: colors.textMuted,
      marginLeft: 8,
    },

    // ── Empty state ───────────────────────────────────────────────
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
    },
    emptyIcon: {
      fontSize: 52,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 6,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: "center",
      paddingHorizontal: 40,
      lineHeight: 20,
    },

    // ── Loading ───────────────────────────────────────────────────
    loaderContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
