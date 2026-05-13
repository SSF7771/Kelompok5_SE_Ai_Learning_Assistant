import FlashCard from "../models/Flashcard.js";

// getAllFlashCardSets -> Mengambil seluruh daftar koleksi set flashcard yang dimiliki oleh user dari database 
// untuk ditampilkan pada halaman utama koleksi atau dashboard.
// getFlashCard -> Berfungsi untuk mengambil satu set flashcard spesifik yang terkait dengan sebuah dokumen tertentu berdasarkan documentId. 
// Digunakan saat user ingin mulai belajar menghafal dari materi PDF tersebut.
// reviewFlashCard -> Mencatat progres belajar user pada sebuah kartu spesifik (misalnya menandai apakah user sudah paham atau belum). 
// Fungsi ini membantu sistem melacak sejauh mana materi telah dikuasai.
// toggleStarFlashCard -> Memungkinkan user untuk menandai satu kartu flashcard tertentu sebagai "Penting" atau "Favorit" (fitur bintang). 
// Ini memudahkan user untuk menyaring kartu-kartu yang dianggap sulit.
// deleteFlashCardSet -> Menghapus satu set koleksi flashcard secara keseluruhan dari database. 
// Digunakan jika user ingin membersihkan data atau memulai ulang proses pembuatan flashcard dari dokumen tersebut.

// Get All Flashcards for a document
export const getFlashCard = async (req, res, next) => {
  try {
    const flashcards = await FlashCard.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title filename")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Flashcard sets for a user
export const getAllFlashCardSets = async (req, res, next) => {
  try {
    const flashcardSets = await FlashCard.find({
      userId: req.user._id,
    })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

// Mark flashcard as reviewed
export const reviewFlashCard = async (req, res, next) => {
  try {
    const flashcardSet = await FlashCard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found!",
        statusCode: 404,
      });
    }

    const cardIdx = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

    if(cardIdx === -1) {
        return res.status(404).json({
        success: false,
        error: "Card not found!",
        statusCode: 404,
      });
    }

    // Update review info
    flashcardSet.cards[cardIdx].lastReviewed = new Date();
    flashcardSet.cards[cardIdx].reviewCount += 1;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: "Flashcard reviewed successfully!"
    });

  } catch (error) {
    next(error);
  }
};

// Toggle star/favorite on a flashcard
export const toggleStarFlashCard = async (req, res, next) => {
  try {
    const flashcardSet = await FlashCard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found!",
        statusCode: 404,
      });
    }

    const cardIdx = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

    if(cardIdx === -1) {
        return res.status(404).json({
        success: false,
        error: "Card not found!",
        statusCode: 404,
      });
    }
    
    // Toggle Star
    flashcardSet.cards[cardIdx].isStarred = !flashcardSet.cards[cardIdx].isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: `Flashcard ${flashcardSet.cards[cardIdx].isStarred ? 'starred' : 'unstarred'}`
    });

  } catch (error) {
    next(error);
  }
};

// Delete flashcard set
export const deleteFlashCardSet = async (req, res, next) => {
  try {
    const flashcardSet = await FlashCard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found!",
        statusCode: 404,
      });
    }

    await flashcardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully!"
    });

  } catch (error) {
    next(error);
  }
};
