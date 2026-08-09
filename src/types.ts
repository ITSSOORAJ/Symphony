export type EventType = 'Kalyanam (Wedding)' | '28-Kett (Naming)' | 'Corporate Party' | 'Office Event' | 'Birthday Party' | 'Custom Event';

export type KeralaDistrict = 
  | 'Thiruvananthapuram'
  | 'Kollam'
  | 'Pathanamthitta'
  | 'Alappuzha'
  | 'Kottayam'
  | 'Idukki'
  | 'Ernakulam (Kochi)'
  | 'Thrissur'
  | 'Palakkad'
  | 'Malappuram'
  | 'Kozhikode'
  | 'Wayanad'
  | 'Kannur'
  | 'Kasaragod';

export type ServiceOption = 
  | 'Stage Decoration & Floral'
  | 'Traditional Kerala Sadya & Catering'
  | 'Sound, Intelligent Lighting & LED Wall'
  | 'Photography & Drone Videography'
  | 'Bridal Makeup & Styling'
  | 'Traditional Chenda Melam & Cultural Shows'
  | 'Anchor & Event Coordination';

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
}

export interface Booking {
  _id: string;
  customerDetails: CustomerDetails;
  eventType: EventType;
  location: KeralaDistrict | string;
  eventDate: string;
  guestCount: number;
  selectedServices: ServiceOption[];
  budgetRange?: string;
  notes?: string;
  status: BookingStatus;
  totalAmount?: number;
  createdAt: string;
}

export type MediaCategory = 'Kalyanam' | '28-Kett' | 'Corporate' | 'Stage Decor' | 'Cultural' | 'All';
export type MediaType = 'image' | 'video';

export interface MediaItem {
  _id: string;
  title: string;
  category: MediaCategory;
  mediaType: MediaType;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  createdAt: string;
}

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredCallbackTime?: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  cost: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  notes?: string;
  pdfPath?: string;
  sentAt?: string;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
  token?: string;
}
