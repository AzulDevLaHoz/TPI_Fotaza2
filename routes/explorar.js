import { Router } from 'express';
import { explorar } from '../controllers/explorarController.js';
const router = Router();
router.get('/', explorar);
export default router;
