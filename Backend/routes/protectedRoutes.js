const express = require("express");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/admin", authenticateUser, authorizeRole("admin"), (req, res) => {
    res.json({ message: "Welcome Admin!" });
});

router.get("/artist", authenticateUser, authorizeRole("artist"), (req, res) => {
    res.json({ message: "Welcome Artist!" });
});

router.get("/user", authenticateUser, (req, res) => {
    res.json({ message: "Welcome User!" });
});

module.exports = router;
