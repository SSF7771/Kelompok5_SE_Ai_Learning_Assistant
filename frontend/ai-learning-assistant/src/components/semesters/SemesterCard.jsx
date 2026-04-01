import { Clock, FileStack, FileText, Layers } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SemesterCard = ({ semester }) => {
  // Calculate total PDFs across all courses in this semester
  const totalPdfs =
    semester.courses?.reduce((acc, course) => {
      return acc + (course.pdfs?.length || 0);
    }, 0) || 0;

  const courseCount = semester.courses?.length || 0;

  const navigate = useNavigate();

  const handleNavigate = () => {
    // Navigating by semesterNumber as per our previous route setup
    navigate(`/semesters/${semester.semesterNumber}`);
  };

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-6 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
      onClick={handleNavigate}
    >
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="shrink-0 w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6 text-white" strokeWidth={2} />
          </div>

          {/* Badge for Course Count */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            Active
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Semester {semester.semesterNumber}
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-medium">
          Academic Materials & Resources
        </p>

        {/* STATS SECTION */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 rounded-lg">
            <Layers className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
            <span className="text-xs font-semibold text-blue-700">
              {courseCount} {courseCount <= 1 ? "Course" : "Courses"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg">
            <FileStack className="w-3.5 h-3.5 text-amber-600" strokeWidth={2} />
            <span className="text-xs font-semibold text-amber-700">
              {totalPdfs} {totalPdfs <= 1 ? "PDF" : "PDFs"}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{moment(semester.createdAt).fromNow()}</span>
        </div>
      </div>

      {/* HOVER INDICATOR */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-500/0 to-teal-500/0 group-hover:from-blue-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default SemesterCard;
