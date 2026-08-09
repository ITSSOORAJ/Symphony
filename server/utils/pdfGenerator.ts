import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (invoiceData: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Header Banner / Styling
      doc.rect(0, 0, doc.page.width, 100).fill('#064e3b');

      // Title & Subtitle inside dark green banner
      doc.fillColor('#FFFFFF')
         .fontSize(22)
         .font('Helvetica-Bold')
         .text('VANAMALI EVENTS KERALA', 40, 30, { characterSpacing: 1 });

      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#fde68a')
         .text('Traditional Elegance & Premium Event Management | Pan-Kerala Operations', 40, 58);

      doc.fontSize(16)
         .font('Helvetica-Bold')
         .fillColor('#ffffff')
         .text('INVOICE / TAX BILL', 40, 72, { align: 'right' });

      // Invoice Details & Customer Info
      doc.fillColor('#111827').fontSize(10).font('Helvetica');

      const startY = 125;

      // Left Column - Billed To
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#064e3b').text('BILLED TO:', 40, startY);
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#111827').text(invoiceData.customerName || 'Valued Customer', 40, startY + 16);
      doc.font('Helvetica').fontSize(9).fillColor('#4b5563')
         .text(`Email: ${invoiceData.customerEmail || 'N/A'}`, 40, startY + 30)
         .text(`Phone: ${invoiceData.customerPhone || 'N/A'}`, 40, startY + 42)
         .text(`Event: ${invoiceData.eventType || 'Custom Event'} (${invoiceData.eventDate || ''})`, 40, startY + 54);

      // Right Column - Invoice Metadata
      const rightX = 350;
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#064e3b').text('INVOICE DETAILS:', rightX, startY);
      doc.font('Helvetica').fontSize(9).fillColor('#111827')
         .text(`Invoice No: ${invoiceData.invoiceNumber}`, rightX, startY + 16)
         .text(`Booking Ref: #${invoiceData.bookingId || 'N/A'}`, rightX, startY + 30)
         .text(`Date Issued: ${new Date(invoiceData.createdAt || Date.now()).toLocaleDateString('en-IN')}`, rightX, startY + 42)
         .text(`Payment Status: Approved / Confirmed`, rightX, startY + 54);

      // Table Header
      const tableY = startY + 80;
      doc.rect(40, tableY, doc.page.width - 80, 24).fill('#f3f4f6');
      doc.fillColor('#111827').font('Helvetica-Bold').fontSize(10);
      doc.text('SI', 50, tableY + 7);
      doc.text('Item / Service Description', 80, tableY + 7);
      doc.text('Amount (INR)', doc.page.width - 150, tableY + 7, { align: 'right', width: 100 });

      // Table Rows
      let currentY = tableY + 28;
      const items = invoiceData.items || [];

      items.forEach((item: any, index: number) => {
        if (currentY > 680) {
          doc.addPage();
          currentY = 50;
        }

        // Draw light horizontal divider
        doc.moveTo(40, currentY + 18).lineTo(doc.page.width - 40, currentY + 18).strokeColor('#e5e7eb').stroke();

        doc.fillColor('#374151').font('Helvetica').fontSize(9);
        doc.text(`${index + 1}`, 50, currentY);
        doc.text(item.description || 'Event Service', 80, currentY, { width: 330 });
        doc.text(`INR ${(item.cost || 0).toLocaleString('en-IN')}`, doc.page.width - 150, currentY, { align: 'right', width: 100 });

        currentY += 24;
      });

      // Total Breakdown Box
      currentY += 10;
      const boxX = doc.page.width - 240;
      doc.rect(boxX, currentY, 200, 90).fillAndStroke('#f9fafb', '#d1d5db');

      doc.fillColor('#374151').font('Helvetica').fontSize(9);
      doc.text('Subtotal:', boxX + 10, currentY + 10);
      doc.text(`INR ${(invoiceData.subtotal || 0).toLocaleString('en-IN')}`, boxX + 100, currentY + 10, { align: 'right', width: 80 });

      doc.text('GST (5%):', boxX + 10, currentY + 28);
      doc.text(`INR ${(invoiceData.tax || 0).toLocaleString('en-IN')}`, boxX + 100, currentY + 28, { align: 'right', width: 80 });

      if (invoiceData.discount) {
        doc.text('Discount:', boxX + 10, currentY + 44);
        doc.text(`- INR ${(invoiceData.discount).toLocaleString('en-IN')}`, boxX + 100, currentY + 44, { align: 'right', width: 80 });
      }

      doc.font('Helvetica-Bold').fontSize(11).fillColor('#064e3b');
      doc.text('Grand Total:', boxX + 10, currentY + 65);
      doc.text(`INR ${(invoiceData.totalAmount || 0).toLocaleString('en-IN')}`, boxX + 100, currentY + 65, { align: 'right', width: 80 });

      // Payment Terms & Notes
      const notesY = currentY + 110;
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#064e3b').text('Terms & Payment Information:', 40, notesY);
      doc.font('Helvetica').fontSize(8.5).fillColor('#4b5563')
         .text('1. Payment is accepted via UPI, NEFT/RTGS, or Bank Transfer to Vanamali Events account.', 40, notesY + 14)
         .text('2. 50% advance secures venue decoration slot, with remaining due on or before event date.', 40, notesY + 26)
         .text(`3. Note: ${invoiceData.notes || 'Thank you for choosing Vanamali Events Kerala!'}`, 40, notesY + 38);

      // Stamp / Signature Footer
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#111827').text('For Vanamali Events Kerala', doc.page.width - 200, notesY + 50, { align: 'center' });
      doc.font('Helvetica').fontSize(8).fillColor('#6b7280').text('Authorized Signatory', doc.page.width - 200, notesY + 70, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
