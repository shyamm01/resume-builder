import Resume from "../models/Resume.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }, "-password"); // exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching users" });
    }
};

export const approveUserResume = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );
        res.json({ msg: "User approved", user });
    } catch (err) {
        res.status(500).json({ msg: "Approval failed" });
    }
};

export const assignUserTheme = async (req, res) => {
    const { theme } = req.body;
    if (!["light", "dark"].includes(theme)) {
        return res.status(400).json({ msg: "Invalid theme" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { theme },
            { new: true }
        );
        res.json({ msg: "Theme updated", user });
    } catch (err) {
        res.status(500).json({ msg: "Failed to update theme" });
    }
};

export const getAllUsersWithResume = async (req, res) => {
    try {
        const admin = await User.findById(req.user.id, "-password");
        if (admin.role !== "admin") {
            return res.status(403).json({ msg: "Access denied" });
        }
        // console.log("Fetched user with resume:", user);
        const usersWithResumes = await User.aggregate([
            {
                $lookup: {
                    from: "resumes",
                    localField: "_id",
                    foreignField: "user",
                    as: "resumeData",
                },
            },
            { $match: { "resumeData.0": { $exists: true } } },
            { $project: { password: 0 } },
        ]);
        res.json({ usersWithResumes });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching users with resumes" });
    }
};

export const getUserResumes = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, "-password");
        console.log("Fetching resumes for user:", user);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Fetch resumes for the user latest first
        const resumes = await Resume.find({ user: user._id }).sort({ uploadedAt: -1 });
        res.json({ user, resumes });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching resumes" });
    }
};
export const getUsersResume = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, "-password");
        console.log("Fetching resumes for user:", user);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Fetch resumes for the user
        const resume = await Resume.findOne({ user: user._id, _id: req.params.resumeId });
        res.json({ user, resume });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching resumes" });
    }
};

export const updateUserResumeStatus = async (req, res) => {

    try {
        const status = req.params.status; // "approve" or "reject"
        const resumeId = req.params.resumeId;
        const userId = req.params.userId;
        if (!["approve", "reject"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }
        const resume = await Resume.findByIdAndUpdate(
            req.params.resumeId,
            { resumeStatus: status },
            { new: true }
        );
        if (!resume) {
            return res.status(404).json({ msg: "Resume not found" });
        }
        res.json({ msg: `Resume ${status} successfully`, resume });
    } catch (err) {
        res.status(500).json({ msg: "Failed to update resume status" });
    }
}
