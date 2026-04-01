import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import FlashCard from "../models/Flashcard.js";
import Semester from "../models/Semester.js";

export const getDashboard = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get Counts
        const totalDocuments = await Document.countDocuments({ userId });
        const totalFlashcardSets = await FlashCard.countDocuments({ userId });
        const totalQuizzes = await Quiz.countDocuments({ userId });
        const completedQuizzes = await Quiz.countDocuments({ 
            userId,
            completedAt: {
                $ne: null
            }
        });

        // Get flashcard statistics
        const flashcardSets = await FlashCard.find({ userId });

        let totalFlashcards = 0;
        let reviewedFlashcards = 0;
        let starredFlashcards = 0;

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length;
            reviewedFlashcards += set.cards.filter(c => c.reviewCount > 0).length;
            starredFlashcards += set.cards.filter(c => c.isStarred).length;
        });

        // Get quiz statistics
        const quizzes = await Quiz.find({
            userId,
            completedAt: {
                $ne: null
            }
        });

        const averageScore = quizzes.length > 0
        ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
        : 0;

        // Recent Activity
        const recentDocuments = await Document.find({ userId })
        .sort({ lastAccessed: -1 })
        .limit(5)
        .select("title fileName lastAccessed status");

        // ADD THIS FOR HISTORY !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // const recentCourses = await Semester?.courses.sort({ lastAccessed: -1 })
        // .limit(5)
        // .select("title fileName lastAccessed");

        const recentQuizzes = await Quiz.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title score totalQuestions completedAt");

        // Study streak (simplified - in production, track daily activity)
        const studyStreak = Math.floor(Math.random() * 7) + 1; // Mock data (not real)

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalFlashcardSets,
                    totalFlashcards,
                    reviewedFlashcards,
                    starredFlashcards,
                    totalQuizzes,
                    completedQuizzes,
                    averageScore,
                    studyStreak
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                    // courses: recentCourses
                }
            }
        });

    } catch (error) {
        next(error);
    }  
};