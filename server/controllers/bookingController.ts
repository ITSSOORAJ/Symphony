import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { getIsConnected } from '../config/db';
import { memoryStore } from '../config/store';
import { sendEmail, getBookingReceiptTemplate } from '../utils/mailer';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { customerDetails, eventType, location, eventDate, guestCount, selectedServices, budgetRange, notes } = req.body;

    if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      return res.status(400).json({ success: false, message: 'Customer name, email, and phone are required.' });
    }

    if (!eventType || !location || !eventDate || !guestCount) {
      return res.status(400).json({ success: false, message: 'Event type, location, date, and guest count are required.' });
    }

    const isConnected = getIsConnected();
    let createdBooking: any = null;

    if (isConnected) {
      const booking = new Booking({
        customerDetails,
        eventType,
        location,
        eventDate,
        guestCount: Number(guestCount),
        selectedServices: selectedServices || [],
        budgetRange,
        notes,
        status: 'Pending',
      });
      await booking.save();
      createdBooking = booking.toObject();
      createdBooking._id = booking._id.toString();
    } else {
      createdBooking = {
        _id: 'bk_' + Date.now(),
        customerDetails,
        eventType,
        location,
        eventDate,
        guestCount: Number(guestCount),
        selectedServices: selectedServices || [],
        budgetRange,
        notes,
        status: 'Pending' as const,
        createdAt: new Date().toISOString(),
      };
      memoryStore.bookings.unshift(createdBooking);
    }

    // Trigger instant email receipt to client
    sendEmail({
      to: customerDetails.email,
      subject: `Booking Request Received: ${eventType} - Vanamali Events Kerala`,
      html: getBookingReceiptTemplate(createdBooking),
    }).catch(err => console.error('Background booking email error:', err));

    return res.status(201).json({
      success: true,
      message: 'Booking submitted successfully! An instant receipt has been emailed to you.',
      data: createdBooking,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const isConnected = getIsConnected();

    if (isConnected) {
      const query: any = {};
      if (status && status !== 'All') query.status = status;
      const bookings = await Booking.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: bookings.length, data: bookings });
    } else {
      let filtered = [...memoryStore.bookings];
      if (status && status !== 'All') {
        filtered = filtered.filter(b => b.status === status);
      }
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, totalAmount } = req.body;

    if (!['Pending', 'Approved', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status.' });
    }

    const isConnected = getIsConnected();
    let updated: any = null;

    if (isConnected) {
      updated = await (Booking as any).findByIdAndUpdate(
        id,
        { status, ...(totalAmount !== undefined && { totalAmount: Number(totalAmount) }) },
        { new: true }
      );
    } else {
      const item = memoryStore.bookings.find(b => b._id === id);
      if (item) {
        item.status = status as any;
        if (totalAmount !== undefined) item.totalAmount = Number(totalAmount);
        updated = item;
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    return res.json({ success: true, message: `Booking status updated to ${status}.`, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    if (isConnected) {
      await (Booking as any).findByIdAndDelete(id);
    } else {
      memoryStore.bookings = memoryStore.bookings.filter(b => b._id !== id);
    }

    return res.json({ success: true, message: 'Booking deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
