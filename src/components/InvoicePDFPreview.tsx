import React from 'react';
import jsPDF from 'jspdf';
import { Download, Mail, CheckCircle, FileText, Printer } from 'lucide-react';
import { Invoice } from '../types';

interface InvoicePDFPreviewProps {
  invoice: Invoice;
  onSendEmail?: () => void;
  isSendingEmail?: boolean;
}

export const InvoicePDFPreview: React.FC<InvoicePDFPreviewProps> = ({
  invoice,
  onSendEmail,
  isSendingEmail = false,
}) => {
  // Generate PDF via jsPDF for client-side download
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Brand Header
    doc.setFillColor(6, 78, 59); // Emerald-950
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SYMPHONY EVENTS & CATERERS', 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(253, 230, 138); // Amber-200
    doc.text('Kerala Premier Event Architecture & Sadya Catering', 14, 25);

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE / BILL', 196, 20, { align: 'right' });

    // Customer & Invoice Details
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    doc.text('BILLED TO:', 14, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customerName || 'Customer', 14, 52);
    doc.setFontSize(9);
    doc.text(`Email: ${invoice.customerEmail}`, 14, 58);
    doc.text(`Phone: ${invoice.customerPhone}`, 14, 64);
    doc.text(`Event: ${invoice.eventType} (${invoice.eventDate})`, 14, 70);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('INVOICE DETAILS:', 130, 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 130, 52);
    doc.text(`Booking ID: #${invoice.bookingId}`, 130, 58);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}`, 130, 64);
    doc.text(`Status: Approved / Confirmed`, 130, 70);

    // Table Header
    let startY = 82;
    doc.setFillColor(243, 244, 246);
    doc.rect(14, startY, 182, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('#', 18, startY + 6);
    doc.text('Item Description', 30, startY + 6);
    doc.text('Amount (INR)', 190, startY + 6, { align: 'right' });

    // Table Rows
    startY += 12;
    doc.setFont('helvetica', 'normal');
    invoice.items.forEach((item, index) => {
      doc.text(`${index + 1}`, 18, startY);
      doc.text(item.description, 30, startY);
      doc.text(`INR ${item.cost.toLocaleString('en-IN')}`, 190, startY, { align: 'right' });
      doc.setDrawColor(229, 231, 235);
      doc.line(14, startY + 3, 196, startY + 3);
      startY += 10;
    });

    // Summary Box
    startY += 5;
    doc.setFillColor(249, 250, 251);
    doc.rect(110, startY, 86, 35, 'F');
    doc.setFontSize(9);

    doc.text('Subtotal:', 116, startY + 8);
    doc.text(`INR ${invoice.subtotal.toLocaleString('en-IN')}`, 190, startY + 8, { align: 'right' });

    doc.text('GST (5%):', 116, startY + 16);
    doc.text(`INR ${invoice.tax.toLocaleString('en-IN')}`, 190, startY + 16, { align: 'right' });

    if (invoice.discount) {
      doc.text('Discount:', 116, startY + 24);
      doc.text(`- INR ${invoice.discount.toLocaleString('en-IN')}`, 190, startY + 24, { align: 'right' });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(6, 78, 59);
    doc.text('Grand Total:', 116, startY + 32);
    doc.text(`INR ${invoice.totalAmount.toLocaleString('en-IN')}`, 190, startY + 32, { align: 'right' });

    // Terms & Footer
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for celebrating with Symphony Events & Caterers Kerala.', 14, 270);
    doc.text('Off: Panavally, Cherthala / Ernakulam | +91 98470 33413', 14, 275);

    doc.save(`${invoice.invoiceNumber}_Symphony.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden text-gray-900">
      {/* Visual Header */}
      <div className="bg-emerald-950 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold font-serif text-amber-100">SYMPHONY EVENTS & CATERERS</h2>
          </div>
          <p className="text-xs text-amber-200/70 mt-1">Official Event Bill & Tax Invoice</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-all"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          {onSendEmail && (
            <button
              onClick={onSendEmail}
              disabled={isSendingEmail}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-amber-200 border border-amber-500/30 font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              {isSendingEmail ? 'Dispatching...' : 'Email Client PDF'}
            </button>
          )}
        </div>
      </div>

      {/* Invoice Body */}
      <div className="p-6 md:p-8 space-y-6">
        
        {/* Metadata grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
          <div>
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Billed Customer</h4>
            <p className="font-bold text-gray-900 text-base">{invoice.customerName}</p>
            <p className="text-sm text-gray-600">{invoice.customerEmail}</p>
            <p className="text-sm text-gray-600">{invoice.customerPhone}</p>
            <p className="text-sm text-emerald-700 font-medium mt-1">Event: {invoice.eventType} ({invoice.eventDate})</p>
          </div>
          <div className="md:text-right">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Invoice Summary</h4>
            <p className="font-mono font-bold text-gray-900 text-base">{invoice.invoiceNumber}</p>
            <p className="text-xs text-gray-500">Booking Reference: #{invoice.bookingId}</p>
            <p className="text-xs text-gray-500">Issued Date: {new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
            {invoice.sentAt && (
              <p className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mt-2 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Dispatched to client email
              </p>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3">Itemized Event Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-y border-gray-200 text-gray-700 font-semibold text-xs">
                  <th className="p-3">#</th>
                  <th className="p-3">Service / Item Description</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-500 font-mono">{idx + 1}</td>
                    <td className="p-3 text-gray-800 font-medium">{item.description}</td>
                    <td className="p-3 text-right font-mono text-gray-900">₹{item.cost.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculations */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-mono">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (5%):</span>
              <span className="font-mono">₹{invoice.tax.toLocaleString('en-IN')}</span>
            </div>
            {invoice.discount ? (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount:</span>
                <span className="font-mono">-₹{invoice.discount.toLocaleString('en-IN')}</span>
              </div>
            ) : null}
            <div className="pt-2 border-t border-gray-300 flex justify-between font-bold text-emerald-950 text-base">
              <span>Grand Total:</span>
              <span className="font-mono text-amber-600">₹{invoice.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
