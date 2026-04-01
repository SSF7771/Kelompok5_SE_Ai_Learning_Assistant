import express from "express";
import {
    uploadDocument,
    getDocuments,
    getSingleDocument,
    deleteDocument
} from "../controllers/documentController.js";
import protect from "../middlewares/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

// All Routes are Protected

router.use(protect);

router.post("/upload", upload.single('file'), uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getSingleDocument);
router.delete("/:id", deleteDocument);

export default router;