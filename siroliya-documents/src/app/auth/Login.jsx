import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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

// Google "G" Logo SVG rendered via inline component
const GoogleIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: "center", justifyContent: "center" }}>
    {/* Red */}
    <View
      style={{
        position: "absolute",
        width: 22,
        height: 22,
        borderRadius: 11,
        overflow: "hidden",
      }}
    />
    <Text style={{ fontSize: 16, fontWeight: "900", color: "#4285F4", lineHeight: 22 }}>G</Text>
  </View>
);

const Login = () => {
  const { user, loading, signUp } = useAuth();
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

      {/* ── Hero Illustration ─────────────────────────────────────── */}
      <View style={styles.heroSection}>
        <View style={styles.glowRing}>
          <Image
            source={require("../../../assets/images/login-hero.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* ── Bottom Card ───────────────────────────────────────────── */}
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
