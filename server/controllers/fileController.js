const supabase = require("../config/supabase");
const File = require("../models/File");

// ==============================
// 📤 Upload File
// ==============================
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Unique storage file name
    const storagePath = `${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) {
      return res.status(500).json({
        success: false,
        message: "File upload to Supabase failed",
        error: uploadError.message,
      });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData.publicUrl;

    // Save to MongoDB
    const newFile = await File.create({
      filename: req.file.originalname,
      fileUrl,
      storagePath,   // 🔥 IMPORTANT
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: newFile,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
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
// ⬇️ Download File
// ==============================
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Redirect to Supabase public URL
    res.redirect(file.fileUrl);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Download failed",
      error: error.message,
    });
  }
};

// ==============================
// 🗑 Delete File
// ==============================
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    console.log("Deleting from Supabase:", file.storagePath);

    // Delete from Supabase storage
    const { error: deleteError } = await supabase.storage
      .from("uploads")
      .remove([file.storagePath]);

    if (deleteError) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete from Supabase",
        error: deleteError.message,
      });
    }

    // Delete from MongoDB
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};