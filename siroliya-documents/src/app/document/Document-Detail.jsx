import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Linking,
  StatusBar,
  Dimensions,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useDocument } from "../../hooks/useDocuments";
import { useAuth }     from "../../hooks/useAuth";
import { useTheme }    from "../../hooks/useTheme";
import { shareDocument }   from "../../utils/shareDocument";
import { downloadDocument } from "../../utils/downloadDocument";

// ─── Constants ───────────────────────────────────────────────────────────────
const MEMBERS = ["Piyush", "Dishant", "Sapna", "Santosh"];
const { width: SW, height: SH } = Dimensions.get("window");
const GALLERY_HEIGHT = SH * 0.38;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getMemberColor = (colors, name) => {
  const map = {
    piyush:  colors.memberPiyush,
    dishant: colors.memberDishant,
    sapna:   colors.memberSapna,
    santosh: colors.memberSantosh,
  };
  return map[(name ?? "").toLowerCase()] ?? colors.primary;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// ─── Normalize images from doc (backward compat) ─────────────────────────────
const getImages = (doc) => {
  if (!doc) return [];
  if (doc.images && doc.images.length > 0) return doc.images;
  if (doc.fileUrl) return [{ url: doc.fileUrl, publicId: doc.cloudinaryPublicId }];
  return [];
};

// ─── Image Dot Indicator ─────────────────────────────────────────────────────
const DotIndicator = ({ count, active, colors }) => {
  if (count <= 1) return null;
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            dotStyles.dot,
            {
              backgroundColor: i === active ? "#fff" : "rgba(255,255,255,0.4)",
              width: i === active ? 20 : 7,
            },
          ]}
        />
      ))}
    </View>
  );
};

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
});

// ─── Gallery Swiper ───────────────────────────────────────────────────────────
const ImageGallery = ({ images, colors, onImagePress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    setActiveIndex(idx);
  };

  return (
    <View style={{ height: GALLERY_HEIGHT, backgroundColor: colors.surface }}>
      <FlatList
        ref={flatRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => onImagePress(index)}
            style={{ width: SW, height: GALLERY_HEIGHT }}
          >
            <Image
              source={{ uri: item.url }}
              style={{ width: SW, height: GALLERY_HEIGHT }}
              resizeMode="cover"
            />
            {/* Subtle gradient overlay at bottom */}
            <View style={galleryStyles.gradient} />
          </TouchableOpacity>
        )}
      />

      {/* Counter + Dots */}
      <View style={galleryStyles.overlay}>
        {images.length > 1 && (
          <View style={galleryStyles.counterBadge}>
            <Ionicons name="images-outline" size={11} color="#fff" />
            <Text style={galleryStyles.counterText}>
              {activeIndex + 1} / {images.length}
            </Text>
          </View>
        )}
        <DotIndicator count={images.length} active={activeIndex} colors={colors} />
      </View>
    </View>
  );
};

const galleryStyles = StyleSheet.create({
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    background: "transparent",
    // React Native doesn't support CSS gradient — using a view overlay
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  overlay: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 8,
  },
  counterBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  counterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

// ─── Fullscreen Gallery Modal ─────────────────────────────────────────────────
const FullscreenGallery = ({ visible, images, startIndex, doc, onClose, colors }) => {
  const [activeIndex,    setActiveIndex]    = useState(startIndex);
  const [fsSharing,      setFsSharing]      = useState(false);
  const [fsDownloading,  setFsDownloading]  = useState(false);
  const flatRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setActiveIndex(startIndex);
      // Scroll to start index after mount
      setTimeout(() => {
        flatRef.current?.scrollToIndex({ index: startIndex, animated: false });
      }, 100);
    }
  }, [visible, startIndex]);

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    setActiveIndex(idx);
  };

  const currentImage = images[activeIndex];
  // Wrap doc with current image url for share/download
  const currentDoc   = currentImage ? { ...doc, fileUrl: currentImage.url } : doc;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={fs.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

        {/* Image slider */}
        <FlatList
          ref={flatRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          onScroll={onScroll}
          scrollEventThrottle={16}
          initialScrollIndex={startIndex}
          getItemLayout={(_, index) => ({ length: SW, offset: SW * index, index })}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.url }}
              style={{ width: SW, height: SH }}
              resizeMode="contain"
            />
          )}
        />

        {/* Top bar */}
        <View style={fs.topBar}>
          <TouchableOpacity style={fs.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center", gap: 2 }}>
            <Text style={fs.titleText} numberOfLines={1}>{doc?.documentName}</Text>
            {images.length > 1 && (
              <Text style={fs.counterSmall}>{activeIndex + 1} of {images.length}</Text>
            )}
          </View>

          <View style={{ width: 40 }} />
        </View>

        {/* Dot Indicator */}
        {images.length > 1 && (
          <View style={fs.dotsWrapper}>
            <DotIndicator count={images.length} active={activeIndex} colors={colors} />
          </View>
        )}

        {/* Bottom action bar */}
        <View style={fs.bottomBar}>
          <TouchableOpacity
            style={fs.fsBtn}
            onPress={() => shareDocument(currentDoc, setFsSharing)}
            disabled={fsSharing || fsDownloading}
            activeOpacity={0.8}
          >
            {fsSharing
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name="share-social-outline" size={22} color="#fff" />
            }
            <Text style={fs.fsBtnText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[fs.fsBtn, { backgroundColor: "rgba(50,100,255,0.5)" }]}
            onPress={() => downloadDocument(currentDoc, setFsDownloading)}
            disabled={fsSharing || fsDownloading}
            activeOpacity={0.8}
          >
            {fsDownloading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Ionicons name="download-outline" size={22} color="#fff" />
            }
            <Text style={fs.fsBtnText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DocumentDetail() {
  const { documentId } = useLocalSearchParams();
  const { documentDetail, getDocumentDetail, loading, deleteDocument, editDocument } = useDocument();
  const { user }       = useAuth();
  const { colors, mode } = useTheme();
  const isDark = mode === "dark";

  // ── State ──
  const [editVisible,        setEditVisible]        = useState(false);
  const [editName,           setEditName]           = useState("");
  const [editMember,         setEditMember]         = useState("");
  const [editNewFiles,       setEditNewFiles]       = useState([]);
  const [editRemoveIndexes,  setEditRemoveIndexes]  = useState([]);
  const [saving,             setSaving]             = useState(false);
  const [sharing,            setSharing]            = useState(false);
  const [downloading,        setDownloading]        = useState(false);
  const [fsVisible,          setFsVisible]          = useState(false);
  const [fsStartIndex,       setFsStartIndex]       = useState(0);

  // ── Fetch ──
  useEffect(() => {
    if (documentId) getDocumentDetail(documentId);
  }, [documentId]);

  const doc    = documentDetail?.document;
  const images = getImages(doc);

  useEffect(() => {
    if (doc) {
      setEditName(doc.documentName ?? "");
      setEditMember(doc.memberName ?? "");
      setEditNewFiles([]);
      setEditRemoveIndexes([]);
    }
  }, [doc]);

  // ── Derived ──
  const isOwner =
    user &&
    doc?.uploadedBy?._id &&
    String(user.id ?? user._id) === String(doc.uploadedBy._id);

  const ftMeta = useCallback(() => {
    const ft = (doc?.fileType ?? "").toLowerCase();
    if (ft === "image") return { bg: `${colors.primary}18`, text: colors.primary, icon: "image-outline" };
    if (ft === "pdf")   return { bg: `${colors.danger}15`,  text: colors.danger,  icon: "document-text-outline" };
    return               { bg: `${colors.textMuted}15`, text: colors.textMuted, icon: "document-outline" };
  }, [doc, colors]);

  // ── Handlers ──
  const handleDelete = () => {
    Alert.alert(
      "Delete Document",
      `Are you sure you want to delete "${doc?.documentName}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const res = await deleteDocument(doc._id);
            if (res) router.back();
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert("Validation", "Document name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await editDocument(doc._id, {
        documentName:       editName.trim(),
        memberName:         editMember,
        files:              editNewFiles,
        removeImageIndexes: editRemoveIndexes,
      });
      await getDocumentDetail(doc._id);
      setEditVisible(false);
      setEditNewFiles([]);
      setEditRemoveIndexes([]);
    } catch {
      Alert.alert("Error", "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePickNewFiles = async () => {
    try {
      const result = await (await import("expo-document-picker")).getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
        multiple: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const combined = [...editNewFiles, ...result.assets];
        const maxMore  = 5 - (images.length - editRemoveIndexes.length);
        if (combined.length > maxMore) {
          Alert.alert("Limit", `Sirf ${maxMore} aur images add ho sakti hain.`);
          setEditNewFiles(combined.slice(0, maxMore));
        } else {
          setEditNewFiles(combined);
        }
      }
    } catch {
      Alert.alert("Error", "Could not pick files.");
    }
  };

  const toggleRemoveIndex = (idx) => {
    setEditRemoveIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const openFullscreen = (index) => {
    setFsStartIndex(index);
    setFsVisible(true);
  };

  // ── Styles ──
  const s = makeStyles(colors);

  // ── Loading ──
  if (loading && !doc) {
    return (
      <View style={s.root}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>Document Detail</Text>
          </View>
          <View style={s.headerActions} />
        </View>
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.mutedText}>Loading document…</Text>
        </View>
      </View>
    );
  }

  // ── Error ──
  if (!doc) {
    return (
      <View style={s.root}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>Document Detail</Text>
          </View>
          <View style={s.headerActions} />
        </View>
        <View style={s.center}>
          <Ionicons name="alert-circle-outline" size={52} color={colors.danger} />
          <Text style={[s.mutedText, { color: colors.danger, textAlign: "center" }]}>
            Document not found or failed to load.
          </Text>
          <TouchableOpacity onPress={() => getDocumentDetail(documentId)} activeOpacity={0.75}>
            <Text style={{ color: colors.primary, fontWeight: "700", marginTop: 8 }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const meta        = ftMeta();
  const memberColor = getMemberColor(colors, doc.memberName);
  const initials    = (doc.uploadedBy?.name ?? "?")[0].toUpperCase();

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.surface} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.headerTitle} numberOfLines={1}>{doc.documentName}</Text>
          <Text style={s.headerSubtitle}>{doc.memberName}</Text>
        </View>

        <View style={s.headerActions}>
          {/* Share — current image or doc */}
          <TouchableOpacity
            style={s.headerIconBtn}
            onPress={() => shareDocument(doc, setSharing)}
            disabled={sharing || downloading}
            activeOpacity={0.75}
          >
            {sharing
              ? <ActivityIndicator size="small" color={colors.textPrimary} />
              : <Ionicons name="share-social-outline" size={21} color={colors.textPrimary} />
            }
          </TouchableOpacity>

          {/* Download */}
          <TouchableOpacity
            style={s.headerIconBtn}
            onPress={() => downloadDocument(doc, setDownloading)}
            disabled={sharing || downloading}
            activeOpacity={0.75}
          >
            {downloading
              ? <ActivityIndicator size="small" color={colors.primary} />
              : <Ionicons name="download-outline" size={21} color={colors.primary} />
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Scroll Content ── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* ── Preview: Image Gallery or PDF ── */}
        {doc.fileType === "image" ? (
          images.length > 0 ? (
            <ImageGallery
              images={images}
              colors={colors}
              onImagePress={openFullscreen}
            />
          ) : null
        ) : (
          // PDF preview
          <View style={[s.previewContainer, { height: SH * 0.28 }]}>
            <View style={s.pdfBox}>
              <View style={[s.pdfIconCircle, { backgroundColor: `${colors.primary}18` }]}>
                <Ionicons name="document-text" size={44} color={colors.primary} />
              </View>
              <Text style={s.pdfLabel}>PDF Document</Text>
              <View style={s.pdfBtnRow}>
                <TouchableOpacity style={s.pdfBtn} onPress={() => Linking.openURL(doc.fileUrl ?? images[0]?.url)} activeOpacity={0.75}>
                  <Ionicons name="open-outline" size={14} color={colors.primary} />
                  <Text style={[s.pdfBtnText, { color: colors.primary }]}>Open PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.pdfBtn, { backgroundColor: `${colors.success}18`, borderColor: `${colors.success}50` }]}
                  onPress={() => downloadDocument(doc, setDownloading)}
                  disabled={downloading}
                  activeOpacity={0.75}
                >
                  {downloading
                    ? <ActivityIndicator size="small" color={colors.success} />
                    : <>
                        <Ionicons name="download-outline" size={14} color={colors.success} />
                        <Text style={[s.pdfBtnText, { color: colors.success }]}>Download</Text>
                      </>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── Image count strip ── */}
        {doc.fileType === "image" && images.length > 1 && (
          <View style={[s.imageStrip, { borderBottomColor: colors.border }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, padding: 10 }}>
              {images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => openFullscreen(idx)}
                  activeOpacity={0.8}
                  style={[
                    s.stripThumb,
                    { borderColor: colors.primary },
                  ]}
                >
                  <Image
                    source={{ uri: img.url }}
                    style={s.stripThumbImage}
                    resizeMode="cover"
                  />
                  <View style={[s.stripIndexBadge, { backgroundColor: `${colors.primary}CC` }]}>
                    <Text style={s.stripIndexText}>{idx + 1}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Body ── */}
        <View style={s.body}>

          {/* Title + badge */}
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Text style={s.docTitle}>{doc.documentName}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
                <View style={[s.badge, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon} size={11} color={meta.text} />
                  <Text style={[s.badgeText, { color: meta.text }]}>{doc.fileType?.toUpperCase()}</Text>
                </View>
                {images.length > 1 && (
                  <View style={[s.badge, { backgroundColor: `${colors.secondary}18` }]}>
                    <Ionicons name="images-outline" size={11} color={colors.secondary} />
                    <Text style={[s.badgeText, { color: colors.secondary }]}>{images.length} photos</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Info card */}
          <View style={s.card}>
            <View style={s.infoRow}>
              <View style={[s.infoIcon, { backgroundColor: `${memberColor}18` }]}>
                <Ionicons name="person-outline" size={18} color={memberColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Member</Text>
                <Text style={[s.infoValue, { color: memberColor }]}>{doc.memberName}</Text>
              </View>
            </View>

            <View style={s.divider} />

            <View style={s.infoRow}>
              <View style={[s.infoIcon, { backgroundColor: `${meta.text}18` }]}>
                <Ionicons name={meta.icon} size={18} color={meta.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>File Type</Text>
                <Text style={s.infoValue}>{(doc.fileType ?? "—").toUpperCase()}</Text>
              </View>
            </View>

            <View style={s.divider} />

            <View style={s.infoRow}>
              <View style={[s.infoIcon, { backgroundColor: `${colors.success}18` }]}>
                <Ionicons name="calendar-outline" size={18} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.infoLabel}>Uploaded On</Text>
                <Text style={s.infoValue}>{formatDate(doc.createdAt)}</Text>
              </View>
            </View>

            {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
              <>
                <View style={s.divider} />
                <View style={s.infoRow}>
                  <View style={[s.infoIcon, { backgroundColor: `${colors.warning}18` }]}>
                    <Ionicons name="pencil-outline" size={18} color={colors.warning} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.infoLabel}>Last Updated</Text>
                    <Text style={s.infoValue}>{formatDate(doc.updatedAt)}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Uploader card */}
          <View style={[s.card, { flexDirection: "row", alignItems: "center", gap: 14 }]}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.uploaderName}>{doc.uploadedBy?.name ?? "Unknown"}</Text>
              <Text style={s.uploaderEmail}>{doc.uploadedBy?.email ?? ""}</Text>
            </View>
            {isOwner && (
              <View style={[s.badge, { backgroundColor: `${colors.success}18`, borderColor: `${colors.success}30`, borderWidth: 1 }]}>
                <Ionicons name="shield-checkmark" size={11} color={colors.success} />
                <Text style={[s.badgeText, { color: colors.success }]}>You</Text>
              </View>
            )}
          </View>

          {/* Owner actions */}
          {isOwner && (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity style={s.editBtn} onPress={() => setEditVisible(true)} activeOpacity={0.75}>
                <Ionicons name="create-outline" size={18} color={colors.primary} />
                <Text style={[s.actionBtnText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.deleteBtn} onPress={handleDelete} activeOpacity={0.75}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
                <Text style={[s.actionBtnText, { color: colors.danger }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Edit Modal ── */}
      <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setEditVisible(false)}>
          <TouchableOpacity activeOpacity={1}>
            <View style={s.sheet}>
              <View style={s.sheetHandle} />
              <Text style={s.sheetTitle}>Edit Document</Text>

              <Text style={s.inputLabel}>Document Name</Text>
              <TextInput
                style={s.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="e.g. Aadhaar Card"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                returnKeyType="done"
              />

              <Text style={s.inputLabel}>Member</Text>
              <View style={s.memberGrid}>
                {MEMBERS.map((m) => {
                  const sel = editMember === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[s.chip, sel && { borderColor: colors.primary, backgroundColor: `${colors.primary}15` }]}
                      onPress={() => setEditMember(m)}
                      activeOpacity={0.75}
                    >
                      <Text style={[s.chipText, sel && { color: colors.primary }]}>{m}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Existing images (only for image type) */}
              {doc.fileType === "image" && images.length > 0 && (
                <>
                  <Text style={s.inputLabel}>Images (tap to mark for removal)</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {images.map((img, idx) => {
                      const marked = editRemoveIndexes.includes(idx);
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => toggleRemoveIndex(idx)}
                          activeOpacity={0.8}
                          style={[
                            editImageStyles.thumb,
                            marked && { borderColor: colors.danger, borderWidth: 2 },
                          ]}
                        >
                          <Image source={{ uri: img.url }} style={editImageStyles.thumbImg} resizeMode="cover" />
                          {marked && (
                            <View style={editImageStyles.removeOverlay}>
                              <Ionicons name="trash" size={22} color="#fff" />
                            </View>
                          )}
                          <View style={[editImageStyles.indexBadge, { backgroundColor: marked ? colors.danger : `${colors.primary}CC` }]}>
                            <Text style={editImageStyles.indexText}>{idx + 1}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                  {editRemoveIndexes.length > 0 && (
                    <Text style={[s.inputLabel, { color: colors.danger, textTransform: "none" }]}>
                      {editRemoveIndexes.length} image(s) will be removed
                    </Text>
                  )}

                  {/* Add new images button */}
                  <TouchableOpacity
                    style={[editImageStyles.addBtn, { borderColor: `${colors.primary}50`, backgroundColor: `${colors.primary}10` }]}
                    onPress={handlePickNewFiles}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
                    <Text style={[editImageStyles.addBtnText, { color: colors.primary }]}>
                      {editNewFiles.length > 0 ? `${editNewFiles.length} new file(s) selected` : "Add New Images"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
                {saving
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <>
                      <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                      <Text style={s.saveBtnText}>Save Changes</Text>
                    </>
                }
              </TouchableOpacity>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setEditVisible(false)} activeOpacity={0.75}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ── Fullscreen Gallery Modal ── */}
      {doc.fileType === "image" && images.length > 0 && (
        <FullscreenGallery
          visible={fsVisible}
          images={images}
          startIndex={fsStartIndex}
          doc={doc}
          onClose={() => setFsVisible(false)}
          colors={colors}
        />
      )}
    </View>
  );
}

// ─── Edit image thumbnail styles ──────────────────────────────────────────────
const editImageStyles = StyleSheet.create({
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
  },
  removeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(220,50,50,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  indexBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
});

// ─── Styles factory ───────────────────────────────────────────────────────────
function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },

    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: c.surface,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      gap: 10,
    },
    backBtn: {
      width: 38, height: 38,
      borderRadius: 12,
      backgroundColor: c.background,
      alignItems: "center", justifyContent: "center",
      borderWidth: 1, borderColor: c.border,
    },
    headerCenter: { flex: 1, alignItems: "center" },
    headerTitle: { fontSize: 16, fontWeight: "700", color: c.textPrimary },
    headerSubtitle: { fontSize: 12, color: c.textMuted, marginTop: 1 },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerIconBtn: {
      width: 36, height: 36,
      borderRadius: 10,
      backgroundColor: c.background,
      alignItems: "center", justifyContent: "center",
      borderWidth: 1, borderColor: c.border,
    },

    // Image strip (thumbnail row below gallery)
    imageStrip: {
      borderBottomWidth: 1,
      backgroundColor: c.surface,
    },
    stripThumb: {
      width: 60, height: 60,
      borderRadius: 10,
      overflow: "hidden",
      borderWidth: 2,
    },
    stripThumbImage: { width: "100%", height: "100%" },
    stripIndexBadge: {
      position: "absolute",
      bottom: 3, left: 3,
      width: 16, height: 16,
      borderRadius: 8,
      alignItems: "center", justifyContent: "center",
    },
    stripIndexText: { color: "#fff", fontSize: 9, fontWeight: "800" },

    // Preview
    previewContainer: {
      width: "100%",
      backgroundColor: c.surface,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    pdfBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
    pdfIconCircle: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
    pdfLabel: { fontSize: 14, color: c.textMuted },
    pdfBtnRow: { flexDirection: "row", gap: 10, marginTop: 4 },
    pdfBtn: {
      flexDirection: "row", alignItems: "center", gap: 6,
      paddingHorizontal: 16, paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: `${c.primary}15`,
      borderWidth: 1, borderColor: `${c.primary}40`,
    },
    pdfBtnText: { fontSize: 13, fontWeight: "600" },

    // Body
    body: { padding: 18, gap: 14 },
    docTitle: { fontSize: 20, fontWeight: "700", color: c.textPrimary },
    badge: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 20, alignSelf: "flex-start",
    },
    badgeText: { fontSize: 11, fontWeight: "700" },

    // Card
    card: {
      backgroundColor: c.surface, borderRadius: 18, padding: 16,
      borderWidth: 1, borderColor: c.border, gap: 12,
    },
    infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    infoIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    infoLabel: { fontSize: 11, color: c.textMuted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: "600", color: c.textPrimary },
    divider: { height: 1, backgroundColor: c.border },

    // Avatar
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: `${c.primary}20`, alignItems: "center", justifyContent: "center" },
    avatarText: { fontSize: 18, fontWeight: "700", color: c.primary },
    uploaderName: { fontSize: 14, fontWeight: "700", color: c.textPrimary },
    uploaderEmail: { fontSize: 12, color: c.textMuted, marginTop: 2 },

    // Action buttons
    editBtn: {
      flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
      gap: 8, paddingVertical: 14, borderRadius: 14,
      backgroundColor: `${c.primary}15`,
      borderWidth: 1.5, borderColor: `${c.primary}40`,
    },
    deleteBtn: {
      flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
      gap: 8, paddingVertical: 14, borderRadius: 14,
      backgroundColor: `${c.danger}12`,
      borderWidth: 1.5, borderColor: `${c.danger}40`,
    },
    actionBtnText: { fontSize: 14, fontWeight: "700" },

    // Center / loading
    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 40 },
    mutedText: { fontSize: 14, color: c.textMuted },

    // Edit modal
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 28, borderTopRightRadius: 28,
      padding: 24, gap: 14,
      borderTopWidth: 1, borderColor: c.border,
    },
    sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: c.border, alignSelf: "center", marginBottom: 4 },
    sheetTitle: { fontSize: 17, fontWeight: "700", color: c.textPrimary, textAlign: "center" },
    inputLabel: { fontSize: 11, fontWeight: "600", color: c.textMuted, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: -6 },
    input: {
      backgroundColor: c.background, borderRadius: 14, borderWidth: 1.5, borderColor: c.border,
      paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: c.textPrimary,
    },
    memberGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
      paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12,
      backgroundColor: c.background, borderWidth: 1.5, borderColor: c.border,
    },
    chipText: { fontSize: 14, fontWeight: "600", color: c.textMuted },
    saveBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center",
      gap: 8, backgroundColor: c.primary, borderRadius: 16, paddingVertical: 15,
    },
    saveBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
    cancelBtn: { alignItems: "center", paddingVertical: 10 },
    cancelBtnText: { fontSize: 14, fontWeight: "600", color: c.textMuted },
  });
}

// ─── Full-screen modal styles ─────────────────────────────────────────────────
const fs = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  topBar: {
    position: "absolute", top: 0, left: 0, right: 0,
    flexDirection: "row", alignItems: "center",
    paddingTop: 48, paddingHorizontal: 16, paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.45)", gap: 10,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  titleText: { flex: 1, color: "#fff", fontSize: 15, fontWeight: "600", textAlign: "center" },
  counterSmall: { color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center" },
  dotsWrapper: {
    position: "absolute",
    bottom: 100,
    left: 0, right: 0,
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingBottom: 34, paddingTop: 16, paddingHorizontal: 20, gap: 12,
  },
  fsBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 13, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  fsBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
