const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// ==============================
// 📤 Upload File
// ==============================
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const File =require("../models/File.js");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileName = Date.now() + "-" + req.file.originalname;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    const newFile = await File.create({
      filename: req.file.originalname,
      fileUrl,
      storagePath: fileName,
    });

    res.status(201).json({
      success: true,
      message: "Uploaded to S3",
      data: newFile,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

// ==============================
// 📂 Get All Files
// ==============================
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ uploadDate: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fetching files failed",
      error: error.message,
    });
  }
};

// ==============================
// 🔗 Get Download URL (Presigned)
// ==============================
exports.getDownloadUrl = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.storagePath,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    res.json({ success: true, url });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Download failed" });
  }
};
// ==============================
// 🗑 Delete File
// ==============================
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.storagePath,
      })
    );

    await file.deleteOne();

    res.json({ success: true, message: "File deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};