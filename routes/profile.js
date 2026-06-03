import { Router } from 'express';
import { show } from '../controllers/profileController.js';

const router = Router();

router.get('/:id', show);

export default router;