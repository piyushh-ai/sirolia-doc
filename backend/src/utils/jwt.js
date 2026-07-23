import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateToken = async (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: "30d" });
};
