import { Router } from 'express';
import { rate } from '../controllers/ratingController.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

router.post('/rate', requireLogin, rate);

export default router;