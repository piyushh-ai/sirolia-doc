import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { ALLOWED_MEMBERS } from "../config/allowedMembers.js";
import userModel from "../models/user.model.js";
import { config } from "../config/config.js";

const client = new OAuth2Client(config.googleClientId);

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "idToken required" });

    // Step 1: Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Step 2: Whitelist check
    const allowedMember = ALLOWED_MEMBERS.find((m) => m.email === email);
    if (!allowedMember) {
      return res.status(403).json({ message: 'Access Denied - not a family member' });
    }

    // Step 3: Find or create user in MongoDB
    let user = await userModel.findOne({ googleId });
    if (!user) {
      user = await userModel.create({
        googleId,
        email,
        name,
        photo: picture,
        memberName: allowedMember.memberName,
      });
    }

    // Step 4: Generate our own JWT
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        memberName: user.memberName,
        photo: user.photo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

export const getMeController = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      memberName: user.memberName,
      photo: user.photo,
    },
  });
};
