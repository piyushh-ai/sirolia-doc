import express from "express";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createDocument,
  getAllDocuments,
  getMyDocuments,
  deleteDocument,
  editDocument,
} from "../controllers/document.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("file"), createDocument);

router.get("/all", authMiddleware, getAllDocuments);

router.get("/my-documents", authMiddleware, getMyDocuments);

router.delete("/delete/:id", authMiddleware, deleteDocument);

router.put("/edit/:id", authMiddleware, upload.single("file"), editDocument);

export default router;
