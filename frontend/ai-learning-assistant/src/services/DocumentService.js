import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

const getDocuments = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENT.GET_DOCUMENTS);

    return response.data?.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const uploadDocument = async (formData) => {
  try {
    const response = await axiosInstance.post(API_PATHS.DOCUMENT.UPLOAD, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
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

const deleteDocument = async (id) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.DOCUMENT.DELETE_DOCUMENT(id));

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const getDocumentById = async (id) => {
  try {
    const response = await axiosInstance.get(API_PATHS.DOCUMENT.GET_DOCUMENTS_BY_ID(id));

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An unknown error occurred!",
      }
    );
  }
};

const documentService = {
    getDocuments,
    uploadDocument,
    deleteDocument,
    getDocumentById
};

export default documentService;