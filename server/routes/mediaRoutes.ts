import { Router } from 'express';
import { getMedia, createMedia, deleteMedia } from '../controllers/mediaController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getMedia);
router.post('/', authMiddleware as any, createMedia);
router.delete('/:id', authMiddleware as any, deleteMedia);

export default router;
