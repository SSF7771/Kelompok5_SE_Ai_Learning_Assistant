import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

const getAllFlashcardSets = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const getFlashcardForDocument = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const reviewFlashcard = async (cardId, cardIdx) => {
  try {
    const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), {
        cardIdx
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const toggleStar = async (cardId) => {
  try {
    const response = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const deleteFlashcardSet = async (id) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const flashcardService = {
    getAllFlashcardSets,
    getFlashcardForDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcardSet
};

export default flashcardService;