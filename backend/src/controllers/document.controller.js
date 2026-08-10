import cloudinary from "../config/cloudinary.js";
import Document from "../models/Document.model.js";
import { normalizeText } from "../utils/normalize.js";
import streamifier from "streamifier";

// ─── Helper: ek file ko Cloudinary pe upload karo (Promise-based) ─────────────
const uploadToCloudinary = (fileBuffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, type: "upload" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ─── Helper: Cloudinary se ek image delete karo ───────────────────────────────
const deleteFromCloudinary = async (publicId, resourceType) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary delete failed:", publicId, err.message);
  }
};

// ─── CREATE DOCUMENT ─────────────────────────────────────────────────────────
export const createDocument = async (req, res) => {
  try {
    const { documentName, memberName } = req.body;
    const files = req.files; // array (upload.array se)

    if (!documentName || !memberName || !files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "documentName, memberName, and at least one file are required" });
    }

    const formattedMemberName =
      memberName.charAt(0).toUpperCase() + memberName.slice(1).toLowerCase();

    const normalizedName = normalizeText(documentName);

    // Duplicate check
    const existing = await Document.findOne({ normalizedName, memberName: formattedMemberName });
    if (existing) {
      return res.status(409).json({
        message: `${documentName} is already uploaded for ${formattedMemberName}`,
      });
    }

    // File type — pehli file se determine karo
    const firstFile = files[0];
    const fileType = firstFile.mimetype === "application/pdf" ? "pdf" : "image";
    const resourceType = fileType === "pdf" ? "raw" : "image";
    const folder = `family-docs/${formattedMemberName}`;

    // PDF ke liye sirf pehli file, image ke liye sab
    const filesToUpload = fileType === "pdf" ? [firstFile] : files;

    // Sab files Cloudinary pe upload karo (parallel)
    const uploadResults = await Promise.all(
      filesToUpload.map((f) => uploadToCloudinary(f.buffer, folder, resourceType))
    );

    // images array banao
    const images = uploadResults.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
    }));

    // Pehli image primary field mein bhi store karo (backward compat)
    const document = await Document.create({
      documentName,
      normalizedName,
      memberName: formattedMemberName,
      images,
      fileUrl: images[0].url,
      cloudinaryPublicId: images[0].publicId,
      fileType,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ message: "Document uploaded successfully", document });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Document already exists (duplicate)" });
    }
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// ─── GET ALL DOCUMENTS ────────────────────────────────────────────────────────
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });
    if (documents.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }
    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch documents", error: error.message });
  }
};

// ─── GET MY DOCUMENTS ─────────────────────────────────────────────────────────
export const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user._id });
    if (documents.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }
    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch documents", error: error.message });
  }
};

// ─── DELETE DOCUMENT ─────────────────────────────────────────────────────────
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this document" });
    }

    await Document.findByIdAndDelete(id);

    const resourceType = document.fileType === "pdf" ? "raw" : "image";

    // Naye format mein images array se delete karo
    if (document.images && document.images.length > 0) {
      await Promise.all(
        document.images.map((img) => deleteFromCloudinary(img.publicId, resourceType))
      );
    } else if (document.cloudinaryPublicId) {
      // Legacy single-file document
      await deleteFromCloudinary(document.cloudinaryPublicId, resourceType);
    }

    res.status(200).json({ message: "Document deleted successfully", document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete document", error: error.message });
  }
};

// ─── EDIT DOCUMENT ────────────────────────────────────────────────────────────
export const editDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentName, memberName, removeImageIndexes } = req.body;
    // removeImageIndexes — comma-separated string of indexes to remove, e.g. "0,2"
    const files = req.files || [];

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this document" });
    }

    // ── Name update ──
    let updatedMemberName = document.memberName;
    if (memberName) {
      updatedMemberName = memberName.charAt(0).toUpperCase() + memberName.slice(1).toLowerCase();
    }

    let updatedDocumentName = document.documentName;
    let updatedNormalizedName = document.normalizedName;
    if (documentName) {
      updatedDocumentName = documentName;
      updatedNormalizedName = normalizeText(documentName);
    }

    // Duplicate check
    if (updatedNormalizedName !== document.normalizedName || updatedMemberName !== document.memberName) {
      const existing = await Document.findOne({
        normalizedName: updatedNormalizedName,
        memberName: updatedMemberName,
      });
      if (existing && existing._id.toString() !== id) {
        return res.status(409).json({
          message: `Document with name "${updatedDocumentName}" is already uploaded for ${updatedMemberName}`,
        });
      }
    }

    const resourceType = document.fileType === "pdf" ? "raw" : "image";
    const folder = `family-docs/${updatedMemberName}`;

    // ── Existing images list (normalize: legacy docs mein images[] nahi hoga) ──
    let currentImages = document.images?.length > 0
      ? [...document.images]
      : document.fileUrl
        ? [{ url: document.fileUrl, publicId: document.cloudinaryPublicId }]
        : [];

    // ── Remove images by index (agar user ne hatane ko kaha) ──
    if (removeImageIndexes) {
      const indexesToRemove = String(removeImageIndexes)
        .split(",")
        .map((i) => parseInt(i.trim(), 10))
        .filter((i) => !isNaN(i));

      // Cloudinary se delete karo
      await Promise.all(
        indexesToRemove
          .filter((i) => currentImages[i])
          .map((i) => deleteFromCloudinary(currentImages[i].publicId, resourceType))
      );

      // Array se hata do (reverse order mein splice)
      indexesToRemove
        .sort((a, b) => b - a)
        .forEach((i) => {
          if (i >= 0 && i < currentImages.length) currentImages.splice(i, 1);
        });
    }

    // ── Naye files upload karo ──
    if (files.length > 0) {
      // PDF ke liye sirf ek file allow
      const filesToUpload = document.fileType === "pdf" ? [files[0]] : files;

      const uploadResults = await Promise.all(
        filesToUpload.map((f) => uploadToCloudinary(f.buffer, folder, resourceType))
      );

      const newImages = uploadResults.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
      currentImages = [...currentImages, ...newImages];
    }

    // ── Update document ──
    document.documentName = updatedDocumentName;
    document.normalizedName = updatedNormalizedName;
    document.memberName = updatedMemberName;
    document.images = currentImages;

    // Primary fields sync karo (pehli image)
    if (currentImages.length > 0) {
      document.fileUrl = currentImages[0].url;
      document.cloudinaryPublicId = currentImages[0].publicId;
    }

    await document.save();

    res.status(200).json({ message: "Document updated successfully", document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update document", error: error.message });
  }
};

// ─── GET DOCUMENT DETAIL ──────────────────────────────────────────────────────
export const getDocumentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id).populate("uploadedBy", "name email");
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Legacy docs ke liye images array normalize karo (response mein)
    const doc = document.toObject();
    if (!doc.images || doc.images.length === 0) {
      if (doc.fileUrl) {
        doc.images = [{ url: doc.fileUrl, publicId: doc.cloudinaryPublicId }];
      } else {
        doc.images = [];
      }
    }

    res.status(200).json({ document: doc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch document", error: error.message });
  }
};