import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useDocument } from "../../hooks/useDocuments";
import { useTheme } from "../../hooks/useTheme";
import { detailStyles } from "../../styles/documentDetail.styles";
import { Typography } from "../../constants/fonts";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ftMeta = (colors, fileType) => {
  const ft = (fileType ?? "").toLowerCase();
  if (ft === "image")
    return {
      bg: `${colors.primary}18`,
      color: colors.primary,
      icon: "image-outline",
    };
  if (ft === "pdf")
    return {
      bg: `${colors.danger}15`,
      color: colors.danger,
      icon: "document-text-outline",
    };
  return {
    bg: `${colors.textMuted}15`,
    color: colors.textMuted,
    icon: "document-outline",
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

const MyUploads = () => {
  const { myDocuments, getMyDocuments, loading } = useDocument();
  const { colors, mode } = useTheme();

  const isDark = mode === "dark";
  const styles = detailStyles(colors); // reuse safeArea, header, backBtn, etc.

  useEffect(() => {
    getMyDocuments();
  }, []);

  // ── Render each document card ──
  const renderItem = ({ item: doc }) => {
    const meta = ftMeta(colors, doc.fileType);
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 20,
          marginBottom: 10,
          padding: 16,
          borderRadius: 18,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 14,
        }}
        onPress={() =>
          router.push({
            pathname: "/document/Document-Detail",
            params: { documentId: doc._id },
          })
        }
        activeOpacity={0.75}
      >
        {/* File type icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: meta.bg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={meta.icon} size={24} color={meta.color} />
        </View>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text
            style={[Typography.cardTitle, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {doc.documentName}
          </Text>
          <Text
            style={[
              Typography.caption,
              { color: colors.textMuted, marginTop: 3 },
            ]}
          >
            {doc.memberName} · {formatDate(doc.createdAt)}
          </Text>
        </View>

        {/* File type badge */}
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 8,
            backgroundColor: meta.bg,
          }}
        >
          <Text
            style={[
              Typography.caption,
              {
                color: meta.color,
                fontWeight: "700",
                textTransform: "uppercase",
              },
            ]}
          >
            {doc.fileType}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </TouchableOpacity>
    );
  };

  // ── Empty state ──
  const renderEmpty = () => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 40,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: `${colors.primary}12`,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
        }}
      >
        <Ionicons
          name="cloud-upload-outline"
          size={32}
          color={colors.primary}
        />
      </View>
      <Text
        style={[
          Typography.h3,
          { color: colors.textPrimary, textAlign: "center" },
        ]}
      >
        No Uploads Yet
      </Text>
      <Text
        style={[
          Typography.body,
          { color: colors.textMuted, textAlign: "center" },
        ]}
      >
        Documents you upload will appear here.
      </Text>
    </View>
  );

  // ── Section header ──
  const ListHeader = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
      }}
    >
      <Text style={[Typography.h3, { color: colors.textPrimary }]}>
        My Uploads
      </Text>
      <Text style={[Typography.caption, { color: colors.textMuted }]}>
        {myDocuments?.length ?? 0}{" "}
        {myDocuments?.length === 1 ? "file" : "files"}
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>My Uploads</Text>
          <Text style={styles.headerSubtitle}>Documents uploaded by you</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* ── Loading overlay ── */}
      {loading && !myDocuments ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Loading your documents…</Text>
        </View>
      ) : (
        <FlatList
          data={myDocuments ?? []}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            { paddingBottom: 40 },
            !myDocuments?.length && { flex: 1 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={getMyDocuments}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyUploads;
