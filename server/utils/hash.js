// utils/hash.js
import fs from "fs";
import crypto from "crypto";

export const getFileHash = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};
export const isFileChanged = (filePath, existingHash) => {
    const newHash = getFileHash(filePath);
    return newHash !== existingHash;
};