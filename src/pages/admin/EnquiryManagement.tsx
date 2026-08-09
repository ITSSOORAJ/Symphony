import React, { useState, useEffect } from 'react';
import { Enquiry } from '../../types';
import { api } from '../../api/client';
import { Mail, Phone, Clock, MessageSquare, Trash2, CheckCircle } from 'lucide-react';

export const EnquiryManagement: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = () => {
    setLoading(true);
    api.getEnquiries()
      .then(data => setEnquiries(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateEnquiryStatus(id, newStatus);
      fetchEnquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to update enquiry status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    try {
      await api.deleteEnquiry(id);
      fetchEnquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to delete enquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-900/40 p-5 rounded-2xl border border-amber-500/20">
        <h3 className="font-serif font-bold text-lg text-amber-300">Client Callback & Inquiry Logs</h3>
        <p className="text-xs text-amber-100/70">Review customer contact requests, preferred callback times, and event messages.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-amber-200/60 animate-pulse">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="py-12 text-center bg-emerald-900/20 rounded-2xl border border-amber-500/20 text-amber-200/60 text-sm">
          No enquiries found in database.
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-emerald-900/30 p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    enq.status === 'New' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    enq.status === 'Contacted' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {enq.status}
                  </span>
                  <strong className="text-amber-100 font-bold text-sm">{enq.name}</strong>
                  <span className="text-xs text-amber-200/50">• {new Date(enq.createdAt).toLocaleDateString('en-IN')}</span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-amber-200/80">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> {enq.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-400" /> {enq.email}</span>
                  {enq.preferredCallbackTime && (
                    <span className="flex items-center gap-1 text-amber-300 font-semibold"><Clock className="w-3.5 h-3.5" /> Callback: {enq.preferredCallbackTime}</span>
                  )}
                </div>

                <div className="bg-emerald-950/60 p-3 rounded-xl border border-amber-500/10 text-xs text-amber-100/90 flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>&quot;{enq.message}&quot;</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={enq.status}
                  onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                  className="bg-emerald-950 border border-amber-500/30 text-amber-200 text-xs rounded-xl p-2 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>

                <button
                  onClick={() => handleDelete(enq._id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-xl"
                  title="Delete enquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
