import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

// HELPER FUNCTION TO FORMAT FILE SIZE
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

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-6 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1" 
    onClick={handleNavigate}>
        {/* HEADER SECTION */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
            <div className="shrink-0 w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-white" strokeWidth={2}/>
            </div>
            <button 
            className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            onClick={handleDelete}
            >
                <Trash2 className="w-4 h-4" strokeWidth={2}/>
            </button>
        </div>

        {/* TITLE */}
        <h3 
        className="text-base font-semibold text-slate-900 truncate mb-2"
        title={document.title}
        >
            {document.title}
        </h3>

        {/* DOCUMENT INFO */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            {document.fileSize !== undefined && (
                <>
                    <span className="">{formatFileSize(document.fileSize)}</span>
                </>
            )}
        </div>

        {/* STATS SECTION */}
        <div className="flex items-center gap-3">
            {document.flashcardCount !== undefined && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 rounded-lg">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" strokeWidth={2}/>
                    <span className="text-xs font-semibold text-purple-700">{document.flashcardCount} Flashcards</span>
                </div>
            )}
            {document.quizCount !== undefined && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 rounded-lg">
                    <BrainCircuit className="w-3.5 h-3.5 text-blue-600" strokeWidth={2}/>
                    <span className="text-xs font-semibold text-blue-700">{document.quizCount} Quizzes</span>
                </div>
            )}
        </div>
      </div>

        {/* FOOTER SECTION */}
        <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" strokeWidth={2}/>
                <span>{moment(document.createdAt).fromNow()}</span>
            </div>
        </div>

        {/* HOVER INDICATOR */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 to-teal-500/0 group-hover:from-blue-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default DocumentCard;
