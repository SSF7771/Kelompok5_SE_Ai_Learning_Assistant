import Semester from "../models/Semester.js";
import Document from "../models/Document.js";
import path from "path";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import cloudinary from "../config/cloudinary.js";

// createSemester -> Membuat entitas semester baru (misalnya Semester 1, 2, dst.) 
// ke dalam model Semester sebagai wadah utama organisasi mata kuliah.
// getAllSemesters -> Mengambil seluruh daftar semester yang tersedia untuk ditampilkan pada menu navigasi utama aplikasi.
// getSemesterByNumber -> Mencari dan menampilkan detail satu semester tertentu berdasarkan urutan angkanya.
// getCourseById -> Mengambil data lengkap sebuah mata kuliah (Course) yang spesifik untuk melihat konten di dalamnya.
// addCourse -> Menambahkan mata kuliah baru ke dalam suatu semester tertentu, sehingga mempermudah pengelompokan materi berdasarkan kurikulum.
// deleteCourse -> Menghapus mata kuliah beserta seluruh data terkait dari database semester.
// uploadPdfs -> Mengelola unggahan banyak file PDF sekaligus (maksimal 5) ke dalam suatu mata kuliah; biasanya digunakan untuk mengisi konten pada fitur Bank Soal (Question Bank).
// deletePdf -> Menghapus satu file PDF spesifik dari daftar dokumen mata kuliah dan membersihkan file fisiknya melalui fs.
// uploadCoursePdf -> Mengunggah satu file PDF khusus yang akan digunakan sebagai materi utama pada fitur Learning Portal, 
// termasuk melakukan ekstraksi teks dan chunking untuk keperluan AI.
// getSemesterFile -> Mengambil data materi pembelajaran yang sudah diunggah di Portal Belajar agar dapat diakses kembali oleh user 
// untuk dipelajari.

// @desc    Create a new Semester
// @route   POST /api/semesters
export const createSemester = async (req, res, next) => {
  try {
    const { semesterNumber } = req.body;

    if (!semesterNumber)
      return res.status(400).json({ message: "Semester number is required" });

    // Avoid Duplicates
    const existingSemester = await Semester.findOne({ semesterNumber });
    if (existingSemester)
      return res.status(400).json({ message: "This semester already exists" });

    // Create new Semester
    const newSemester = new Semester({
      semesterNumber,
      courses: [],
    });

    const savedSemester = await newSemester.save();

    res.status(201).json({
      success: true,
      data: savedSemester,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all semesters (Summary view)
// @route   GET /api/semesters
export const getAllSemesters = async (req, res, next) => {
  try {
    const semesters = await Semester.find().sort({
      semesterNumber: 1,
    });

    res.status(200).json({
      success: true,
      data: semesters,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific semester by its number (e.g., 1)
// @route   GET /api/semesters/:semesterNumber
export const getSemesterByNumber = async (req, res, next) => {
  try {
    const { semesterNumber } = req.params;

    // Find the semester matching the number provided in the URL
    const semester = await Semester.findOne({ semesterNumber: semesterNumber });

    if (!semester)
      return res
        .status(404)
        .json({ message: `Semester ${semesterNumber} not found` });

    res.status(200).json({
      success: true,
      data: semester,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific course by its Id
// @route   GET /api/semesters/:semesterNumber
export const getCourseById = async (req, res, next) => {
  try {
    const { semesterNumber, courseId } = req.params;

    // Find the semester matching the number provided in the URL
    const semester = await Semester.findOne(
      { semesterNumber: semesterNumber, "courses._id": courseId }, // Find matching semester AND course ID
      { "courses.$": 1 }, // Only return the matching element
    );

    if (!semester)
      return res
        .status(404)
        .json({ message: `Semester ${semesterNumber} not found` });

    // Returns a semester object with a courses array containing 1 item
    const course = semester?.courses[0];

    if (!course)
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new course to a semester
// @route   POST /api/semesters/:semesterId/courses
export const addCourse = async (req, res, next) => {
  const { title, courseCode } = req.body;

  try {
    const semester = await Semester.findById(req.params.semesterId);

    if (!semester)
      return res.status(404).json({ message: "Semester not found" });

    semester.courses.push({
      title,
      courseCode,
      pdfs: [],
    });

    await semester.save();

    res.status(201).json({
      success: true,
      data: semester,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload multiple PDFs to a specific course
// @route   POST /api/semesters/:semesterId/courses/:courseId/pdfs
export const uploadPdfs = async (req, res, next) => {
  try {
    const { semesterId, courseId } = req.params;

    // req.files is populated by multer
    if (!req.files || req.files.length === 0)
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
        statusCode: 400,
      });

    // WITH CLOUDINARY
    // Upload all files to Cloudinary in parallel
    const uploadPromises = req.files.map(async (file) => {
      // Convert buffer to Base64
      const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "ai_learning_assistant/pdfs",
        resource_type: "auto",
      });

      return {
        fileName: file.originalname,
        fileUrl: result.secure_url, // This is the permanent Cloudinary link
        cloudinaryId: result.public_id // Good practice to store this for later deletion
      };
    });

    const newPdfs = await Promise.all(uploadPromises)

    const updatedSemester = await Semester.findOneAndUpdate(
      {
        _id: semesterId,
        "courses._id": courseId,
      },
      {
        $push: {
          "courses.$.pdfs": {
            $each: newPdfs,
          },
        },
      },
      { new: true },
    );

    if (!updatedSemester)
      return res.status(404).json({
        success: false,
        message: "Semester or Course not found",
        statusCode: 404,
      });

    res.status(200).json({
      success: true,
      data: updatedSemester,
    });
  } catch (error) {
      next(error);
  }
};

// @desc    Delete a specific PDF from a course
// @route   DELETE /api/semesters/:semesterId/courses/:courseId/pdfs/:pdfId
export const deletePdf = async (req, res, next) => {
  try {
    const { semesterId, courseId, pdfId } = req.params;

    // Find the semester document first
    const semester = await Semester.findById(semesterId);

    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found!",
      });
    }

    // Then the course
    const course = semester.courses.id(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Semester not found!",
      });
    }

    // Then the specific pdf that wants to be deleted
    const pdf = course.pdfs.id(pdfId);
    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF not found in this course!",
      });
    }

    // Delete the file from the filesystem
    const filePath = path.join(process.cwd(), pdf.fileUrl);

    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("File deletion failed:", err.message);
    }

    // Remove the PDF from the array using $pull
    await Semester.findOneAndUpdate(
      { _id: semesterId, "courses._id": courseId },
      {
        $pull: { "courses.$.pdfs": { _id: pdfId } },
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "PDF deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an entire course
// @route   DELETE /api/semesters/:semesterId/courses/:courseId
export const deleteCourse = async (req, res, next) => {
  try {
    const { semesterId, courseId } = req.params;

    // Search for a document that matches BOTH the Semester ID and the Course ID
    const updatedSemester = await Semester.findOneAndUpdate(
      {
        _id: semesterId,
        "courses._id": courseId, // This ensures the course actually exists here
      },
      {
        $pull: { courses: { _id: courseId } },
      },
      { new: true },
    );

    // If no document was found
    if (!updatedSemester) {
      return res.status(404).json({
        success: false,
        message: "Course no longer existed!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload a single merged pdf file for learning portal
// @route   POST /api/semesters/:semesterId/courses/:courseId/addForLearning
export const uploadCoursePdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a PDF File!",
        statusCode: 400,
      });
    }

    // Check size BEFORE processing to give a better error message
    // 4.5MB = 4718592 bytes.
    if (req.file.size > 4000000) { 
        return res.status(413).json({
            success: false,
            error: "File too large for Vercel Free (Limit: 4MB)",
            statusCode: 413
        });
    }

    const { semesterId, courseId } = req.params;
    const { title } = req.body;

    const semester = await Semester.findOne({
      semesterNumber: semesterId,
      "courses._id": courseId,
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: "Semester or Course not found",
      });
    }

    const folder = "semesters";

    // Identify the specific course object to check for existing PDF
    const course = semester.courses.id(courseId);
    const existingDocId = course.pdfLearn;

    // Construct the URL for the uploaded file
    // LOCALLY (FOR LOCAL)
    // const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
    // const fileUrl = `${baseUrl}/uploads/${folder}/${req.file.filename}`;

    // WITH CLOUDINARY
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "ai_learning_assistant", // Optional: organizes files in folders
      resource_type: "auto", // Automatically detect if it's a PDF, Image, ect.
    });

    // Get the URL
    const fileUrl = result.secure_url;

    let targetDoc;

    // Update existing OR Create new
    if (existingDocId) {
      // Update the existing document record
      targetDoc = await Document.findByIdAndUpdate(
        existingDocId,
        {
          title,
          fileName: req.file.originalname,
          filePath: fileUrl,
          fileSize: req.file.size,
          status: "processing", // Reset status for AI to re-process
        },
        { new: true }
      );
    } 

    // Create the Document if it doesn't exist yet
    if (!targetDoc) {
    targetDoc = await Document.create({
        userId: "698bea24e8e6702c5adca64f", //dummy -> Admin Uploaded it
        courseId: courseId,
        title,
        fileName: req.file.originalname,
        filePath: fileUrl, // store the URL instead of the local path
        fileSize: req.file.size,
        status: "processing",
        docType: "public",
      });
    }

    // Link it to the Semester
    const updateResult = await Semester.updateOne(
      { semesterNumber: semesterId, "courses._id": courseId },
      { $set: { "courses.$.pdfLearn": targetDoc._id } },
    );

    // This keeps the Vercel function alive until the PDF is parsed
    await processPdf(targetDoc._id, fileUrl); 

    res.status(201).json({
      success: true,
      data: targetDoc,
      message: existingDocId ? "Document updated successfully..." : "Document created successfully. Processing in progress..",
    });
  } catch (error) {
    next(error);
  }
};

// Helper FUNCTION for process PDF
const processPdf = async (documentId, fileUrl) => {
  try {
    const { text } = await extractTextFromPDF(fileUrl);

    // Create chunks
    const chunks = chunkText(text, 500, 50);

    // Update document
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
    });

    console.log(`Document ${documentId} processed successfully!`);
  } catch (error) {
    console.error(`Error processing document ${documentId}: `, error);

    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};

// @desc    Get Semester added pdfForLearn Details
// @route   GET /api/semesters/:semesterId/courses/:courseId/getForLearning
export const getSemesterFile = async (req, res, next) => {
  try {
    const { semesterId } = req.params;

    const semester = await Semester.findOne({
      semesterNumber: semesterId,
    }).populate({
      path: "courses.pdfLearn",   // This converts the ID into the actual Document object
      model: 'Document'
    }); 

    if (!semester) 
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ 
      success: true, 
      data: semester 
    });

  } catch (error) {
    next(error);
  }
};
