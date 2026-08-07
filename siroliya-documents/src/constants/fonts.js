// constants/fonts.js
// Cabinet Grotesk font family definitions and Typography presets
// Font files must be placed in: assets/fonts/

export const FontFamily = {
  regular: "CabinetGrotesk-Regular",
  medium: "CabinetGrotesk-Medium",
  bold: "CabinetGrotesk-Bold",
  extrabold: "CabinetGrotesk-Extrabold",
};

/**
 * Typography presets — use these across every screen/component
 * for consistent, premium typography.
 *
 * Usage:
 *   <Text style={[Typography.h1, { color: colors.textPrimary }]}>Title</Text>
 *   <Text style={[Typography.body, { color: colors.textSecondary }]}>Body</Text>
 */
export const Typography = {
  /** Page-level hero titles */
  h1: {
    fontFamily: FontFamily.extrabold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  /** Section headings */
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  /** Sub-section headings */
  h3: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  /** Document / card titles */
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  /** Regular paragraph text */
  body: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  /** Secondary / metadata text */
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  /** Buttons, CTAs, tab labels */
  button: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  /** TextInput content */
  input: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  /** Small labels above inputs / chips */
  label: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
};
