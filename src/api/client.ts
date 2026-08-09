import { MediaItem, Booking, Enquiry, Invoice, AdminUser } from '../types';

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('symphony_admin_token') || localStorage.getItem('vanamali_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  async getMe(): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Session expired');
    }
    return data.user;
  },

  // Media
  async getMedia(category?: string, type?: string): Promise<MediaItem[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (type) params.append('type', type);

    const res = await fetch(`${API_BASE}/media?${params.toString()}`);
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch media');
    return data.data;
  },

  async createMedia(media: Partial<MediaItem>): Promise<MediaItem> {
    const res = await fetch(`${API_BASE}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(media),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to add media');
    return data.data;
  },

  async deleteMedia(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/media/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete media');
  },

  // Bookings
  async createBooking(bookingData: any): Promise<{ message: string; data: Booking }> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to submit booking');
    return data;
  },

  async getBookings(status?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const res = await fetch(`${API_BASE}/bookings?${params.toString()}`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch bookings');
    return data.data;
  },

  async updateBookingStatus(id: string, status: string, totalAmount?: number): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status, totalAmount }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update booking');
    return data.data;
  },

  async deleteBooking(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete booking');
  },

  // Enquiries
  async createEnquiry(enquiryData: any): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to send enquiry');
    return data.data;
  },

  async getEnquiries(): Promise<Enquiry[]> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch enquiries');
    return data.data;
  },

  async updateEnquiryStatus(id: string, status: string): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update enquiry');
    return data.data;
  },

  async deleteEnquiry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete enquiry');
  },

  // Invoices
  async createInvoice(invoiceData: any): Promise<Invoice> {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(invoiceData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to generate invoice');
    return data.data;
  },

  async getInvoices(): Promise<Invoice[]> {
    const res = await fetch(`${API_BASE}/invoices`, {
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch invoices');
    return data.data;
  },

  async emailInvoice(id: string): Promise<string> {
    const res = await fetch(`${API_BASE}/invoices/${id}/email`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Failed to email invoice');
    return data.message;
  },

  getInvoicePdfUrl(id: string): string {
    return `${API_BASE}/invoices/${id}/pdf`;
  }
};
