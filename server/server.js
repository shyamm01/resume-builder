import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js"

import authRoutes from "./routes/authRoutes.js"
import resumeRoutes from "./routes/resumeRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();


app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173", ""],
    credentials: true,
}));

app.use(express.json());
app.use("/api/uploads", express.static("uploads"));
app.get('/api/uploads/:filename', (req, res) => {
    const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
    res.download(filePath);
});


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", adminRoutes);

// API Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
