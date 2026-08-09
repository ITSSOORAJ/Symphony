import { Router } from 'express';
import { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../controllers/enquiryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', createEnquiry);
router.get('/', authMiddleware as any, getEnquiries);
router.patch('/:id/status', authMiddleware as any, updateEnquiryStatus);
router.delete('/:id', authMiddleware as any, deleteEnquiry);

export default router;
