const jwt = require("jsonwebtoken");

// Ensure JWT_SECRET is defined (same approach as in authRoute.js)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("Error: JWT_SECRET is not defined in the .env file.");
    // Not exiting here to prevent server crash, but this is a critical error
}

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
    
    console.log("Authenticating request with token:", token ? "Token present" : "No token");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const tokenToVerify = token.startsWith("Bearer ") ? token.slice(7) : token;
        console.log("Verifying token");
        
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
        console.log(`Checking role: required=${role}, user has=${req.user.role}`);
        
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Access denied. Unauthorized role." });
        }
        
        console.log("Role authorized");
        next();
    };
};

module.exports = { authenticateUser, authorizeRole };