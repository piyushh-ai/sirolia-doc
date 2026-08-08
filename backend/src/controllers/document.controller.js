import cloudinary from "../config/cloudinary.js";
import Document from "../models/Document.model.js";
import { normalizeText } from "../utils/normalize.js";
import streamifier from "streamifier";

export const createDocument = async (req, res) => {
  try {
    const { documentName, memberName } = req.body;
    const file = req.file;

    if (!documentName || !memberName || !file) {
      return res
        .status(400)
        .json({ message: "documentName, memberName, and file are required" });
    }

    // Capitalize the first letter of memberName to match the enum (e.g. "piyush" -> "Piyush")
    const formattedMemberName =
      memberName.charAt(0).toUpperCase() + memberName.slice(1).toLowerCase();

    const normalizedName = normalizeText(documentName);

    // Duplicate check
    const existing = await Document.findOne({
      normalizedName,
      memberName: formattedMemberName,
    });
    if (existing) {
      return res.status(409).json({
        message: `${documentName} is already uploaded for ${formattedMemberName}`,
      });
    }

    // Cloudinary upload (stream from buffer)
    const fileType = file.mimetype === "application/pdf" ? "pdf" : "image";

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `family-docs/${formattedMemberName}`,
          resource_type: fileType === "pdf" ? "raw" : "image",
          type: "authenticated", // private access, signed URL will be required
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    const document = await Document.create({
      documentName,
      normalizedName,
      memberName: formattedMemberName,
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      fileType,
      uploadedBy: req.user._id,
    });

    res
      .status(201)
      .json({ message: "Document uploaded successfully", document });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Document already exists (duplicate)" });
    }
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

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
    res
      .status(500)
      .json({ message: "Failed to fetch documents", error: error.message });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user._id });
    if (documents.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }
    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch documents", error: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // Find document first to check ownership
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Verify if the logged-in user is the owner who uploaded this document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this document" });
    }

    // Proceed to delete
    await Document.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(document.cloudinaryPublicId);

    res
      .status(200)
      .json({ message: "Document deleted successfully", document });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete document", error: error.message });
  }
};

export const editDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentName, memberName } = req.body;
    const file = req.file;

    // Find the document first
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Verify if the logged-in user is the owner
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this document" });
    }

    // Prepare updated fields
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

    // Duplicate check if name or member is updated
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

    // If new file is uploaded, update it on Cloudinary and replace URL
    if (file) {
      const fileType = file.mimetype === "application/pdf" ? "pdf" : "image";

      // Upload new file
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `family-docs/${updatedMemberName}`,
            resource_type: fileType === "pdf" ? "raw" : "image",
            type: "authenticated",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      // Delete old file from Cloudinary
      if (document.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(document.cloudinaryPublicId);
      }

      document.fileUrl = uploadResult.secure_url;
      document.cloudinaryPublicId = uploadResult.public_id;
      document.fileType = fileType;
    }

    // Update textual fields
    document.documentName = updatedDocumentName;
    document.normalizedName = updatedNormalizedName;
    document.memberName = updatedMemberName;

    await document.save();

    res.status(200).json({ message: "Document updated successfully", document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update document", error: error.message });
  }
};

export const getDocumentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id).populate("uploadedBy", "name email");
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch document", error: error.message });
  }
}