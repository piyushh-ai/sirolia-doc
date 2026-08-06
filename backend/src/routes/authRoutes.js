import express from "express";
import { googleLogin, getMeController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/google", googleLogin);

router.get("/get-me", authMiddleware, getMeController);

export default router;
