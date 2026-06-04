import { Router } from 'express';
import { follow, unfollow } from '../controllers/followController.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

router.post('/follow/:userId', requireLogin, follow);
router.post('/unfollow/:userId', requireLogin, unfollow);

export default router;