import { OAuth2Client } from "google-auth-library";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

const client = new OAuth2Client(config.googleClientId);

/**
 * POST /api/auth/google
 * Receives Google ID token from mobile app,
 * verifies it with Google, creates or fetches user,
 * and returns a signed JWT + user info.
 */
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // Verify the Google ID token against our Web Client ID
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();

    const { sub, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Email not verified by Google",
      });
    }

    // Find existing user or create new one (upsert pattern)
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        name,
        email,
        avatar: picture,
        googleId: sub,
      });
    }

    // Generate our own JWT for subsequent requests
    const jwtToken = await generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again.",
    });
  }
};

/**
 * GET /api/auth/me
 * Protected route — returns the currently authenticated user.
 * Used by the mobile app on startup to restore session.
 * req.user is set by the protect middleware.
 */
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
    });
  }
};
