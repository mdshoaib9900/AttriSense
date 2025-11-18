const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working" });
});

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
