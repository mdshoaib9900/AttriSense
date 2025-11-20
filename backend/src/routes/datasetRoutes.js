const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadDataset,
  getMyDataset,
  deleteMyDataset,
} = require("../controllers/datasetController");

// Upload OR Replace dataset
router.post("/upload", authMiddleware, uploadDataset);

// Get current user's dataset
router.get("/mine", authMiddleware, getMyDataset);

// Delete current user's dataset
router.delete("/mine", authMiddleware, deleteMyDataset);

module.exports = router;
