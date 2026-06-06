import { Router } from 'express';
import { serveImage } from '../controllers/imageController.js';
const router = Router();
router.get('/:postId/image/:imageId', serveImage);
export default router;
