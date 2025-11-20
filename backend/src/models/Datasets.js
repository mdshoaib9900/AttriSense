const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    firebaseURL: { type: String, required: true },
    rows: { type: Number, required: true },
    columns: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dataset", datasetSchema);
