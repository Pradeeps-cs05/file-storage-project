require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/fileRoutes");
const path = require("path");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/files", require("./routes/fileRoutes"));

// Serve React static files
app.use(express.static(path.join(__dirname, "../client/build")));

// Catch-all handler
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});