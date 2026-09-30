import express from 'express';
import { createCheckoutSession, claimTokens } from '../controllers/stripeController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/claim-tokens', protect, claimTokens);

export default router;