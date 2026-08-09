import { Request, Response } from 'express';
import Enquiry from '../models/Enquiry';
import { getIsConnected } from '../config/db';
import { memoryStore } from '../config/store';

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, preferredCallbackTime } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and message are required.' });
    }

    const isConnected = getIsConnected();
    let created: any = null;

    if (isConnected) {
      const enquiry = new Enquiry({
        name,
        email,
        phone,
        message,
        preferredCallbackTime,
        status: 'New',
      });
      await enquiry.save();
      created = enquiry;
    } else {
      created = {
        _id: 'enq_' + Date.now(),
        name,
        email,
        phone,
        message,
        preferredCallbackTime,
        status: 'New' as const,
        createdAt: new Date().toISOString(),
      };
      memoryStore.enquiries.unshift(created);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been submitted. Our team will contact you shortly.',
      data: created,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const isConnected = getIsConnected();

    if (isConnected) {
      const list = await Enquiry.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: list.length, data: list });
    } else {
      const list = [...memoryStore.enquiries].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Contacted', 'Closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry status.' });
    }

    const isConnected = getIsConnected();
    let updated: any = null;

    if (isConnected) {
      updated = await (Enquiry as any).findByIdAndUpdate(id, { status }, { new: true });
    } else {
      const item = memoryStore.enquiries.find(e => e._id === id);
      if (item) {
        item.status = status as any;
        updated = item;
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isConnected = getIsConnected();

    if (isConnected) {
      await (Enquiry as any).findByIdAndDelete(id);
    } else {
      memoryStore.enquiries = memoryStore.enquiries.filter(e => e._id !== id);
    }

    return res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
