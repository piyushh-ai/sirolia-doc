import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const getLoginStyles = (colors) =>
  StyleSheet.create({
    // ── Root container ─────────────────────────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ── Top hero section ───────────────────────────────────────────────────────
    heroSection: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 60,
    },

    // Glow ring behind illustration
    glowRing: {
      width: width * 0.75,
      height: width * 0.75,
      borderRadius: (width * 0.75) / 2,
      backgroundColor: "rgba(46,107,255,0.08)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(46,107,255,0.15)",
    },

    heroImage: {
      width: width * 0.65,
      height: width * 0.65,
      borderRadius: 32,
    },

    // ── Bottom card section ────────────────────────────────────────────────────
    card: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 36,
      borderTopRightRadius: 36,
      paddingHorizontal: 28,
      paddingTop: 36,
      paddingBottom: 48,
      borderTopWidth: 1,
      borderColor: colors.border,
      // Subtle shadow for light mode
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 10,
    },

    // Badge chip above title
    badge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      backgroundColor: "rgba(46,107,255,0.12)",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 5,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: "rgba(46,107,255,0.25)",
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#2E6BFF",
      marginRight: 7,
    },
    badgeText: {
      fontSize: 11,
      color: "#2E6BFF",
      letterSpacing: 0.8,
      fontWeight: "700",
      textTransform: "uppercase",
    },

    // Title
    title: {
      fontSize: 30,
      lineHeight: 36,
      letterSpacing: -0.5,
      color: colors.textPrimary,
      marginBottom: 10,
    },
    titleAccent: {
      color: "#2E6BFF",
    },

    // Subtitle
    subtitle: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 36,
    },

    // ── Google Sign-In Button ──────────────────────────────────────────────────
    googleBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 15,
      paddingHorizontal: 24,
      borderWidth: 1.5,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
      marginBottom: 24,
    },
    googleIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: "rgba(255,255,255,0.08)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    googleBtnText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
      letterSpacing: 0.1,
    },

    // ── Divider ────────────────────────────────────────────────────────────────
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      fontSize: 12,
      color: colors.textMuted,
      marginHorizontal: 12,
    },

    // ── Footer note ────────────────────────────────────────────────────────────
    footerNote: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    footerIcon: {
      fontSize: 13,
    },
    footerText: {
      fontSize: 12,
      color: colors.textMuted,
      textAlign: "center",
      lineHeight: 18,
    },
  });
