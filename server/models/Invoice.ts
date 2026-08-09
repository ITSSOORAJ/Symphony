import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  cost: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  notes?: string;
  pdfPath?: string;
  sentAt?: Date;
  createdAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  bookingId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: String, required: true },
  items: [
    {
      description: { type: String, required: true },
      cost: { type: Number, required: true }
    }
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  notes: { type: String },
  pdfPath: { type: String },
  sentAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
