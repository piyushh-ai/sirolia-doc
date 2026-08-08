import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";
import { useDocument } from "../../hooks/useDocuments";
import { useTheme } from "../../hooks/useTheme";
import { makeProfileStyles } from "../../styles/profile.styles";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getMemberColor = (colors, name) => {
  const map = {
    piyush: colors.memberPiyush,
    dishant: colors.memberDishant,
    sapna: colors.memberSapna,
    santosh: colors.memberSantosh,
  };
  return map[(name ?? "").toLowerCase()] ?? colors.primary;
};

// ─── Component ───────────────────────────────────────────────────────────────

const Profile = () => {
  const { user, logOut } = useAuth();
  const { myDocuments, allDocument, getMyDocuments } = useDocument();
  const { colors, mode, toggleTheme } = useTheme();

  const styles = makeProfileStyles(colors);
  const isDark = mode === "dark";

  useEffect(() => {
    getMyDocuments();
  }, []);

  const memberColor = getMemberColor(colors, user?.memberName);
  const initial = (user?.name ?? "?")[0].toUpperCase();

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar Section ── */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarRing, { backgroundColor: memberColor }]}>
            {user?.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatarPhoto} />
            ) : (
              <View style={styles.avatarInner}>
                <Text style={[styles.avatarInitial, { color: memberColor }]}>
                  {initial}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.userName}>{user?.name ?? "—"}</Text>
          <Text style={styles.userEmail}>{user?.email ?? "—"}</Text>

          {user?.memberName && (
            <View
              style={[
                styles.memberBadge,
                { backgroundColor: `${memberColor}18` },
              ]}
            >
              <Ionicons
                name="person-circle-outline"
                size={14}
                color={memberColor}
              />
              <Text style={[styles.memberBadgeText, { color: memberColor }]}>
                {user.memberName}
              </Text>
            </View>
          )}
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statCount}>{myDocuments?.length ?? "—"}</Text>
            <Text style={styles.statLabel}>Uploaded</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statCount}>{allDocument?.length ?? "—"}</Text>
            <Text style={styles.statLabel}>Total Docs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statCount}>
              {myDocuments?.filter((d) => d.fileType === "image").length ?? "—"}
            </Text>
            <Text style={styles.statLabel}>Images</Text>
          </View>
        </View>

        {/* ── Account & Actions Card ── */}
        <View style={styles.infoCard}>
          {/* My Uploads → dedicated page */}
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => router.push("/document/My-Uploads")}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.infoIconBox,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <View style={styles.infoRowText}>
              <Text style={styles.infoRowLabel}>My Documents</Text>
              <Text style={styles.infoRowValue}>My Uploads</Text>
            </View>
            {myDocuments?.length > 0 && (
              <View
                style={{
                  backgroundColor: `${colors.primary}18`,
                  borderRadius: 12,
                  paddingHorizontal: 9,
                  paddingVertical: 3,
                  marginRight: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "700",
                    fontSize: 12,
                  }}
                >
                  {myDocuments.length}
                </Text>
              </View>
            )}
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textMuted}
            />
          </TouchableOpacity>

          {/* Full Name */}
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <View
              style={[
                styles.infoIconBox,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={colors.primary}
              />
            </View>
            <View style={styles.infoRowText}>
              <Text style={styles.infoRowLabel}>Full Name</Text>
              <Text style={styles.infoRowValue}>{user?.name ?? "—"}</Text>
            </View>
          </View>

          {/* Email */}
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <View
              style={[
                styles.infoIconBox,
                { backgroundColor: `${colors.secondary}15` },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={colors.secondary}
              />
            </View>
            <View style={styles.infoRowText}>
              <Text style={styles.infoRowLabel}>Email</Text>
              <Text style={styles.infoRowValue}>{user?.email ?? "—"}</Text>
            </View>
          </View>

          {/* Family Member */}
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <View
              style={[
                styles.infoIconBox,
                { backgroundColor: `${memberColor}15` },
              ]}
            >
              <Ionicons name="people-outline" size={18} color={memberColor} />
            </View>
            <View style={styles.infoRowText}>
              <Text style={styles.infoRowLabel}>Family Member</Text>
              <Text style={[styles.infoRowValue, { color: memberColor }]}>
                {user?.memberName ?? "—"}
              </Text>
            </View>
          </View>

          {/* Theme Toggle */}
          <TouchableOpacity
            style={[styles.infoRow, styles.infoRowBorder]}
            onPress={toggleTheme}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.infoIconBox,
                { backgroundColor: `${colors.warning}15` },
              ]}
            >
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={18}
                color={colors.warning}
              />
            </View>
            <View style={styles.infoRowText}>
              <Text style={styles.infoRowLabel}>Appearance</Text>
              <Text style={styles.infoRowValue}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* ── Sign Out ── */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={logOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;
