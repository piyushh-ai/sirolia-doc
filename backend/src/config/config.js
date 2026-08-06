import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.MONGO_URI ||
  !process.env.WEB_CLIENT_ID ||
  !process.env.JWT_SECRET
) {
  throw new Error("Please provide all the environment variables");
}

export const config = {
  mongoUri: process.env.MONGO_URI,
  googleClientId: process.env.WEB_CLIENT_ID,
  jwtSecret: process.env.JWT_SECRET,
};
