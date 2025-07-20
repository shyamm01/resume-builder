import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadPath = path.join("uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Utility to calculate SHA256 hash of a file
const getFileHash = (filePath) => {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(buffer).digest("hex");
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export { upload, getFileHash, uploadPath };
