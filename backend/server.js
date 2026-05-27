import DOMMatrix from 'dommatrix';
global.DOMMatrix = DOMMatrix;

import dotenv from "dotenv";
import express from "express";

dotenv.config();

import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import flashcardRoutes from "./routes/flashCardRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import semesterRoutes from "./routes/semesterRoutes.js";

//ES6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//INITIALIZE EXPRESS APP
const app = express();

//CONNECT TO MONGODB
connectDB();

const allowedOrigins = [
  'http://localhost:5173', // Local FE
  'https://your-frontend-project.vercel.app' // Deployed Vercel frontend
];

//MIDDLEWARE TO HANDLE CORS
app.use(
    cors({
        origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1)
            callback(null, true);

        else 
            callback(new Error('Not allowed by CORS'));  
    },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//STATIC FOLDER FOR UPLOADS
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/semesters", semesterRoutes);


app.use(errorHandler);

//404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: "Route not found",
        statusCode: 404
    });
});

//START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});
