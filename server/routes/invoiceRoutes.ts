import { Router } from 'express';
import { createInvoice, getInvoices, downloadInvoicePDF, emailInvoice } from '../controllers/invoiceController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware as any, createInvoice);
router.get('/', authMiddleware as any, getInvoices);
router.get('/:id/pdf', downloadInvoicePDF);
router.post('/:id/email', authMiddleware as any, emailInvoice);

export default router;
