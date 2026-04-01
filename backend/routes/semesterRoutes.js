import express from "express";
const router = express.Router();
import upload from "../config/multer.js";
import {
  createSemester,
  getAllSemesters,
  getSemesterByNumber,
  getCourseById,
  addCourse,
  deleteCourse,
  uploadPdfs,
  deletePdf,
  uploadCoursePdf,
  getSemesterFile
} from "../controllers/semesterController.js";

// Create a new semester
router.post("/create-semester", createSemester);

// Get all semesters
router.get("/", getAllSemesters);

// Get a specific semester by its number
router.get("/:semesterNumber", getSemesterByNumber);

// Get a specific course by its Id
router.get("/:semesterNumber/:courseId", getCourseById);

// Add a course to a semester
router.post("/:semesterId/courses", addCourse);

// Delete a course
router.delete("/:semesterId/courses/:courseId", deleteCourse);

// Upload multiple PDFs
// 'pdfs' is the field name for your frontend FormData
router.post("/:semesterId/courses/:courseId/pdfs", upload.array("pdfs", 5), uploadPdfs);

// Delete a PDF
router.delete("/:semesterId/courses/:courseId/pdfs/:pdfId", deletePdf);

// Upload a single merged file for learning
router.post("/:semesterId/courses/:courseId/addForLearning", upload.single('file'), uploadCoursePdf);

// Get the sing
router.get("/:semesterId/courses/:courseId/getForLearning", getSemesterFile);

export default router;

