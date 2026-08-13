import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/document.route.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/document", documentRoutes);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "backend is running..." });
});

// ── App version / update check (public — no auth required) ───────────────────
const APP_VERSION_INFO = {
  latestVersion: "1.0.1",
  apkUrl: "https://drive.google.com/file/d/1NbOU4NqxsDBkACIvLoSDOmMYhrh5ynaZ/view?usp=sharing",
  forceUpdate: false,
  releaseNotes: "Bug fixes and share feature added",
};

app.get("/api/version", (req, res) => {
  res.status(200).json(APP_VERSION_INFO);
});

// invalid route
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Invalid route" });
});


export default app;
