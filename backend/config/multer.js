import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the relative folder name
    let relativeFolder = "uploads/documents"; 
    
    if (req.originalUrl.includes("semesters")) 
      relativeFolder = "uploads/semesters";
    
    // Create an absolute path to ensure accuracy
    const absolutePath = path.join(process.cwd(), relativeFolder);

    // Check and create the directory if it doesn't exist
    if (!fs.existsSync(absolutePath))
      fs.mkdirSync(absolutePath, { recursive: true });

    cb(null, absolutePath);
  },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// File filter - only PDFs
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/pdf')
        cb(null, true);

    else
        cb(new Error("Only PDF files are allowed!"), false);
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10 MB default
    }
});

export default upload;
