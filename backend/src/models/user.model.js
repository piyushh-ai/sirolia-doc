import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    memberName: {
      type: String,
      required: true,
      enum: ["Piyush", "Dishant", "Sapna", "Santosh"],
    },
    photo: { type: String },
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
