import React, { useEffect, useState } from "react";
import semesterService from "../../services/BankQuestionService";
import Spinner from "../../components/common/Spinner";
import SemesterCard from "../../components/semesters/SemesterCard";
import Button from "../../components/common/Button";
import { Plus } from "lucide-react";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

const BankQuestionsPage = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semesterModalOpen, setSemesterModalOpen] = useState(false);
  const [addSemester, setAddSemester] = useState(false);

  const [semesterNumber, setSemesterNumber] = useState("");

  const fetchSemesters = async () => {
    try {
      setLoading(true);

      const res = await semesterService.getAllSemesters();
      setSemesters(res.data || []);
    } catch (err) {
      console.error("Error fetching semesters", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  // Add Semester
  const handleAddSemester = async (e) => {
    e.preventDefault();

    const snum = Number(semesterNumber);

    const dupe = semesters.some(sem => sem.semesterNumber === snum);

    if(dupe) {
      toast.error(`Semester ${snum} already exists!`);
      return;
    }

    if (!semesterNumber || isNaN(semesterNumber) || semesterNumber < 1 || semesterNumber > 8) {
      toast.error("Please provide the period of the semester!");
      return;
    }

    setAddSemester(true);

    try {
      await semesterService.createSemester({
        semesterNumber: Number(semesterNumber),
      });

      toast.success("Semester added successfully!");

      // Reset states for upcoming addition
      setSemesterNumber("");
      setSemesterModalOpen(false);

      fetchSemesters(); // Refresh
    } catch (err) {
      toast.error(err.message || "Failed to add semester!");
    } finally {
      setAddSemester(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (semesters.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-slate-500 font-medium">No semesters found.</p>
          <p className="text-sm text-slate-400">
            Add a new semester to get started.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {semesters.map((sem) => (
          <SemesterCard key={sem._id} semester={sem} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* SUBTLE BG PATTERN */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] bg-size-[16px 16px] opacity-30 pointer-events-none" />

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

          <Button onClick={() => setSemesterModalOpen(true)}>
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add A Semester
          </Button>

          {/* ADD SEMESTER MODAL */}
          <Modal
            isOpen={semesterModalOpen}
            onClose={() => {
              setSemesterModalOpen(false);
              setSemesterNumber(""); // Reset if they close it
            }}
            title="Create New Semester"
          >
            <form onSubmit={handleAddSemester} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                  Semester's Period
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  value={semesterNumber}
                  onChange={(e) =>
                    setSemesterNumber(e.target.value)
                  }
                  placeholder="ex: 7"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  disabled={addSemester}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 h-11 px-4 bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  type="submit"
                  disabled={addSemester}
                >
                  {addSemester ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Semester"
                  )}
                </button>
              </div>
            </form>
          </Modal>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default BankQuestionsPage;
