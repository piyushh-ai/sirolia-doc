import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  console.error("PORT not found");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not found");
  process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID) {
  console.error("GOOGLE_CLIENT_ID not found");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET not found");
  process.exit(1);
}

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("CLOUDINARY_CLOUD_NAME not found");
  process.exit(1);
}

if (!process.env.CLOUDINARY_API_KEY) {
  console.error("CLOUDINARY_API_KEY not found");
  process.exit(1);
}

if (!process.env.CLOUDINARY_API_SECRET) {
  console.error("CLOUDINARY_API_SECRET not found");
  process.exit(1);
}

export const config = {
  port: process.env.PORT,
  mongodb_uri: process.env.MONGO_URI,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  jwtSecret: process.env.JWT_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
