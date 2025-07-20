import express from "express";
import { deleteResume, getResume, updateResume, uploadResume } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("", protect, getResume);
router.post("", protect, upload.single("resume"), uploadResume);
router.put("/:resumeId", protect, upload.single("resume"), updateResume);
router.delete("/:resumeId", protect, deleteResume);

export default router;
