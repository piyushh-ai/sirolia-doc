import fs from "fs";
import Document from "../models/doc.model.js";
import cloudinary from "../config/cloudinary.js";

export const createDocument = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      // Clean up the uploaded file if there's an error
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // Upload to Cloudinary
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto", // Allows pdf and images automatically
        folder: "sirolia-docs",
      });
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      fs.unlinkSync(req.file.path);
      return res.status(500).json({
        success: false,
        message: "Failed to upload file to Cloudinary",
      });
    }

    // Clean up local temp file after successful upload
    fs.unlinkSync(req.file.path);

    const document = await Document.create({
      title,
      category,
      fileUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      uploadedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Create Document Error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
