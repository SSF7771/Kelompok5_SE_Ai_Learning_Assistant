import Quiz from "../models/Quiz.js";

// getQuizzes -> Berfungsi untuk mengambil daftar kuis yang tersedia untuk satu dokumen tertentu berdasarkan documentId. 
// Ini memungkinkan user melihat semua set latihan soal yang telah di-generate dari materi PDF tersebut.
// getQuizById -> Mengambil detail satu kuis spesifik berdasarkan ID-nya. Fungsi ini digunakan untuk memuat butir-butir soal 
// dan pilihan jawaban ketika user menekan tombol mulai kuis.
// submitQuiz -> Memproses jawaban yang dikirimkan user, membandingkannya dengan kunci jawaban, dan menghitung skor akhir. 
// Hasilnya kemudian disimpan ke dalam model Quiz beserta waktu penyelesaiannya.
// getQuizResults -> Mengambil data hasil evaluasi dari kuis yang sudah dikerjakan.
// Fungsi ini digunakan untuk menampilkan ringkasan performa user, seperti jumlah jawaban benar, salah, dan skor persentase.
// deleteQuiz -> Menghapus data kuis dari database secara permanen. 
// Digunakan jika user ingin menghapus riwayat hasil kuis tertentu atau membuang draf kuis yang tidak diinginkan.

// Get a quiz by Id
// GET /api/quizzes/quiz/:id
// Private

export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found!",
                statusCode: 404
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
        
    } catch (error) {
        next(error);
    }
};

// Get all quizzes
// GET /api/quizzes/
// Private

export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id,
            documentId: req.params.documentId
        })
        .populate("documentId", "title fileName")
        .sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });

    } catch (error) {
        next(error);
    }
};

// Get quiz results
// GET /api/quizzes/:id/results
// Private

export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        })
        .populate("documentId", "title");

        if(!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found!",
                statusCode: 404
            });
        } 

        if(!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz not completed yet!",
                statusCode: 400
            });
        }

        // Build detailed results
        const detailedResults = quiz.questions.map((question, idx) => {
        const userAnswer = quiz.userAnswers.find(a => a.questionIdx === idx);

            return {
                questionIdx: idx,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer: userAnswer?.selectedAnswer || null,
                isCorrect: question?.isCorrect || false,
                explanation: question.explanation
            };
        });

        res.status(200).json({
            success: true,
            data: {
                quiz: {
                    id: quiz._id,
                    title: quiz.title,
                    document: quiz.documentId,
                    score: quiz.score,
                    totalQuestions: quiz.totalQuestions,
                    completedAt: quiz.completedAt
                },
            
                results: detailedResults
            }
        });

    } catch (error) {
        next(error);
    }
};

// Submit a quiz
// GET /api/quizzes/:id/submit
// Private

export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body;

        if(!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: "Please provide answers in an array!",
                statusCode: 400
            });
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found!",
                statusCode: 404
            });
        } 

        if(quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz already completed!",
                statusCode: 400
            });
        }

        // Process answers
        let correctCount = 0;
        const userAnswers = [];

        const normalize = str => str?.replace(/^O\d+:\s*/, "").trim().toLowerCase();

        answers.forEach(answer => {
            const { questionIdx, selectedAnswer } = answer;

            if(questionIdx < quiz.questions.length) {
                const question = quiz.questions[questionIdx];
                const isCorrect = normalize(selectedAnswer) === normalize(question.correctAnswer);
    
                if(isCorrect)
                    correctCount++;

                userAnswers.push({
                    questionIdx,
                    selectedAnswer,
                    isCorrect,
                    answeredAt: new Date()
                });
            }
        });

        // Calculate score
        const score = Math.round((correctCount / quiz.totalQuestions) * 100);

        // Update quiz
        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();

        await quiz.save();

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers
            },
            message: "Quiz submitted successfully!"
        });

    } catch (error) {
        next(error);
    }
};

// Delete a quiz
// GET /api/quizzes/:id
// Private

export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!quiz) {
            return res.status(404).json({
                success: false,
                error: "Quiz not found!",
                statusCode: 404
            });
        }

        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully!"
        });
        
    } catch (error) {
        next(error);
    }
};