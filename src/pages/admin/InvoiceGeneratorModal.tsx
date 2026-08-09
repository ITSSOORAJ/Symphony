import React, { useState } from 'react';
import { Booking, InvoiceItem } from '../../types';
import { api } from '../../api/client';
import { X, Plus, Trash2, Send, FileText, CheckCircle2 } from 'lucide-react';
import { InvoicePDFPreview } from '../../components/InvoicePDFPreview';

interface InvoiceGeneratorModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export const InvoiceGeneratorModal: React.FC<InvoiceGeneratorModalProps> = ({
  booking,
  onClose,
  onSuccess,
}) => {
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: `Stage Decor & Floral Setup for ${booking.eventType}`, cost: 75000 },
    { description: `Traditional Kerala Sadya / Catering (${booking.guestCount} guests)`, cost: Math.round(booking.guestCount * 220) },
    { description: 'Pro Sound System, Intelligent Lighting & Ambient Effects', cost: 35000 },
  ]);

  const [taxPercent, setTaxPercent] = useState(5);
  const [discount, setDiscount] = useState(5000);
  const [notes, setNotes] = useState('50% advance payment received. Balance due 3 days prior to event date.');
  const [sendEmailAttachment, setSendEmailAttachment] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const addItem = () => {
    setItems([...items, { description: '', cost: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  const taxAmount = Math.round(subtotal * (taxPercent / 100));
  const grandTotal = Math.max(0, subtotal + taxAmount - Number(discount));

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(i => !i.description.trim() || i.cost <= 0)) {
      setErrorMsg('Please fill in valid descriptions and costs for all item lines.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const payload = {
        bookingId: booking._id,
        customerName: booking.customerDetails.name,
        customerEmail: booking.customerDetails.email,
        customerPhone: booking.customerDetails.phone,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        items,
        taxPercent,
        discount,
        notes,
        autoApproveBooking: true,
        sendEmailAttachment,
      };

      const result = await api.createInvoice(payload);
      setGeneratedInvoice(result);
      if (sendEmailAttachment) {
        setEmailStatus(`Invoice successfully created & dispatched to ${booking.customerDetails.email}`);
      } else {
        setEmailStatus(`Invoice generated. Booking status updated to Approved.`);
      }
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate invoice.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReEmail = async () => {
    if (!generatedInvoice?._id) return;
    setIsSendingEmail(true);
    try {
      const msg = await api.emailInvoice(generatedInvoice._id);
      setEmailStatus(msg);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to email invoice');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-emerald-950 border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 bg-emerald-900 border-b border-amber-500/20 text-amber-100">
          <div>
            <h3 className="font-serif font-bold text-xl text-amber-300 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" /> Bill & Invoice Generator
            </h3>
            <p className="text-xs text-amber-200/70">
              Generating itemized tax invoice for booking #{booking._id} ({booking.customerDetails.name})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-emerald-800 text-amber-200 hover:bg-emerald-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {emailStatus && (
            <div className="p-4 rounded-xl bg-emerald-900/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{emailStatus}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-900/60 border border-red-500 text-red-200 text-xs">
              {errorMsg}
            </div>
          )}

          {!generatedInvoice ? (
            <form onSubmit={handleGenerateInvoice} className="space-y-6 text-amber-100">
              
              {/* Customer Info Bar */}
              <div className="p-4 rounded-2xl bg-emerald-900/40 border border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-amber-300 font-bold block">Client Name</span>
                  <span className="text-amber-100">{booking.customerDetails.name}</span>
                </div>
                <div>
                  <span className="text-amber-300 font-bold block">Email</span>
                  <span className="text-amber-100 truncate block">{booking.customerDetails.email}</span>
                </div>
                <div>
                  <span className="text-amber-300 font-bold block">Event & Date</span>
                  <span className="text-amber-100">{booking.eventType} ({booking.eventDate})</span>
                </div>
                <div>
                  <span className="text-amber-300 font-bold block">Guest Estimate</span>
                  <span className="text-amber-100">{booking.guestCount} guests</span>
                </div>
              </div>

              {/* Itemized Lines Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Itemized Line Items</h4>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1 bg-amber-500 text-emerald-950 font-bold text-xs rounded-lg flex items-center gap-1 hover:bg-amber-400"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Line Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Service description..."
                        value={item.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        className="flex-1 bg-emerald-900/80 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="number"
                        placeholder="Cost (₹)"
                        value={item.cost || ''}
                        onChange={(e) => updateItem(idx, 'cost', Number(e.target.value))}
                        className="w-32 bg-emerald-900/80 border border-amber-500/30 rounded-xl p-2.5 text-xs font-mono text-amber-100 focus:outline-none focus:border-amber-400"
                      />
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-900/30 p-4 rounded-2xl border border-amber-500/20 text-xs">
                <div>
                  <label className="block text-amber-300 font-bold mb-1">Subtotal</label>
                  <p className="font-mono text-base font-bold text-amber-100">₹{subtotal.toLocaleString('en-IN')}</p>
                </div>

                <div>
                  <label className="block text-amber-300 font-bold mb-1">GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full bg-emerald-950 border border-amber-500/30 rounded-lg p-2 text-xs text-amber-100"
                  />
                  <span className="text-[10px] text-amber-200/50 mt-0.5 block">Tax: ₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <label className="block text-amber-300 font-bold mb-1">Special Discount (₹)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full bg-emerald-950 border border-amber-500/30 rounded-lg p-2 text-xs text-amber-100"
                  />
                </div>
              </div>

              {/* Terms / Notes */}
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">Invoice Notes & Payment Terms</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-emerald-900/80 border border-amber-500/30 rounded-xl p-2.5 text-xs text-amber-100"
                />
              </div>

              {/* Auto Action Options */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmailAttachment}
                  onChange={(e) => setSendEmailAttachment(e.target.checked)}
                  className="accent-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="sendEmail" className="text-xs text-amber-200 cursor-pointer font-medium">
                  Dispatch email notification with attached PDF invoice to client ({booking.customerDetails.email})
                </label>
              </div>

              {/* Grand Total & Action buttons */}
              <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-amber-300 uppercase font-bold">Calculated Grand Total</p>
                  <p className="text-2xl font-serif font-bold text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-900 text-amber-200 rounded-xl text-xs font-semibold hover:bg-emerald-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
                  >
                    <Send className="w-4 h-4 fill-emerald-950" />
                    {isGenerating ? 'Generating PDF...' : 'Approve Booking & Create Invoice'}
                  </button>
                </div>
              </div>

            </form>
          ) : (
            <div className="space-y-6">
              <InvoicePDFPreview
                invoice={generatedInvoice}
                onSendEmail={handleReEmail}
                isSendingEmail={isSendingEmail}
              />

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-800 text-amber-200 rounded-xl text-xs font-semibold hover:bg-emerald-700"
                >
                  Done & Close Modal
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
