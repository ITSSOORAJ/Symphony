import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../../types';
import { api } from '../../api/client';
import { Calendar, Users, MapPin, CheckCircle2, XCircle, Clock, FileText, Trash2, Search, Filter } from 'lucide-react';
import { InvoiceGeneratorModal } from './InvoiceGeneratorModal';

export const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

  const fetchBookings = () => {
    setLoading(true);
    api.getBookings(selectedStatus === 'All' ? undefined : selectedStatus)
      .then(data => setBookings(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await api.updateBookingStatus(id, newStatus);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      await api.deleteBooking(id);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to delete booking');
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customerDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customerDetails.phone.includes(searchTerm) ||
    b.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Filter Bar */}
      <div className="bg-emerald-900/40 p-4 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-amber-500 text-emerald-950 font-bold'
                  : 'bg-emerald-950 text-amber-200/70 hover:bg-emerald-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl py-2 pl-9 pr-3 text-xs text-amber-100 placeholder-amber-200/40 focus:outline-none focus:border-amber-400"
          />
        </div>

      </div>

      {/* Bookings Table / Cards */}
      {loading ? (
        <div className="py-12 text-center text-amber-200/60 animate-pulse">Loading bookings database...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-12 text-center bg-emerald-900/20 rounded-2xl border border-amber-500/20 text-amber-200/60 text-sm">
          No booking records found matching search or filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((bk) => (
            <div
              key={bk._id}
              className="bg-emerald-900/40 p-5 rounded-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              
              {/* Left Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-amber-400/80 font-bold">#{bk._id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    bk.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    bk.status === 'Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    bk.status === 'Completed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {bk.status}
                  </span>
                  <span className="text-xs font-bold text-amber-200 font-serif">{bk.eventType}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-amber-100/80 pt-1">
                  <div>
                    <strong className="text-amber-300 block">Customer:</strong>
                    <span>{bk.customerDetails.name} ({bk.customerDetails.phone})</span>
                    <p className="text-[11px] text-amber-200/60 truncate">{bk.customerDetails.email}</p>
                  </div>
                  <div>
                    <strong className="text-amber-300 block">Date & Venue:</strong>
                    <span>{bk.eventDate} @ {bk.location}</span>
                  </div>
                  <div>
                    <strong className="text-amber-300 block">Guests & Services:</strong>
                    <span>{bk.guestCount} guests • {bk.selectedServices.length} service(s)</span>
                  </div>
                </div>

                {bk.notes && (
                  <p className="text-xs text-amber-200/60 italic bg-emerald-950/60 p-2 rounded-lg border border-amber-500/10 mt-1">
                    Note: &quot;{bk.notes}&quot;
                  </p>
                )}
              </div>

              {/* Right Action Controls */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                
                {/* Generate Invoice & Approve CTA */}
                <button
                  onClick={() => setSelectedBookingForInvoice(bk)}
                  className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow hover:brightness-110"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {bk.status === 'Approved' ? 'View/Edit Bill' : 'Approve & Bill'}
                </button>

                {/* Status Switcher Dropdown */}
                <select
                  value={bk.status}
                  onChange={(e) => handleStatusChange(bk._id, e.target.value as BookingStatus)}
                  className="bg-emerald-950 border border-amber-500/30 text-amber-200 text-xs rounded-xl p-2 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  onClick={() => handleDelete(bk._id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-xl"
                  title="Delete booking"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Invoice Generator Modal */}
      {selectedBookingForInvoice && (
        <InvoiceGeneratorModal
          booking={selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
          onSuccess={() => {
            fetchBookings();
          }}
        />
      )}

    </div>
  );
};
