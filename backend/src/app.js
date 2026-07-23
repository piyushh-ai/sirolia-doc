import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/auth.route.js";
import documentRoutes from "./routes/document.routes.js";
import morgan from "morgan";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"))

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Sirolia's Documents API Running 🚀"
    });
});

app.use("/api/auth", userRouter)
app.use("/api/documents", documentRoutes);


export default app;