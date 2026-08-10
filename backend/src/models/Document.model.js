import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    documentName: { type: String, required: true, trim: true },
    normalizedName: { type: String, required: true },
    memberName: {
      type: String,
      required: true,
      enum: ["Piyush", "Dishant", "Sapna", "Santosh"],
    },

    // ── NEW: Multiple images support (image type ke liye) ──
    // Har image ka apna Cloudinary URL aur publicId
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    // ── LEGACY (backward compat): pehle wale documents ke liye ──
    // Naye documents mein bhi pehli image yahan copy hogi
    fileUrl: { type: String },
    cloudinaryPublicId: { type: String },

    fileType: { type: String, enum: ["image", "pdf"], required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Duplicate prevent karega DB level pe bhi
documentSchema.index({ normalizedName: 1, memberName: 1 }, { unique: true });

export default mongoose.model("Document", documentSchema);

