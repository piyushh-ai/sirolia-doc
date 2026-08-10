import express from "express";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createDocument,
  getAllDocuments,
  getMyDocuments,
  deleteDocument,
  editDocument,
  getDocumentDetail,
} from "../controllers/document.controller.js";

const router = express.Router();

// Multiple files (images) — max 5. PDF bhi ek file ke roop mein aata hai
router.post("/create", authMiddleware, upload.array("files", 5), createDocument);

router.get("/all", authMiddleware, getAllDocuments);

router.get("/my-documents", authMiddleware, getMyDocuments);

router.delete("/delete/:id", authMiddleware, deleteDocument);

// Edit mein bhi multiple files support
router.put("/edit/:id", authMiddleware, upload.array("files", 5), editDocument);

router.get("/:id", authMiddleware, getDocumentDetail);

export default router;

