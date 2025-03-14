const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use environment variables in production

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const tokenToVerify = token.startsWith("Bearer ") ? token.slice(7) : token;
        const decoded = jwt.verify(tokenToVerify, JWT_SECRET);
        console.log("Decoded JWT:", decoded);  // Ensure that the decoded JWT has the correct userId
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(400).json({ message: "Invalid or expired token." });
    }
};



// Middleware to check role
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Access denied. Unauthorized role." });
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRole };
