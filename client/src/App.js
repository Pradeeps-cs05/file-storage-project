import { useEffect, useState } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import FileTable from "./components/FileTable";
import Loader from "./components/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://api.pradeeptech.online/api/files";

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
// Fetch files from the server
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setFiles(res.data.data);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };
  // Filter and sort files based on search term and sort order
  const filteredFiles = files
  .filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else {
      return new Date(a.uploadDate) - new Date(b.uploadDate);
    }
  });
// Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
  <div className="min-h-screen bg-gray-900 text-gray-100 p-10">
    <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">
      MERN File Storage System
    </h1>

    <div className="max-w-4xl mx-auto">
      <FileUpload refreshFiles={fetchFiles} />
      <div className="flex justify-between items-center mb-6 gap-4">
  
  <input
    type="text"
    placeholder="Search files..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
  />

  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
  >
    <option value="latest">Latest</option>
    <option value="oldest">Oldest</option>
  </select>

</div>

      {loading ? (
        <Loader />
      ) : (
        <FileTable files={filteredFiles} refreshFiles={fetchFiles} />
      )}
      <ToastContainer theme="dark" position="top-right" />
    </div>
  </div>
);
}

export default App;