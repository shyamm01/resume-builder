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

