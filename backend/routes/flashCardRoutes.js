import express from "express";
import {
    getFlashCard,
    getAllFlashCardSets,
    reviewFlashCard,
    toggleStarFlashCard,
    deleteFlashCardSet
} from "../controllers/flashCardController.js";

import protect from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllFlashCardSets);
router.get("/:documentId", getFlashCard);
router.post("/:cardId/review", reviewFlashCard);
router.put("/:cardId/star", toggleStarFlashCard);
router.delete("/:id", deleteFlashCardSet);

export default router;
