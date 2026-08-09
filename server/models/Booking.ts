import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
  };
  eventType: string;
  location: string;
  eventDate: string;
  guestCount: number;
  selectedServices: string[];
  budgetRange?: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  totalAmount?: number;
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    city: { type: String }
  },
  eventType: { type: String, required: true },
  location: { type: String, required: true },
  eventDate: { type: String, required: true },
  guestCount: { type: Number, required: true },
  selectedServices: [{ type: String }],
  budgetRange: { type: String },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'], 
    default: 'Pending' 
  },
  totalAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
