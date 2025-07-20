// models/Resume.js
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    path: { type: String, required: true },
    originalName: { type: String },
    fileHash: { type: String, required: true },
    version: { type: Number, default: 1 },
    isApproved: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", resumeSchema);
