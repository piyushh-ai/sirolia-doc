import { StyleSheet } from "react-native";

/**
 * homeBottomBar.styles.js
 * Returns a StyleSheet based on the current theme colors.
 * Usage: const styles = makeStyles(colors);
 */
export const makeStyles = (colors) =>
  StyleSheet.create({
    tabBarContainer: {
      backgroundColor: "transparent",
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 28,
      alignItems: "center",
      paddingVertical: 6,
      paddingHorizontal: 8,
      shadowColor: colors.textSecondary,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 4,
      gap: 3,
    },
    fabTab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 8,
    },
    iconWrapper: {
      width: 44,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    iconWrapperActive: {
      backgroundColor: `${colors.primary}18`, // 10% opacity tint of primary
    },
    iconEmoji: {
      fontSize: 22,
    },
    fabWrapper: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 8,
      marginTop: -20,
      borderWidth: 3,
      borderColor: colors.surface,
    },
    fabWrapperActive: {
      backgroundColor: colors.primary,
      opacity: 0.85,
    },
    fabIcon: {
      fontSize: 26,
      color: "#ffffff",
      fontWeight: "300",
      lineHeight: 30,
    },
    tabLabel: {
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 0.2,
    },
    tabLabelActive: {
      color: colors.primary,
    },
    tabLabelInactive: {
      color: colors.textMuted,
    },
  });
