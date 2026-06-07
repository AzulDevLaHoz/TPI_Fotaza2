// comment.js
import { Router } from 'express';
import { create, createAjax, toggleComment, destroy } from '../controllers/commentController.js';
import { requireLogin } from '../middleware/auth.js';
const router = Router();
router.post('/create', requireLogin, createAjax);
router.post('/toggle/:imageId', requireLogin, toggleComment);
router.post('/delete/:id', requireLogin, destroy);
export default router;