import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  FileUp,
  FileText,
  Search,
  Calendar,
  Download
} from "lucide-react";
import semesterService from "../../services/BankQuestionService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const CourseDetailsPage = () => {
  const { semesterNumber, courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [semester, setSemester] = useState(null);
  const [course, setCourse] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [targetCourseId, setTargetCourseId] = useState(null); // To save the pdfs into the specific course

  const [filesModalOpen, setFilesModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchCourseDetails = async () => {
    try {
      const res = await semesterService.getCourseById(semesterNumber, courseId);
      setCourse(res.data);
    } catch (error) {
      toast.error("Failed to fetch course details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (semesterNumber && courseId) fetchCourseDetails();
  }, [semesterNumber, courseId]);

  // UPLOAD PDF (Multi-file)
  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("pdfs", file));

    setUploading(true);

    try {
      await semesterService.uploadPdfs(semester._id, targetCourseId, formData);

      toast.success(`${selectedFiles.length} file(s) uploaded successfully!`);
      setSelectedFiles([]);
      setFilesModalOpen(false);

      fetchSemesterDetails(); // Refresh
    } catch (err) {
      toast.error("Upload failed: ", err.message);
    } finally {
      setUploading(false);
    }
  };

  // DELETE PDF
  const handleDeletePdf = async (courseId, pdfId) => {
    setDeleting(true);

    try {
      await semesterService.deletePdf(semester._id, courseId, pdfId);

      toast.success("File deleted successfully!");

      fetchSemesterDetails(); // Refresh
    } catch (err) {
      toast.error("Failed to delete pdf file: ", err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Handle selection (adding files to the list)
  const onFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // Filter to ensure only PDFs are added
    const pdfsOnly = newFiles.filter((file) => file.type === "application/pdf");

    // Merge with existing selection, avoiding duplicates by name
    setSelectedFiles((prev) => {
      const existingNames = prev.map((file) => file.name);
      const uniqueNewFiles = pdfsOnly.filter(
        (file) => !existingNames.includes(file.name),
      );
      return [...prev, ...uniqueNewFiles];
    });

    // Reset input value so the same file can be picked again if deleted
    e.target.value = null;
  };

  // Remove a specific file from the staged list
  const removeFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Help calculate the file's size
  const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return "N/A";

    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIdx = 0;

    while (size > 1024 && unitIdx < units.length - 1) {
      size /= 1024;
      unitIdx++;
    }

    return `${size.toFixed(1)} ${units[unitIdx]}`;
  };

  // Help filter to newest or oldest
    const filteredFiles = course?.pdfs
        ?.filter((file) =>
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort((a, b) => {
        const dateA = new Date(a.uploadDate);
        const dateB = new Date(b.uploadDate);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // This tells the browser what the file should be named
            link.setAttribute('download', fileName); 
            
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Could not download file.");
        }
    };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4">
        <Link
          to={`/semesters/${semesterNumber}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </Link>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              {course.title}
            </h1>
            <p className="text-slate-500 text-sm">{course.courseCode}</p>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
              Sort by:
            </span>
            <select
              className="w-full md:w-auto bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest Uploaded</option>
              <option value="oldest">Oldest Uploaded</option>
            </select>
          </div>
        </div>

        {/* FILES LIST */}
        <div className="grid grid-cols-2 gap-3">
          {filteredFiles?.length > 0 ? (
            filteredFiles.map((file) => (
              <div
                key={file._id}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">
                      {file.fileName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={12} />
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-blue-600 hover:underline px-4 py-2"
                >
                  <Download size={14} 
                    onClick={() => handleDownload(file.fileUrl, file.fileName)}
                  />
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500">
                No files found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
