import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
    getAllUsers,
    approveUserResume,
    assignUserTheme,
    getAllUsersWithResume,
    getUserResumes,
    getUsersResume,
    updateUserResumeStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.get("/users-with-resumes", protect, isAdmin, getAllUsersWithResume);
router.put("/approve/:id", protect, isAdmin, approveUserResume);
router.put("/theme/:id", protect, isAdmin, assignUserTheme);
router.get("/resumes/:userId", protect, isAdmin, getUserResumes);
router.get("/resumes/:userId/:resumeId", protect, isAdmin, getUsersResume);
router.put("/resumes/:userId/:resumeId/:status", protect, isAdmin, updateUserResumeStatus);

export default router;
