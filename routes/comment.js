import { Router } from 'express';
import { create, toggleComment, destroy } from '../controllers/commentController.js';
import { requireLogin } from '../middleware/auth.js';

const router = Router();

router.post('/create', requireLogin, create);
router.post('/toggle/:imageId', requireLogin, toggleComment);
router.post('/delete/:id', requireLogin, destroy);

export default router;