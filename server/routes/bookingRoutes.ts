import { Router } from 'express';
import { createBooking, getBookings, updateBookingStatus, deleteBooking } from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', createBooking);
router.get('/', authMiddleware as any, getBookings);
router.patch('/:id/status', authMiddleware as any, updateBookingStatus);
router.delete('/:id', authMiddleware as any, deleteBooking);

export default router;
