import { router, Stack, useSegments } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { useEffect, useRef, useState } from "react";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DocumentProvider } from "@/hooks/useDocuments";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { FontFamily } from "@/constants/fonts";
import { checkForUpdate } from "@/utils/checkUpdate";

// Keep the native splash visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");

// ─── Animated Custom Splash ───────────────────────────────────────────────────
function AnimatedSplash({ onFinish }) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glow1Opacity = useRef(new Animated.Value(0)).current;
  const glow1Scale = useRef(new Animated.Value(0.5)).current;
  const glow2Opacity = useRef(new Animated.Value(0)).current;
  const glow2Scale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const shimmerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Shimmer loop on glow rings
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmerOpacity, { toValue: 0.2, duration: 900, useNativeDriver: true }),
      ])
    );

    Animated.sequence([
      // Phase 1: Logo bursts in (spring pop)
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 55,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        // Glow ring 1
        Animated.timing(glow1Opacity, { toValue: 0.5, duration: 600, useNativeDriver: true }),
        Animated.spring(glow1Scale, { toValue: 1.2, tension: 40, friction: 7, useNativeDriver: true }),
        // Glow ring 2 (delayed)
        Animated.sequence([
          Animated.delay(150),
          Animated.timing(glow2Opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          Animated.spring(glow2Scale, { toValue: 1.6, tension: 35, friction: 8, useNativeDriver: true }),
        ]),
      ]),
      // Phase 2: Name slides up
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(textTranslate, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),
      // Phase 3: Tagline fades in
      Animated.timing(taglineOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      // Phase 4: Hold with shimmer
      Animated.delay(900),
      // Phase 5: Fade everything out
      Animated.timing(containerOpacity, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start(() => {
      shimmerLoop.stop();
      onFinish?.();
    });

    // Start shimmer alongside phase 1
    setTimeout(() => shimmerLoop.start(), 300);
  }, []);

  return (
    <Animated.View style={[splashStyles.container, { opacity: containerOpacity }]}>
      {/* Background particles / bokeh dots */}
      {[...Array(12)].map((_, i) => (
        <View
          key={i}
          style={[
            splashStyles.bokeh,
            {
              left: Math.random() * width,
              top: Math.random() * height,
              width: 4 + (i % 3) * 3,
              height: 4 + (i % 3) * 3,
              opacity: 0.15 + (i % 4) * 0.08,
            },
          ]}
        />
      ))}

      {/* Outer glow ring 2 */}
      <Animated.View
        style={[
          splashStyles.glowRing,
          {
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: "rgba(30,90,255,0.08)",
            borderColor: "rgba(30,90,255,0.12)",
            opacity: Animated.multiply(glow2Opacity, shimmerOpacity),
            transform: [{ scale: glow2Scale }],
          },
        ]}
      />

      {/* Inner glow ring 1 */}
      <Animated.View
        style={[
          splashStyles.glowRing,
          {
            width: 210,
            height: 210,
            borderRadius: 105,
            backgroundColor: "rgba(60,120,255,0.12)",
            borderColor: "rgba(80,140,255,0.25)",
            opacity: glow1Opacity,
            transform: [{ scale: glow1Scale }],
          },
        ]}
      />

      {/* Logo Icon */}
      <Animated.View
        style={[
          splashStyles.iconWrapper,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        {/* Icon background glow */}
        <View style={splashStyles.iconGlow} />
        <Text style={splashStyles.iconEmoji}>🛡️</Text>
      </Animated.View>

      {/* App Name */}
      <Animated.Text
        style={[
          splashStyles.appName,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >
        Siro<Text style={splashStyles.appNameAccent}>Vault</Text>
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[splashStyles.tagline, { opacity: taglineOpacity }]}>
        Your Family's Secure Document Vault
      </Animated.Text>

      {/* Loading dots */}
      <Animated.View style={[splashStyles.dotsRow, { opacity: taglineOpacity }]}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[splashStyles.dot, i === 1 && splashStyles.dotMid]} />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#060918",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  bokeh: {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "#4A90FF",
  },
  glowRing: {
    position: "absolute",
    borderWidth: 1,
  },
  iconWrapper: {
    width: 130,
    height: 130,
    borderRadius: 36,
    backgroundColor: "#0F1A3E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(80,140,255,0.4)",
    shadowColor: "#2E6BFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
    marginBottom: 28,
  },
  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    backgroundColor: "rgba(46,107,255,0.15)",
  },
  iconEmoji: {
    fontSize: 64,
  },
  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  appNameAccent: {
    color: "#C8A44A",
  },
  tagline: {
    fontSize: 14,
    color: "rgba(180,190,220,0.7)",
    letterSpacing: 0.4,
    marginBottom: 40,
  },
  dotsRow: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotMid: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C8A44A",
  },
});

// ─── Status Bar synced to theme ───────────────────────────────────────────────
function ThemedStatusBar() {
  const { mode, colors } = useTheme();
  return (
    <StatusBar
      style={mode === "dark" ? "light" : "dark"}
      backgroundColor={colors.background}
    />
  );
}

// ─── Navigation logic ─────────────────────────────────────────────────────────
function NavigationProvider() {
  const { getMe, user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    checkForUpdate();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (segments[0] !== "auth") {
        router.replace("/auth/Login");
      }
    } else {
      const allowedSegments = ["home", "document"];
      if (!allowedSegments.includes(segments[0])) {
        router.replace("/home/Home");
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <SafeScreen>
        <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>
      </SafeScreen>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [FontFamily.regular]: require("../../assets/fonts/CabinetGrotesk-Regular.otf"),
    [FontFamily.medium]: require("../../assets/fonts/CabinetGrotesk-Medium.otf"),
    [FontFamily.bold]: require("../../assets/fonts/CabinetGrotesk-Bold.otf"),
    [FontFamily.extrabold]: require("../../assets/fonts/CabinetGrotesk-Extrabold.otf"),
  });

  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide native splash so our custom animated splash shows
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render anything until fonts are ready
  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <DocumentProvider>
          <SafeScreen>
            <NavigationProvider />
          </SafeScreen>
          <ThemedStatusBar />
        </DocumentProvider>
      </AuthProvider>

      {/* Custom animated splash overlay — shown on top of app */}
      {showCustomSplash && (
        <AnimatedSplash onFinish={() => setShowCustomSplash(false)} />
      )}
    </ThemeProvider>
  );
}
