import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

const createSemester = async (semesterData) => {
  try {
    const response = await axiosInstance.post(API_PATHS.SEMESTER.CREATE, semesterData);
    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Failed to create semester" };
  }
};

const getAllSemesters = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.SEMESTER.GET_ALL);
    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "An unknown error occurred!" };
  }
};

const getSemesterByNumber = async (number) => {
  try {
    const response = await axiosInstance.get(API_PATHS.SEMESTER.GET_BY_NUMBER(number));
    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Semester not found!" };
  }
};

const getCourseById = async (number, courseId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.SEMESTER.GET_COURSE_BY_ID(number, courseId));
    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Course not found!" };
  }
};

const addCourse = async (semesterId, courseData) => {
  try {
    const response = await axiosInstance.post(API_PATHS.SEMESTER.ADD_COURSE(semesterId), 
      courseData
    );

    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Failed to add course" };
  }
};

const deleteCourse = async (semesterId, courseId) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.SEMESTER.DELETE_COURSE(semesterId, courseId));

    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Failed to delete course" };
  }
};

const uploadPdfs = async (semesterId, courseId, formData) => {
  try {
    const response = await axiosInstance.post(API_PATHS.SEMESTER.UPLOAD_PDFS(semesterId, courseId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Upload failed!" };
  }
};

const deletePdf = async (semesterId, courseId, pdfId) => {
  try {
    const response = await axiosInstance.delete(API_PATHS.SEMESTER.DELETE_PDF(semesterId, courseId, pdfId));
    return response.data;

  } catch (error) {
    throw error.response?.data || { message: "Failed to delete PDF" };
  }
};

const getFileForLearning = async (semesterId, courseId) => {
  try {
    const response = await axiosInstance.get(API_PATHS.SEMESTER.FETCH_FOR_LEARNING(semesterId, courseId));
    
    const semester = response.data.data;
    
    if (!semester || !semester.courses) {
      console.error("Semester or courses missing in response");
      return null;
    }

    // Find the specific course. 
    // IMPORTANT: Use .toString() because c._id is a DB object and courseId is a string.
    const course = semester.courses.find(c => c._id.toString() === courseId.toString());
    
    if (!course) {
      console.error("Course not found in this semester. CourseId looking for:", courseId);
      return null;
    }

    // Return the populated pdfLearn object (which contains filePath, title, etc.)
    return course.pdfLearn;
    
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch PDF for learning" }; 
  }
}

const semesterService = {
  createSemester,
  getAllSemesters,
  getSemesterByNumber,
  getCourseById,
  addCourse,
  deleteCourse,
  uploadPdfs,
  deletePdf,
  getFileForLearning,
};

export default semesterService;