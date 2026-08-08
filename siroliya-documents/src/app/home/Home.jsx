import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Keyboard,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useDocument } from "../../hooks/useDocuments";
import { useTheme } from "../../hooks/useTheme";
import { makeHomeStyles } from "../../styles/homePage.styles";
import DocumentCard from "../../components/DocumentCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Home = () => {
  const { user } = useAuth();
  const { allDocument, loading, getAllDocument } = useDocument();
  const { mode, toggleTheme, colors } = useTheme();

  const styles = makeHomeStyles(colors);
  const isDark = mode === "dark";
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
    getAllDocument();
  }, []);

  const openSearch = () => {
    setSearchActive(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchQuery("");
    setSearchActive(false);
    Keyboard.dismiss();
  };

  const filteredDocuments = (allDocument ?? []).filter((doc) =>
    doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📂</Text>
      <Text style={styles.emptyTitle}>No Documents Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the{" "}
        <Text style={{ fontWeight: "700", color: colors.primary }}>+</Text>{" "}
        button below to upload your first document.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Header ──────────────────────────────────────────── */}
      <View style={styles.header}>
        {searchActive ? (
          /* ── Search bar mode ── */
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={colors.textMuted} />
            <TextInput
              ref={searchRef}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Search documents or members…"
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={closeSearch} activeOpacity={0.7} style={styles.searchCloseBtn}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Normal greeting mode ── */
          <View style={styles.headerLeft}>
            <Text style={styles.headerGreeting}>{getGreeting()}</Text>
            <Text style={styles.headerName}>
              {user?.name?.split(" ")[0] ?? "User"}
            </Text>
          </View>
        )}

        {/* Right icon buttons */}
        {!searchActive && (
          <TouchableOpacity
            style={styles.themeBtn}
            onPress={openSearch}
            activeOpacity={0.75}
          >
            <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.themeBtn}
          onPress={toggleTheme}
          activeOpacity={0.75}
        >
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* ── Document list ─────────────────────────────────── */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredDocuments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <DocumentCard
              document={item}
              onPress={() => {
                router.push({
                  pathname: "/document/Document-Detail",
                  params: {
                    documentId: item._id,
                  },
                });
              }}
            />
          )}
          ListHeaderComponent={
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchActive && searchQuery ? `Results for "${searchQuery}"` : "All Documents"}
              </Text>
              <Text style={styles.sectionCount}>
                {filteredDocuments.length} files
              </Text>
            </View>
          }
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            !allDocument?.length && { flex: 1 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={getAllDocument}
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

export default Home;
