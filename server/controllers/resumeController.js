import Resume from "../models/Resume.js";
import User from "../models/User.js";
import path from "path";
import { getFileHash } from "../utils/hash.js";
import fs from "fs";

export const getResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user.id }).sort({ version: -1 });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json({
            message: "Resume fetched successfully",
            resumeUrl: resume.path,
            fileName: resume.originalName,
            version: resume.version,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const uploadResume = async (req, res) => {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const userId = req.user.id;
    const filePath = req.file.path;
    const fileHash = getFileHash(filePath);

    try {
        const duplicate = await Resume.findOne({ user: userId, fileHash });

        if (duplicate) {
            fs.unlinkSync(filePath); // Cleanup
            return res.status(409).json({ msg: "You've already uploaded this exact resume." });
        }

        const latest = await Resume.findOne({ user: userId }).sort({ version: -1 });
        const nextVersion = latest ? latest.version + 1 : 1;

        const newResume = await Resume.create({
            user: userId,
            path: filePath,
            originalName: req.file.originalname,
            fileHash,
            version: nextVersion,
        });

        res.status(200).json({
            msg: "Resume uploaded successfully",
            resumeUrl: newResume.path,
            version: nextVersion,
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error: " + err.message });
    }
};

export const updateResume = async (req, res) => {
    try {

        // get user from jwt token
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const existing = await Resume.findOne({ user: req.user._id });

        if (!existing) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Delete the old file from storage
        if (fs.existsSync(existing.path)) {
            fs.unlinkSync(existing.path);
        }

        // Update with new file
        existing.path = req.file.path;
        existing.originalName = req.file.originalname;
        await existing.save();

        res.json({ message: "Resume updated successfully", resume: existing });
    } catch (error) {
        console.error("Error updating resume:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ user: req.user._id }); st

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // Delete the file from storage
        if (fs.existsSync(resume.path)) {
            fs.unlinkSync(resume.path);
        }

        await Resume.deleteOne({ user: req.user._id });

        res.json({ message: "Resume deleted successfully" });
    } catch (error) {
        console.error("Error deleting resume:", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id }).sort({ version: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
