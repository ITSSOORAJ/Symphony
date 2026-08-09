import bcrypt from 'bcryptjs';

export interface LocalMedia {
  _id: string;
  title: string;
  category: 'Kalyanam' | '28-Kett' | 'Corporate' | 'Stage Decor' | 'Cultural';
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  description?: string;
  createdAt: string;
}

export interface LocalBooking {
  _id: string;
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
  createdAt: string;
}

export interface LocalEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredCallbackTime?: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface LocalInvoiceItem {
  description: string;
  cost: number;
}

export interface LocalInvoice {
  _id: string;
  invoiceNumber: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  items: LocalInvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  notes?: string;
  pdfPath?: string;
  sentAt?: string;
  createdAt: string;
}

export interface LocalUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin';
  createdAt: string;
}

const defaultPasswordHash = bcrypt.hashSync('admin123', 10);

export const memoryStore = {
  users: [
    {
      _id: 'usr_admin_01',
      name: 'Symphony Admin Manager',
      email: 'admin@symphonyevents.com',
      passwordHash: defaultPasswordHash,
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_admin_02',
      name: 'Symphony Admin Manager',
      email: 'admin@vanamali.com',
      passwordHash: defaultPasswordHash,
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
    }
  ] as LocalUser[],

  media: [
    {
      _id: 'med_01',
      title: 'Royal Kasavu Kalyanam Stage Decor',
      category: 'Kalyanam',
      mediaType: 'image',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      description: 'Traditional Marigold floral mandapam with golden Kasavu drapes and brass Nilavilakku illumination.',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      _id: 'med_02',
      title: 'Grand Kerala Kalyanam Highlights',
      category: 'Kalyanam',
      mediaType: 'video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      description: 'Cinematic wedding highlight film from Bolgatty Palace, Kochi.',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
      _id: 'med_03',
      title: '28-Kett Naming Ceremony Cradle Setup',
      category: '28-Kett',
      mediaType: 'image',
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      description: 'Traditional wooden cradle adorned with fresh jasmine garland and royal silk backdrop.',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      _id: 'med_04',
      title: 'IT Hub Annual Corporate Tech Gala',
      category: 'Corporate',
      mediaType: 'image',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      description: 'High-tech LED stage lighting and sound setup for Infopark Kochi corporate awards.',
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      _id: 'med_05',
      title: 'Traditional Kerala Sadya Feast Setup',
      category: 'Cultural',
      mediaType: 'image',
      url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
      description: 'Authentic 28-item Ila Sadya serving setup for 1,200 wedding guests.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: 'med_06',
      title: 'Chenda Melam Cultural Procession',
      category: 'Cultural',
      mediaType: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-party-lights-in-a-dark-room-41553-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      description: 'Energizing Panchavadyam and Chenda Melam performance for grand reception.',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    }
  ] as LocalMedia[],

  bookings: [
    {
      _id: 'bk_1001',
      customerDetails: {
        name: 'Anjali Nair & Siddharth',
        email: 'anjali.nair.kerala@example.com',
        phone: '+91 98470 12345',
        address: 'Nair Villa, Panampilly Nagar',
        city: 'Ernakulam (Kochi)',
      },
      eventType: 'Kalyanam (Wedding)',
      location: 'Ernakulam (Kochi)',
      eventDate: '2026-11-15',
      guestCount: 850,
      selectedServices: [
        'Stage Decoration & Floral',
        'Traditional Kerala Sadya & Catering',
        'Sound, Intelligent Lighting & LED Wall',
        'Photography & Drone Videography',
        'Traditional Chenda Melam & Cultural Shows'
      ],
      budgetRange: '₹3,00,000 - ₹5,00,000',
      notes: 'Requesting lotus motif mandapam with live violin performance during Sadya.',
      status: 'Approved' as const,
      totalAmount: 385000,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      _id: 'bk_1002',
      customerDetails: {
        name: 'Dr. Gokul & Lakshmi',
        email: 'gokul.lakshmi@example.com',
        phone: '+91 94471 88990',
        address: 'Gurukripa, Kowdiar',
        city: 'Thiruvananthapuram',
      },
      eventType: '28-Kett (Naming)',
      location: 'Thiruvananthapuram',
      eventDate: '2026-09-20',
      guestCount: 200,
      selectedServices: [
        'Stage Decoration & Floral',
        'Traditional Kerala Sadya & Catering',
        'Photography & Drone Videography'
      ],
      budgetRange: '₹1,00,000 - ₹2,00,000',
      notes: 'Baby girl naming ceremony with delicate jasmine and pastel floral theme.',
      status: 'Pending' as const,
      totalAmount: 145000,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      _id: 'bk_1003',
      customerDetails: {
        name: 'Kerala Tech Solutions Pvt Ltd',
        email: 'events@keralatech.io',
        phone: '+91 97455 66778',
        address: 'Technopark Phase III',
        city: 'Thiruvananthapuram',
      },
      eventType: 'Corporate Party',
      location: 'Thiruvananthapuram',
      eventDate: '2026-10-05',
      guestCount: 400,
      selectedServices: [
        'Sound, Intelligent Lighting & LED Wall',
        'Anchor & Event Coordination'
      ],
      budgetRange: '₹2,00,000 - ₹3,00,000',
      notes: 'Annual Excellence Awards night with high-energy DJ and awards stage.',
      status: 'Pending' as const,
      totalAmount: 210000,
      createdAt: new Date().toISOString(),
    }
  ] as LocalBooking[],

  enquiries: [
    {
      _id: 'enq_2001',
      name: 'Ramesh Menon',
      email: 'ramesh.menon@example.com',
      phone: '+91 98950 44321',
      message: 'Looking for beachside destination wedding packages in Kovalam for December 2026.',
      preferredCallbackTime: 'Evening (5 PM - 8 PM)',
      status: 'New' as const,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: 'enq_2002',
      name: 'Sreeja Pillai',
      email: 'sreeja.p@example.com',
      phone: '+91 94002 11223',
      message: 'Need catering quote for 300 guests for housewarming Ila Sadya in Thrissur.',
      preferredCallbackTime: 'Morning (10 AM - 1 PM)',
      status: 'Contacted' as const,
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    }
  ] as LocalEnquiry[],

  invoices: [
    {
      _id: 'inv_3001',
      invoiceNumber: 'VAN-2026-001',
      bookingId: 'bk_1001',
      customerName: 'Anjali Nair & Siddharth',
      customerEmail: 'anjali.nair.kerala@example.com',
      customerPhone: '+91 98470 12345',
      eventType: 'Kalyanam (Wedding)',
      eventDate: '2026-11-15',
      items: [
        { description: 'Royal Kasavu Floral Stage Mandapam & Entrance Arch', cost: 120000 },
        { description: 'Traditional 28-Item Kerala Ila Sadya (850 Guests)', cost: 170000 },
        { description: 'Pro Sound System, Ambient Intelligent Lighting & 4K LED Screen', cost: 45000 },
        { description: 'Candid Photography, Cinematic Drone & Highlight Reel', cost: 50000 }
      ],
      subtotal: 385000,
      tax: 19250,
      discount: 10000,
      totalAmount: 394250,
      notes: 'Advance 50% payment received with thanks. Balance due 3 days prior to event date.',
      sentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    }
  ] as LocalInvoice[],
};
