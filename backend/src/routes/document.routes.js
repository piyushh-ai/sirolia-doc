import express from "express";
import { createDocument } from "../controllers/document.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();
/**
 * POST /api/documents/create-document
 * Protected route — creates a new document.
 */
router.post("/create-document", protect, upload.single("file"), createDocument);

export default router;
