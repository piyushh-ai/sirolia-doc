import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "backend is running..." });
});

// invalid route
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Invalid route" });
});


export default app;
