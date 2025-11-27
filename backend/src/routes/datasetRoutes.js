const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadDataset,
  getMyDataset,
  deleteMyDataset,
  analyzeDataset,
  getAllRows
} = require("../controllers/datasetController");

// Upload OR Replace dataset
router.post("/upload", authMiddleware, uploadDataset);

// Get current user's dataset
router.get("/mine", authMiddleware, getMyDataset);

// Delete current user's dataset
router.delete("/mine", authMiddleware, deleteMyDataset);
//retrive and analyze dataset from supabse
router.get("/analyze", authMiddleware, analyzeDataset);
router.get("/rows", authMiddleware, getAllRows);


module.exports = router;
