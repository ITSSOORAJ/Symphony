import mongoose from 'mongoose';
import User from '../models/User';
import Media from '../models/Media';
import Booking from '../models/Booking';
import Enquiry from '../models/Enquiry';
import Invoice from '../models/Invoice';
import { memoryStore } from './store';

let isMongooseConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kerala_events';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongooseConnected = true;
    console.log(`[MongoDB] Connected successfully to ${uri}`);

    // Auto-seed initial data into MongoDB if collections are empty
    await seedInitialData();

    return true;
  } catch (err: any) {
    console.warn(`[MongoDB] Connection notice: ${err.message || err}. Operating with hybrid resilient datastore for instant readiness.`);
    isMongooseConnected = false;
    return false;
  }
};

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0 && memoryStore.users.length > 0) {
      await (User as any).insertMany(
        memoryStore.users.map(u => ({
          name: u.name,
          email: u.email,
          passwordHash: u.passwordHash,
          role: u.role,
          createdAt: u.createdAt,
        }))
      );
      console.log('[MongoDB Seeder] Admin users seeded.');
    }

    const mediaCount = await Media.countDocuments();
    if (mediaCount === 0 && memoryStore.media.length > 0) {
      await (Media as any).insertMany(
        memoryStore.media.map(m => ({
          title: m.title,
          category: m.category,
          mediaType: m.mediaType,
          url: m.url,
          thumbnailUrl: m.thumbnailUrl,
          description: m.description,
          createdAt: m.createdAt,
        }))
      );
      console.log('[MongoDB Seeder] Media gallery items seeded.');
    }

    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0 && memoryStore.bookings.length > 0) {
      await (Booking as any).insertMany(
        memoryStore.bookings.map(b => ({
          customerDetails: b.customerDetails,
          eventType: b.eventType,
          location: b.location,
          eventDate: b.eventDate,
          guestCount: b.guestCount,
          selectedServices: b.selectedServices,
          budgetRange: b.budgetRange,
          notes: b.notes,
          status: b.status,
          totalAmount: b.totalAmount,
          createdAt: b.createdAt,
        }))
      );
      console.log('[MongoDB Seeder] Sample bookings seeded.');
    }

    const enquiryCount = await Enquiry.countDocuments();
    if (enquiryCount === 0 && memoryStore.enquiries.length > 0) {
      await (Enquiry as any).insertMany(
        memoryStore.enquiries.map(e => ({
          name: e.name,
          email: e.email,
          phone: e.phone,
          message: e.message,
          preferredCallbackTime: e.preferredCallbackTime,
          status: e.status,
          createdAt: e.createdAt,
        }))
      );
      console.log('[MongoDB Seeder] Sample enquiries seeded.');
    }

    const invoiceCount = await Invoice.countDocuments();
    if (invoiceCount === 0 && memoryStore.invoices.length > 0) {
      await (Invoice as any).insertMany(
        memoryStore.invoices.map(i => ({
          invoiceNumber: i.invoiceNumber,
          bookingId: i.bookingId,
          customerName: i.customerName,
          customerEmail: i.customerEmail,
          customerPhone: i.customerPhone,
          eventType: i.eventType,
          eventDate: i.eventDate,
          items: i.items,
          subtotal: i.subtotal,
          tax: i.tax,
          discount: i.discount,
          totalAmount: i.totalAmount,
          notes: i.notes,
          sentAt: i.sentAt,
          createdAt: i.createdAt,
        }))
      );
      console.log('[MongoDB Seeder] Sample invoices seeded.');
    }
  } catch (seedErr) {
    console.warn('[MongoDB Seeder] Notice during auto-seeding:', seedErr);
  }
};

export const getIsConnected = () => isMongooseConnected;
