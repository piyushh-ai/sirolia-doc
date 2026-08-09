import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { router } from "expo-router";
import { getLoginStyles } from "../../styles/login.styles";
import { FontFamily, Typography } from "../../constants/fonts";

// ── Inline Google "G" mark ───────────────────────────────────────────────────
const GoogleIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ fontSize: 17, fontWeight: "900", color: "#4285F4", lineHeight: 22 }}>G</Text>
  </View>
);

// ── React Native Vector Illustration (no external PNG) ───────────────────────
const HeroIllustration = ({ colors }) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }], alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow ring */}
      <View style={{
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "rgba(46,107,255,0.07)",
        borderWidth: 1,
        borderColor: "rgba(46,107,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Middle ring */}
        <View style={{
          width: 152,
          height: 152,
          borderRadius: 76,
          backgroundColor: "rgba(46,107,255,0.10)",
          borderWidth: 1,
          borderColor: "rgba(46,107,255,0.22)",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Core icon circle */}
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 28,
            backgroundColor: colors.primary ?? "#2E6BFF",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#2E6BFF",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.45,
            shadowRadius: 20,
            elevation: 14,
          }}>
            <Text style={{ fontSize: 44, lineHeight: 52 }}>📁</Text>
          </View>
        </View>
      </View>

      {/* Floating doc chips */}
      <View style={{ position: "absolute", top: 14, right: 4 }}>
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        }}>
          <Text style={{ fontSize: 13 }}>📄</Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary, fontFamily: FontFamily.bold }}>PDF</Text>
        </View>
      </View>

      <View style={{ position: "absolute", bottom: 14, left: 4 }}>
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        }}>
          <Text style={{ fontSize: 13 }}>🖼️</Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary, fontFamily: FontFamily.bold }}>IMG</Text>
        </View>
      </View>

      <View style={{ position: "absolute", top: 60, left: 0 }}>
        <View style={{
          backgroundColor: `${colors.primary}15`,
          borderRadius: 10,
          paddingHorizontal: 8,
          paddingVertical: 5,
          borderWidth: 1,
          borderColor: `${colors.primary}30`,
        }}>
          <Text style={{ fontSize: 11, color: colors.primary, fontFamily: FontFamily.bold }}>🔒 Secure</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// ── Main Login Screen ────────────────────────────────────────────────────────
const Login = () => {
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const styles = getLoginStyles(colors);

  const [signingIn, setSigningIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const signIn = async () => {
    setSigningIn(true);
    setErrorMsg(null);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await signUp(userInfo.data.idToken);
      router.replace("/home/Home");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setErrorMsg("Sign-in was cancelled.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setErrorMsg("Sign-in is already in progress.");
      } else if (error?.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
      console.error(error);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* ── Hero Section ─────────────────────────────────────── */}
      <View style={styles.heroSection}>
        <HeroIllustration colors={colors} />
      </View>

      {/* ── Bottom Card ───────────────────────────────────────── */}
      <View style={styles.card}>
        {/* Badge */}
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Family Vault</Text>
        </View>

        {/* Title */}
        <Text style={[Typography.h1, styles.title]}>
          Keep Your{" "}
          <Text style={[Typography.h1, styles.title, styles.titleAccent]}>
            Documents
          </Text>
          {"\n"}Safe & Organized
        </Text>

        {/* Subtitle */}
        <Text style={[Typography.body, styles.subtitle]}>
          All your family's important documents in one place — secure,
          organized, and always accessible.
        </Text>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={[Typography.caption, styles.dividerText]}>
            Continue with
          </Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={signIn}
          disabled={signingIn}
          activeOpacity={0.75}
        >
          <View style={styles.googleIconWrapper}>
            <GoogleIcon />
          </View>
          {signingIn ? (
            <ActivityIndicator color={colors.primary ?? "#2E6BFF"} size="small" />
          ) : (
            <Text style={[Typography.button, styles.googleBtnText]}>
              Continue with Google
            </Text>
          )}
        </TouchableOpacity>

        {/* Error Message */}
        {errorMsg ? (
          <Text
            style={{
              textAlign: "center",
              color: colors.danger ?? "#FF5C5C",
              fontSize: 13,
              marginBottom: 12,
              fontFamily: FontFamily.medium,
            }}
          >
            {errorMsg}
          </Text>
        ) : null}

        {/* Footer */}
        <View style={styles.footerNote}>
          <Text style={styles.footerIcon}>🔒</Text>
          <Text style={[Typography.caption, styles.footerText]}>
            Your data is 100% secure. Sign in safely with your Google account.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;
