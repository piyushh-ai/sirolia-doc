import mongoose from "mongoose";
import dns from "dns";
import { config } from "./config.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const connectDb = async () => {
  await mongoose
    .connect(config.mongodb_uri)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Error while connecting to DB", error.message);
      process.exit(1);
    });
};

export default connectDb;
