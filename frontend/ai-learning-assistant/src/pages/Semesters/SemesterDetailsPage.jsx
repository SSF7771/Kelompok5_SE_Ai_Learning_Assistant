import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  FileUp,
  Trash2,
  FileText,
  ExternalLink,
  BookOpen,
  UploadCloud,
  X,
  ArrowRight,
} from "lucide-react";
import semesterService from "../../services/BankQuestionService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const SemesterDetailsPage = () => {
  const { semesterNumber } = useParams();
  const [courseData, setCourseData] = useState({ title: "", courseCode: "" });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [semester, setSemester] = useState(null);
  const [addCourse, setAddCourse] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [targetCourseId, setTargetCourseId] = useState(null); // To save the pdfs into the specific course

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [filesModalOpen, setFilesModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchSemesterDetails = async () => {
    try {
      const res = await semesterService.getSemesterByNumber(semesterNumber);
      setSemester(res.data);
    } catch (error) {
      toast.error("Failed to fetch semester details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesterDetails();
  }, [semesterNumber]);

  // Add Course
  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!courseData.title || !courseData.courseCode) {
      toast.error("Please provide both Title and Course Code!");
      return;
    }

    setAddCourse(true);

    try {
      await semesterService.addCourse(semester._id, {
        title: courseData.title,
        courseCode: courseData.courseCode,
      });

      toast.success(`Course "${courseData.title}" added successfully!`);

      // Reset states for upcoming addition
      setCourseData({ title: "", courseCode: "" });
      setAddCourse(false); // Close modal/form
      setCourseModalOpen(false);

      fetchSemesterDetails(); // Refresh
    } catch (err) {
      toast.error(err.message || "Failed to add course!");
    } finally {
      setAddCourse(false);
    }
  };

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

  const handleDeleteRequest = (course) => {
    setDeleteModalOpen(true);
    setSelectedCourse(course);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCourse || !semester) return;

    setDeleting(true);

    try {
      await semesterService.deleteCourse(semester._id, selectedCourse._id);
      toast.success(`${selectedCourse.title} deleted successfully!`);
      setDeleteModalOpen(false);
      setSelectedCourse(null);
      setSemester((prev) => ({
        ...prev,
        courses: prev.courses.filter((core) => core._id !== selectedCourse._id),
      }));
    } catch (error) {
      toast.error(error.message || "Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  if (!semester)
    return <div className="p-10 text-center">Semester not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4">
        <Link
          to="/semesters"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Semesters
        </Link>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
              Computer Science Semesters
            </h1>
            <p className="text-slate-500 text-sm">
              Search All The Files Of Quizzes, Final Exams, and more..
            </p>
          </div>

          <Button onClick={() => setCourseModalOpen(true)}>
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add A Course
          </Button>
        </div>
      </div>

      {/* ADD COURSE MODAL */}
      <Modal
        isOpen={courseModalOpen}
        onClose={() => {
          setCourseModalOpen(false);
          setCourseData({ title: "", courseCode: "" }); // Reset if they close it
        }}
        title="Create New Course"
      >
        <form onSubmit={handleAddCourse} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Course Title
            </label>
            <input
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              value={courseData.title}
              onChange={(e) =>
                setCourseData({ ...courseData, title: e.target.value })
              }
              placeholder="ex: Data Structures"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
              Course Code
            </label>
            <input
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              value={courseData.courseCode}
              onChange={(e) =>
                setCourseData({ ...courseData, courseCode: e.target.value })
              }
              placeholder="ex: LA01"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={() => setUploadModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              className="flex-1 h-11 px-4 bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              type="submit"
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Course"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Courses Grid */}
      <div className="grid grid-cols-2 gap-6">
        {semester.courses?.map((course) => (
          <div
            key={course._id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900">
                    {course.title}
                  </h3>
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                    {course.courseCode}
                  </span>
                  <h3 className="text-md font-bold text-blue-500">
                    <Link
                      to={`/semesters/${semester.semesterNumber}/${course._id}/choice`}
                    >
                      <Button>
                        Learn More
                      </Button>
                    </Link>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Upload Files Modal */}
                <Button
                  onClick={() => {
                    setTargetCourseId(course._id); // Which course it is to store the pdfs
                    setFilesModalOpen(true);
                  }}
                >
                  <FileUp className="w-4 h-4" />
                  Upload PDFs
                </Button>

                {/* <button
                  onClick={() => {
                    handleDeleteRequest(course);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4 group-hover:scale-95" />
                </button> */}
              </div>
            </div>

            <Modal
              isOpen={filesModalOpen}
              onClose={() => {
                if (!uploading) {
                  setFilesModalOpen(false);
                  setSelectedFiles([]); // Clear files if user cancels
                }
              }}
              title="Upload Course Documents"
            >
              <div className="space-y-5">
                {/* DROPZONE AREA */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                    Select PDF Files
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 group">
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={onFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center py-10 px-6">
                      <div className="w-14 h-14 rounded-xl bg-linear-to-r from-blue-100 to-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud
                          className="w-7 h-7 text-blue-600"
                          strokeWidth={2}
                        />
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        <span className="text-blue-600">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-slate-500">
                        Multiple PDFs supported (Max 10MB each)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Only shows if files are selected */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Files to be uploaded ({selectedFiles.length})
                    </label>
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {selectedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl animate-in fade-in slide-in-from-left-2 duration-300"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-700 truncate">
                                {file.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase">
                                <>{formatFileSize(file.size)}</>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            type="button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={() => {
                      setFilesModalOpen(false);
                      setSelectedFiles([]);
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 h-11 px-4 bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                    type="button"
                    onClick={handleFileUpload}
                    disabled={uploading || selectedFiles.length === 0}
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ""} Files`
                    )}
                  </button>
                </div>
              </div>
            </Modal>

            {deleteModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8">
                  {/* CLOSE BUTTON */}
                  <button
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>

                  {/* MODAL HEADER */}
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-r from-red-100 to-red-200 flex items-center justify-center mb-4">
                      <Trash2
                        className="w-6 h-6 text-red-600"
                        strokeWidth={2}
                      />
                    </div>
                    <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                      Confirm Deletion
                    </h2>
                  </div>

                  {/* CONTENT */}
                  <p className="text-sm text-slate-600 mb-6">
                    Are you sure that you want to delete the course:{" "}
                    <span className="font-semibold text-slate-900">
                      {selectedCourse?.title}
                    </span>
                    ? This action cannot be undone.
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3">
                    <button
                      className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                      onClick={() => setDeleteModalOpen(false)}
                      disabled={deleting}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 h-11 px-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleConfirmDelete}
                      disabled={deleting}
                    >
                      {deleting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Deleting...
                        </span>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PDFs List */}
            <div className="p-4 bg-white">
              {course.pdfs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.pdfs.map((pdf) => (
                    <div
                      key={pdf._id}
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {pdf.fileName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={pdf.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        {/* <button
                          onClick={() => handleDeletePdf(course._id, pdf._id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400">
                    No documents uploaded yet for this course.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

        {semester.courses?.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No courses added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemesterDetailsPage;
