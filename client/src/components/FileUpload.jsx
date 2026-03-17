import { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/files";

function FileUpload({ refreshFiles }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const cancelTokenSource = useRef(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setProgress(0);

      cancelTokenSource.current = axios.CancelToken.source();

      await axios.post(`${API_URL}/upload`, formData, {
  cancelToken: cancelTokenSource.current.token,

  onUploadProgress: (progressEvent) => {
    const percent = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );

    if (percent >= 100) {
      setProgress(100);
    } else {
      setProgress(percent);
    }
  },
});

      toast.success("Upload completed 🎉");
      refreshFiles();
      setFile(null);
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.info("Upload cancelled ❌");
      } else {
        toast.error("Upload failed ❌");
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleCancel = () => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="bg-gray-800/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl mb-10 flex flex-col gap-6 border border-gray-700"
    >
      <label className="w-full flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-blue-500 transition">
        <span className="text-gray-300 text-lg">
          {file ? file.name : "Click to choose a file"}
        </span>

        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full">
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Uploading... {progress}%
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-semibold transition disabled:opacity-50"
        >
          {uploading
            ? progress === 100
            ? "Processing..."
            : `Uploading ${progress}%`
            : "Upload File"}
        </button>

        {uploading && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default FileUpload;