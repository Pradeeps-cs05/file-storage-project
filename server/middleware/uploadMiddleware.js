const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000 * 1024 * 1024 } // 10GB limit
});

module.exports = upload;