// routes/userRoutes.js
import express from "express";
import { updateUserTheme } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/theme", protect, updateUserTheme);

export default router;
