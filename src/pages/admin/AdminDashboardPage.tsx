import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { BookingManagement } from './BookingManagement';
import { MediaManagement } from './MediaManagement';
import { EnquiryManagement } from './EnquiryManagement';
import { InvoicesList } from './InvoicesList';
import { 
  ShieldCheck, Calendar, Image as ImageIcon, MessageSquare, 
  FileText, LogOut, TrendingUp, Users, CheckCircle2, Sparkles 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'bookings' | 'media' | 'enquiries' | 'invoices'>('bookings');
  
  // Dashboard Metrics
  const [stats, setStats] = useState({
    pendingBookings: 0,
    approvedBookings: 0,
    totalMedia: 0,
    newEnquiries: 0,
    estimatedRevenue: 0,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      Promise.all([
        api.getBookings(),
        api.getMedia(),
        api.getEnquiries(),
      ])
        .then(([bookings, media, enquiries]) => {
          const pending = bookings.filter(b => b.status === 'Pending').length;
          const approved = bookings.filter(b => b.status === 'Approved').length;
          const revenue = bookings
            .filter(b => b.status === 'Approved' || b.status === 'Completed')
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

          setStats({
            pendingBookings: pending,
            approvedBookings: approved,
            totalMedia: media.length,
            newEnquiries: enquiries.filter(e => e.status === 'New').length,
            estimatedRevenue: revenue,
          });
        })
        .catch(err => console.error(err));
    }
  }, [user, activeTab]);

  if (isLoading || !user) {
    return (
      <div className="bg-emerald-950 min-h-screen text-amber-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <ShieldCheck className="w-10 h-10 text-amber-400 animate-pulse mx-auto" />
          <p className="text-sm text-amber-200">Verifying Admin Permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#E5E5E5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Control Bar - Bento Card */}
        <div className="bento-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold serif text-white flex items-center gap-2">
                Admin Control Center <span className="text-[10px] font-sans uppercase font-bold bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">Symphony</span>
              </h1>
              <p className="text-xs text-white/50">Logged in as {user.name} ({user.email})</p>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="px-4 py-2 bg-white/5 text-red-400 border border-red-500/20 hover:bg-red-500/10 font-semibold text-xs rounded-full flex items-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" /> Sign Out
          </button>
        </div>

        {/* Dashboard Bento Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bento-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Pending Bookings</span>
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold serif gold-text">{stats.pendingBookings}</p>
              <p className="text-[11px] text-white/50 mt-1">Awaiting approval</p>
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Approved Revenue</span>
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold serif text-white">₹{stats.estimatedRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-white/50 mt-1">{stats.approvedBookings} approved events</p>
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">New Inquiries</span>
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold serif text-white">{stats.newEnquiries}</p>
              <p className="text-[11px] text-white/50 mt-1">Pending callbacks</p>
            </div>
          </div>

          <div className="bento-card p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Gallery Media</span>
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold serif text-white">{stats.totalMedia}</p>
              <p className="text-[11px] text-white/50 mt-1">Showcase assets</p>
            </div>
          </div>
        </div>

        {/* Bento Navigation Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Bookings Management
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'media'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Gallery CMS
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'enquiries'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Callback Enquiries
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all ${
              activeTab === 'invoices'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Generated Invoices
          </button>
        </div>

        {/* Tab Content Area Container */}
        <div className="bento-card p-6 sm:p-8 min-h-[400px]">
          {activeTab === 'bookings' && <BookingManagement />}
          {activeTab === 'media' && <MediaManagement />}
          {activeTab === 'enquiries' && <EnquiryManagement />}
          {activeTab === 'invoices' && <InvoicesList />}
        </div>

      </div>
    </div>
  );
};
