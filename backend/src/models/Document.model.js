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
    fileUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
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
