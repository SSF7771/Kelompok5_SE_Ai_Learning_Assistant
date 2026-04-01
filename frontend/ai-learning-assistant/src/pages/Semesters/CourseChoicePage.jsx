import { Link, useParams } from 'react-router-dom';
import { BookOpen, Database, GraduationCap } from 'lucide-react';
import React, { useEffect, useState } from "react";
import semesterService from '../../services/BankQuestionService';
import Spinner from '../../components/common/Spinner';

const CourseChoicePage = () => {
    const { semesterNumber, courseId } = useParams();

  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

    const currentCourse = semester.courses?.find(c => c._id === courseId);

  if (!semester)
    return <div className="p-10 text-center">Semester not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-16">
        <div className="space-y-6">
          
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">{currentCourse.title}</h2>
            <span className="text-emerald-600 font-mono font-bold">{currentCourse.courseCode}</span>
          </div>

          {/* The Two Squares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Bank Questions */}
            <Link 
              to={`/semesters/${semesterNumber}/${currentCourse._id}/questionsBank`}
              className="group relative p-10 border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all duration-300 rounded-2xl flex flex-col items-center justify-center text-center gap-6 aspect-square"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-emerald-100">
                <Database className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-slate-900">Bank Questions</h3>
                <p className="text-sm text-slate-500 max-w-50">
                  Access previous exam papers and practice questions.
                </p>
                <span className="mt-4 text-emerald-600 font-bold uppercase tracking-widest text-xs group-hover:translate-x-1 transition-transform inline-flex items-center justify-center">
                  Explore.
                </span>
              </div>
            </Link>

            {/* Learning Portal */}
            <Link 
              to={`/semesters/${semesterNumber}/${currentCourse._id}/learning`}
              className="group relative p-10 border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all duration-300 rounded-2xl flex flex-col items-center justify-center text-center gap-6 aspect-square"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-100">
                <GraduationCap className="w-10 h-10 text-blue-600" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-slate-900">Learning Portal</h3>
                <p className="text-sm text-slate-500 max-w-50">
                  View course merged Powerpoint files, summary, and more.
                </p>
                <span className="mt-4 text-blue-600 font-bold uppercase tracking-widest text-xs group-hover:translate-x-1 transition-transform inline-flex items-center justify-center">
                  Learn Now.
                </span>
              </div>
            </Link>

          </div>
        </div>
    </div>
  );
};

export default CourseChoicePage;
