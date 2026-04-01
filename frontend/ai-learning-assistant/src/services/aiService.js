import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

const generateFlashcards = async (documentId, options) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
      documentId,
      ...options,
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

const generateQuiz = async (documentId, options) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
      documentId,
      ...options,
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

const generateSummary = async (documentId) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
      documentId
    });

    return response.data?.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const chat = async (documentId, message) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
      documentId,
      question: message
    }); // Remove History from Payload

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const explainConcept = async (documentId, concept) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
      documentId,
      concept
    });

    return response.data?.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const getChatHistory = async (documentId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory
};

export default aiService;