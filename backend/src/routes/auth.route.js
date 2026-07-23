import express from "express";
import { googleLogin, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/auth/google
// Accepts Google ID token from the mobile app,
// verifies it, creates/fetches user, returns JWT
router.post("/google", googleLogin);

// GET /api/auth/me
// Protected route: verifies JWT and returns current user data
// Used by mobile app on startup to restore session
router.get("/me", protect, getMe);

export default router;
