import { Request, Response } from 'express';
import Invoice from '../models/Invoice';
import Booking from '../models/Booking';
import { getIsConnected } from '../config/db';
import { memoryStore } from '../config/store';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { sendEmail, getInvoiceEmailTemplate } from '../utils/mailer';

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const {
      bookingId,
      customerName,
      customerEmail,
      customerPhone,
      eventType,
      eventDate,
      items,
      taxPercent = 5,
      discount = 0,
      notes,
      autoApproveBooking = true,
      sendEmailAttachment = true,
    } = req.body;

    if (!bookingId || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Booking ID, customer email, and itemized lines are required.' });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.cost) || 0), 0);
    const tax = Math.round(subtotal * (Number(taxPercent) / 100));
    const totalAmount = Math.max(0, subtotal + tax - Number(discount));

    const invoiceNumber = `VAN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const isConnected = getIsConnected();

    let createdInvoice: any = null;

    if (isConnected) {
      const invoice = new Invoice({
        invoiceNumber,
        bookingId,
        customerName,
        customerEmail,
        customerPhone,
        eventType,
        eventDate,
        items,
        subtotal,
        tax,
        discount: Number(discount),
        totalAmount,
        notes,
        sentAt: sendEmailAttachment ? new Date() : undefined,
      });
      await invoice.save();
      createdInvoice = invoice.toObject();
      createdInvoice._id = invoice._id.toString();

      if (autoApproveBooking) {
        await (Booking as any).findByIdAndUpdate(bookingId, { status: 'Approved', totalAmount });
      }
    } else {
      createdInvoice = {
        _id: 'inv_' + Date.now(),
        invoiceNumber,
        bookingId,
        customerName,
        customerEmail,
        customerPhone,
        eventType,
        eventDate,
        items,
        subtotal,
        tax,
        discount: Number(discount),
        totalAmount,
        notes,
        sentAt: sendEmailAttachment ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
      };
      memoryStore.invoices.unshift(createdInvoice);

      if (autoApproveBooking) {
        const bk = memoryStore.bookings.find(b => b._id === bookingId);
        if (bk) {
          bk.status = 'Approved';
          bk.totalAmount = totalAmount;
        }
      }
    }

    // Generate PDF & Dispatch Email if requested
    if (sendEmailAttachment) {
      try {
        const pdfBuffer = await generateInvoicePDF(createdInvoice);
        await sendEmail({
          to: customerEmail,
          subject: `Invoice & Approval Confirmed: ${invoiceNumber} - Vanamali Events Kerala`,
          html: getInvoiceEmailTemplate(createdInvoice),
          attachments: [
            {
              filename: `${invoiceNumber}_Invoice_Vanamali.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        });
      } catch (mailErr: any) {
        console.error('Error generating PDF / sending mail on invoice create:', mailErr);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Invoice generated successfully and booking marked as Approved.',
      data: createdInvoice,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const isConnected = getIsConnected();

    if (isConnected) {
      const list = await Invoice.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: list.length, data: list });
    } else {
      const list = [...memoryStore.invoices].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadInvoicePDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();
    let invoiceData: any = null;

    if (isConnected) {
      invoiceData = await (Invoice as any).findById(id);
    } else {
      invoiceData = memoryStore.invoices.find(i => i._id === id);
    }

    if (!invoiceData) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const pdfBuffer = await generateInvoicePDF(invoiceData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoiceData.invoiceNumber}_Vanamali.pdf`);
    return res.send(pdfBuffer);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const emailInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();
    let invoiceData: any = null;

    if (isConnected) {
      invoiceData = await (Invoice as any).findById(id);
    } else {
      invoiceData = memoryStore.invoices.find(i => i._id === id);
    }

    if (!invoiceData) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const pdfBuffer = await generateInvoicePDF(invoiceData);
    await sendEmail({
      to: invoiceData.customerEmail,
      subject: `Official Event Bill #${invoiceData.invoiceNumber} - Vanamali Events Kerala`,
      html: getInvoiceEmailTemplate(invoiceData),
      attachments: [
        {
          filename: `${invoiceData.invoiceNumber}_Vanamali.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    if (isConnected) {
      await (Invoice as any).findByIdAndUpdate(id, { sentAt: new Date() });
    } else {
      invoiceData.sentAt = new Date().toISOString();
    }

    return res.json({ success: true, message: `Invoice #${invoiceData.invoiceNumber} successfully emailed to ${invoiceData.customerEmail}.` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
