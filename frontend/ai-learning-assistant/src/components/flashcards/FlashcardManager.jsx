import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/FlashCardService.js";
import aiService from "../../services/aiService.js";
import Spinner from "../common/Spinner.jsx";
import Modal from "../common/Modal.jsx";
import Flashcard from "./Flashcard.jsx";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setselectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);

    try {
      const response = await flashcardService.getAllFlashcardSets(documentId);

      setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcard sets.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardSets();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);

    try {
      await aiService.generateFlashcards(documentId);

      toast.success("Flashcards generated successfully!");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcard.");
    } finally {
      setGenerating(false);
    }
  };

  const handleReview = async (idx) => {
    const currentCard = selectedSet?.cards[currentCardIndex];

    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, idx);
      toast.success("Flashcard reviewed.");
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIdx) => (prevIdx + 1) % selectedSet.cards.length,
      );
    }
  };

  const handleToggleStar = async (cardId) => {
      try {
        await flashcardService.toggleStar(cardId);
        const updateSets = flashcardSets.map((set) => {
          if(set._id === selectedSet._id) {
            const updatedCards = set.cards.map((card) => 
              card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
            );

            return { ...set, cards: updatedCards };
          }

          return set;
        });

        setFlashcardSets(updateSets);
        setselectedSet(updateSets.find((set) => set._id === selectedSet._id));
        toast.success("Flashcard starred status updated!");

      } catch (error) {
        toast.error("Failed to update starred status.");
      }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIdx) =>
          (prevIdx - 1 + selectedSet.cards.length) % selectedSet.cards.length,
      );
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();

    setToDelete(set);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);

    try {
      await flashcardService.deleteFlashcardSet(toDelete._id);
      toast.success("Flashcard set deleted successfully!");
      setDeleteModalOpen(false);
      setToDelete(null);
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectedSet = (set) => {
    setselectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardReviewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-6">
        {/* BACK BUTTON */}
        <button
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
          onClick={() => setselectedSet(null)}
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to Sets
        </button>

        {/* FLASHCARD DISPLAY */}
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* NAVIGATION CONTROLS */}
          <div className="flex items-center gap-6">
            <button
              className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:bg-slate-100"
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
              Previous
            </button>

            <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-sm font-semibold text-slate-700">
                {currentCardIndex + 1}{" "}
                <span className="text-slate-400 font-normal">/</span>{" "}
                {selectedSet.cards.length}
              </span>
            </div>

            <button
              className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:bg-slate-100"
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
            >
              Next
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-teal-100 mb-6">
            <Brain className="w-8 h-8 text-blue-600" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Flashcards Yet..
          </h3>
          <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
            Generate flashcards from your document to start learning and
            reinforce your knowledge.
          </p>
          <button
            className="group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            onClick={handleGenerateFlashcards}
            disabled={generating}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* HEADER WITH GENERATE BUTTON */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your Flashcard Sets
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "set" : "sets"} available
            </p>
          </div>

          <button
            className="group inline-flex items-center gap-2 px-5 h-11 bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            onClick={handleGenerateFlashcards}
            disabled={generating}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        {/* FLASHCARD SETS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              className="group relative bg-white/80 backdrop-blur-xl border-2 border-slate-200 hover:border-blue-300 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
              onClick={() => handleSelectedSet(set)}
            >
              {/* DELETE BUTTON */}
              <button
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleDeleteRequest(e, set)}
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* SET CONTENT */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-teal-100">
                  <Brain className="w-6 h-6 text-blue-600" strokeWidth={2} />
                </div>

                <div>
                  <h4 className="text-base font-semibold text-slate-900 mb-1">
                    Flashcard Set
                  </h4>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Created {moment(set.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm font-semibold text-blue-700">
                      {set.cards.length}{" "}
                      {set.cards.length === 1 ? "card" : "cards"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        {selectedSet ? renderFlashcardReviewer() : renderSetList()}
      </div>

      {/* FELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this flashcard set? This action
            CANNOT BE UNDONE and all cards will be deleted permanently.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="px-5 h-11 bg-linear-to-r from-red-500 to-red-500 hover:from-red-600 hover:to-red-600 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
