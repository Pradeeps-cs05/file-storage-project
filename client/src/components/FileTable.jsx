import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://api.pradeeptech.online/api/files";
function FileTable({ files, refreshFiles }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [progress, setProgress] = useState(0);

 const handleDownload = async (id, filename) => {
  try {
    setDownloadingId(id);
    setProgress(0);

    const res = await axios.get(`${API_URL}/download/${id}`);
    const downloadUrl = res.data.url;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download completed 🎉");

  } catch (error) {
    console.error(error);
    toast.error("Download failed ❌");
  } finally {
    setDownloadingId(null);
    setProgress(0);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      refreshFiles();
      toast.success("File deleted successfully 🗑️");
    } catch (error) {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <table className="w-full text-left text-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4">Filename</th>
            <th className="p-4">Upload Date</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {files.map((file) => (
            <tr
              key={file._id}
              className="border-b border-gray-700 hover:bg-gray-700 transition"
            >
              <td className="p-4">{file.filename}</td>
              <td className="p-4">
                {new Date(file.uploadDate).toLocaleString()}
              </td>
              <td className="p-4 flex items-center gap-4">

                {/* DOWNLOAD BUTTON */}
                <button
                  onClick={() =>
                    handleDownload(file._id, file.filename)
                  }
                  className="text-blue-400 hover:underline"
                >
                  {downloadingId === file._id
                    ? `Downloading ${progress}%`
                    : "Download"}
                </button>

                {/* SPINNER */}
                {downloadingId === file._id && (
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                )}

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(file._id)}
                  className="text-red-400 hover:text-red-500 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FileTable;