const Dataset = require("../models/Datasets.js"); // Ensure extension is correct for your project
const supabase = require("../supabaseClient");

// Helper function to extract storage path from URL
// Fixes the bug where spaces (%20) prevented deletion
const getStoragePathFromUrl = (fullUrl) => {
  try {
    // 1. Split by the bucket name to find the relative path
    // format: https://xyz.supabase.co/.../public/datasets/1234-file.csv
    const pathPart = fullUrl.split("/datasets/")[1];
    
    if (!pathPart) return null;

    // 2. CRITICAL FIX: Decode the URL (e.g., turns "my%20file.csv" back into "my file.csv")
    return decodeURIComponent(pathPart);
  } catch (err) {
    console.error("Error parsing URL:", err);
    return null;
  }
};

// Upload or Replace Dataset
const uploadDataset = async (req, res) => {
  try {
    // Ensure req.user exists (middleware should handle this)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { fileName, firebaseURL, rows, columns } = req.body; // Note: variable is named firebaseURL but holds Supabase URL

    if (!fileName || !firebaseURL || !rows || !columns) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if this user already has a dataset
    const existing = await Dataset.findOne({ userId });

    if (existing) {
      // --- BUG FIX START ---
      const oldFilePath = getStoragePathFromUrl(existing.firebaseURL);

      if (oldFilePath) {
        const { error: deleteError } = await supabase.storage
          .from("datasets")
          .remove([oldFilePath]); // Now passing the decoded, correct path

        if (deleteError) {
          console.error("Supabase delete warning (old file):", deleteError);
          // We don't return 500 here; we allow the new upload to proceed even if old delete failed
          // but logging it is important.
        } else {
          console.log("Old file deleted from storage:", oldFilePath);
        }
      }
      // --- BUG FIX END ---

      // Delete old metadata from MongoDB
      await Dataset.deleteOne({ userId });
    }

    // Create new record
    const dataset = await Dataset.create({
      userId,
      fileName,
      firebaseURL,
      rows,
      columns,
    });

    return res.status(201).json({
      message: existing
        ? "Dataset replaced successfully"
        : "Dataset uploaded successfully",
      dataset,
    });

  } catch (error) {
    console.error("Dataset upload error:", error);
    return res.status(500).json({ message: "Server error during upload" });
  }
};

// Get the logged-in user's dataset
const getMyDataset = async (req, res) => {
  try {
    const userId = req.user.id;

    const dataset = await Dataset.findOne({ userId });
    
    if (!dataset) {
      return res.status(200).json({ dataset: null }); 
    }

    return res.status(200).json({ dataset }); 

  } catch (error) {
    console.error("Get dataset error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete the logged-in user's dataset
const deleteMyDataset = async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await Dataset.findOne({ userId });
    if (!existing) {
      return res.status(404).json({ message: "No dataset to delete" });
    }

    // --- BUG FIX START ---
    const filePath = getStoragePathFromUrl(existing.firebaseURL);

    if (filePath) {
      const { error } = await supabase.storage
        .from("datasets")
        .remove([filePath]);

      if (error) {
        console.error("Supabase delete failed:", error);
        return res.status(500).json({ message: "Failed to delete file from storage" });
      }
    } else {
      console.warn("Could not parse file path from URL, deleting metadata only.");
    }
    // --- BUG FIX END ---

    // Delete from MongoDB
    await Dataset.deleteOne({ userId });

    return res.status(200).json({ message: "Dataset deleted successfully" });

  } catch (error) {
    console.error("Delete dataset error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  uploadDataset,
  getMyDataset,
  deleteMyDataset,
};