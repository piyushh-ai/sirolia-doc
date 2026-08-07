import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { makeHomeStyles } from "../styles/homePage.styles";

const MEMBER_COLOR_MAP = {
  Piyush: "memberPiyush",
  Dishant: "memberDishant",
  Sapna: "memberSapna",
  Santosh: "memberSantosh",
};

const DocumentCard = ({ document, onPress }) => {
  const { colors } = useTheme();
  const styles = makeHomeStyles(colors);

  const { documentName, memberName, fileType, fileUrl, createdAt, uploadedBy } = document;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const memberColorKey = MEMBER_COLOR_MAP[memberName];
  const badgeColor = memberColorKey ? colors[memberColorKey] : colors.primary;
  const isPdf = fileType === "pdf";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Thumbnail */}
      <View style={styles.thumbContainer}>
        {!isPdf && fileUrl ? (
          <Image source={{ uri: fileUrl }} style={styles.thumbImage} resizeMode="cover" />
        ) : (
          <Ionicons
            name={isPdf ? "document-text-outline" : "image-outline"}
            size={26}
            color={colors.textMuted}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.cardDocName} numberOfLines={1}>
          {documentName}
        </Text>

        <View style={styles.cardMemberRow}>
          <View style={[styles.memberBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.memberBadgeText}>{memberName}</Text>
          </View>
        </View>

        <View style={styles.cardMetaRow}>
          <Ionicons name="calendar-outline" size={11} color={colors.textMuted} />
          <Text style={styles.cardMeta}> {formatDate(createdAt)}</Text>
          {uploadedBy?.name && (
            <>
              <Text style={styles.cardMetaDot}> · </Text>
              <Ionicons name="person-outline" size={11} color={colors.textMuted} />
              <Text style={styles.cardMeta}> {uploadedBy.name}</Text>
            </>
          )}
        </View>
      </View>

      {/* Arrow */}
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

export default DocumentCard;
