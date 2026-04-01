import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react'
import moment from 'moment'

const FlashcardSetCard = ({ flashcardSet }) => {
    const navigate = useNavigate();

    const handleStudyNow = () => {
        navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
    };

    const reviewCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
    const totalCards = flashcardSet.cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((reviewCount / totalCards) * 100) : 0;


  return <div 
  className="group relative bg-white/80 backdrop-blur-xl border-2 border-slate-200 hover:border-blue-300 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between"
    onClick={handleStudyNow}
  >
    <div className="space-y-4">
        {/* ICON & TITLE */}
        <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                <BookOpen className='w-6 h-6 text-blue-600' strokeWidth={2}/>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-slate-900 line-clamp-2 mb-1"
                title={flashcardSet?.documentId?.title}
                >
                    {flashcardSet?.documentId?.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Created {moment(flashcardSet.createdAt).fromNow()}
                </p>
            </div>
        </div>

        {/* STATS */}
        <div className="flex items-center gap-3 pt-2">
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-sm font-semibold text-slate-700">
                    {totalCards} {totalCards === 1 ? "Card" : "Cards"}
                </span>
            </div>
            {reviewCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <TrendingUp className='w-3.5 h-3.5 text-blue-600' strokeWidth={2.5}/>
                    <span className="text-sm font-semibold text-blue-600">
                        {progressPercentage}%
                    </span>
                </div>
            )}
        </div>
        
        {/* PROGRESS BAR */}
        {totalCards > 0 && (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600">
                        Progress
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                        {reviewCount}/{totalCards} reviewed
                    </span>
                </div>
                <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                    className="absolute inset-y-0 bg-linear-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${progressPercentage}%`
                    }}
                    />
                </div>
            </div>
        )}
    </div>

    {/* STUDY BUTTON */}
    <div className="mt-6 pt-4 border-t border-slate-100">
        <button 
        className="group/btn relative w-full h-11 bg-linear-to-r from-blue-50 to-teal-100 hover:from-blue-600 hover:to-teal-600 text-blue-700 hover:text-white font-semibold text-sm rounded-xl transition-all duration-200 active:scale-95 overflow-hidden"
        onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
        }}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className='w-4 h-4' strokeWidth={2.5}/>
                Study Now
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
        </button>
    </div>
  </div>
}

export default FlashcardSetCard