import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token =
        req.cookies.token ||
        req.headers.authorization?.split(" ")[1];

    console.log("Token from cookie:", token);

    if (!token) return res.status(401).json({ msg: "No token, auth denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token invalid" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Admin access only" });
    }
    next();
};
