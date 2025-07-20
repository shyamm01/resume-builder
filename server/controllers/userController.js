import User from "../models/User.js";

export const updateUserTheme = async (req, res) => {
    const { theme } = req.body;

    if (!["light", "dark"].includes(theme)) {
        return res.status(400).json({ message: "Invalid theme value." });
    }

    try {
        const user = await User.findById(req.user.id);
        console.log("Updating theme for user:", user);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Optional: verify user owns this account if needed
        if (req.user.id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        user.theme = theme;
        await user.save();

        res.status(200).json({ message: "Theme updated", theme: user.theme });
    } catch (err) {
        console.error("Update theme error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
