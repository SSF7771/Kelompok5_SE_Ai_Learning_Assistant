import { Clock, FileStack, FileText, Layers } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SemesterCard = ({ semester }) => {
  // Calculate total PDFs across all courses in this semester
  // const totalPdfs =
  //   semester.courses?.reduce((acc, course) => {
  //     return acc + (course.pdfs?.length || 0);
  //   }, 0) || 0;

  // const courseCount = semester.courses?.length || 0;

  const navigate = useNavigate();

  const handleNavigate = () => {
    // Navigating by semesterNumber as per our previous route setup
    navigate(`/semesters/${semester.semesterNumber}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl p-1 bg-slate-100 hover:bg-gradient-to-br hover:from-blue-500 hover:to-teal-400 transition-all duration-500 cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="bg-white/80 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-600 transition-all">
          Semester {semester.semesterNumber}
        </h2>
      </div>
    </div>
  );
};

export default SemesterCard;
