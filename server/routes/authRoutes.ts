import { Router } from 'express';
import { loginAdmin, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', loginAdmin);
router.get('/me', authMiddleware as any, getMe);

export default router;
