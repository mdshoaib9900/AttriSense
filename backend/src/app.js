const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const datasetRoutes = require("./routes/datasetRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/datasets", datasetRoutes);


module.exports = app;
