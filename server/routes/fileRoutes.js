const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  uploadFile,
  getAllFiles,
  downloadFile,
  deleteFile
} = require("../controllers/fileController");

// Upload
router.post("/upload", upload.single("file"), uploadFile);

// Download (specific route first)
router.get("/:id/download", downloadFile);

// Delete
router.delete("/:id", deleteFile);

// Get all files
router.get("/", getAllFiles);

module.exports = router;