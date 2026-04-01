import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
  semesterNumber: Number,
  courses: [{
    title: String,
    courseCode: String,
    pdfs: [{
      fileName: String,
      fileUrl: String,
      uploadDate: { 
        type: Date, 
        default: Date.now 
        },
      lastAccessed: {
        type: Date,
        default: Date.now
        },
    }],
    pdfLearn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null
    }
  }]
});

const Semester = mongoose.model('Semester', semesterSchema);

export default Semester;