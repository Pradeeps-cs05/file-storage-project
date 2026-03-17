const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  uploadFile,
  getAllFiles,
  getDownloadUrl,
  deleteFile
} = require("../controllers/fileController");

// Upload
router.post("/upload", upload.single("file"), uploadFile);
// Get all files
router.get("/", getAllFiles);
// Get download URL
router.get("/download/:id", getDownloadUrl);
// Delete file
router.delete("/:id", deleteFile);

module.exports = router;
