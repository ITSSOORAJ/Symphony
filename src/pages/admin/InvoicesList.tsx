import React, { useState, useEffect } from 'react';
import { Invoice } from '../../types';
import { api } from '../../api/client';
import { Download, Mail, CheckCircle2, FileText } from 'lucide-react';
import { InvoicePDFPreview } from '../../components/InvoicePDFPreview';

export const InvoicesList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = () => {
    setLoading(true);
    api.getInvoices()
      .then(data => setInvoices(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleEmailInvoice = async (id: string) => {
    try {
      const msg = await api.emailInvoice(id);
      alert(msg);
      fetchInvoices();
    } catch (err: any) {
      alert(err.message || 'Failed to email invoice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-900/40 p-5 rounded-2xl border border-amber-500/20 flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-lg text-amber-300">Generated Bills & Invoices</h3>
          <p className="text-xs text-amber-100/70">View all tax bills, download PDF Kit invoices, or resend email attachments.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-amber-200/60 animate-pulse">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="py-12 text-center bg-emerald-900/20 rounded-2xl border border-amber-500/20 text-amber-200/60 text-sm">
          No generated invoice records found.
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv._id}
              className="bg-emerald-900/30 p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-amber-400">{inv.invoiceNumber}</span>
                  <span className="text-xs text-amber-200/60">• Booking Ref: #{inv.bookingId}</span>
                </div>
                <p className="text-sm font-bold text-amber-100">{inv.customerName} ({inv.customerEmail})</p>
                <p className="text-xs text-amber-200/70">{inv.eventType} ({inv.eventDate}) • Total: <strong className="text-amber-300">₹{inv.totalAmount.toLocaleString('en-IN')}</strong></p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={api.getInvoicePdfUrl(inv._id)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-amber-500 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-amber-400 shadow"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </a>
                <button
                  onClick={() => handleEmailInvoice(inv._id)}
                  className="px-3 py-2 bg-emerald-800 text-amber-200 border border-amber-500/30 font-semibold text-xs rounded-xl flex items-center gap-1 hover:bg-emerald-700"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Resend Email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
