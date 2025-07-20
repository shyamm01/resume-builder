import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ msg: "Registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // ensures HTTPS in production
            sameSite: "Strict", // prevent CSRF (adjust as per your frontend needs)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                theme: user.theme,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};


export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    res.json({ msg: "Logged out successfully" });
};


export const getMe = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json(req.user);
};