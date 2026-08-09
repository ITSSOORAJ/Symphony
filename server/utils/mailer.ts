import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
  }>;
}

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || 'Vanamali Events Kerala <events@vanamalievents.com>';

  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
      });
      console.log(`[Nodemailer] Email successfully sent to ${options.to} - "${options.subject}"`);
      return true;
    } catch (error: any) {
      console.error('[Nodemailer] Error sending live email:', error.message || error);
    }
  }

  // Fallback dev log
  console.log(`\n==================================================`);
  console.log(`[MOCK EMAIL DISPATCH LOG]`);
  console.log(`TO: ${options.to}`);
  console.log(`FROM: ${from}`);
  console.log(`SUBJECT: ${options.subject}`);
  console.log(`ATTACHMENTS: ${options.attachments?.length || 0} file(s)`);
  console.log(`==================================================\n`);
  return true;
};

// HTML Email Templates for Kerala Events
export const getBookingReceiptTemplate = (booking: any) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0d8cc; border-radius: 12px; overflow: hidden; background-color: #fff8f0;">
      <div style="background-color: #064e3b; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 26px; font-weight: bold; letter-spacing: 1px;">VANAMALI EVENTS KERALA</h1>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #fde68a;">Traditional Elegance & Premium Event Management</p>
      </div>
      <div style="padding: 32px; color: #1f2937;">
        <h2 style="color: #064e3b; margin-top: 0;">Namaskaram, ${booking.customerDetails.name}!</h2>
        <p style="font-size: 15px; line-height: 1.6;">Thank you for choosing Vanamali Events for your upcoming <strong>${booking.eventType}</strong>. We have received your event booking request, and our event coordinator is reviewing your custom package.</p>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #d97706; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #92400e; font-size: 16px;">Booking Summary</h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Booking Reference:</strong> #${booking._id}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Event Type:</strong> ${booking.eventType}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Date:</strong> ${booking.eventDate}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Location / District:</strong> ${booking.location}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Estimated Guests:</strong> ${booking.guestCount} guests</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Services Selected:</strong> ${booking.selectedServices.join(', ')}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Status:</strong> <span style="display: inline-block; padding: 2px 10px; background-color: #fef3c7; color: #b45309; border-radius: 12px; font-weight: bold;">${booking.status}</span></p>
        </div>

        <p style="font-size: 14px; line-height: 1.6;">Our team will reach out to you at <strong>${booking.customerDetails.phone}</strong> shortly to discuss stage design options, menu preferences, and event scheduling.</p>

        <p style="margin-top: 32px; font-size: 14px; color: #4b5563;">Warm regards,<br><strong>Vanamali Event Operations Team</strong><br>Kochi | Thiruvananthapuram | Thrissur<br>Phone: +91 98470 12345</p>
      </div>
    </div>
  `;
};

export const getInvoiceEmailTemplate = (invoice: any) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #d1d5db; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #064e3b; padding: 24px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">VANAMALI EVENTS KERALA</h1>
        <p style="margin: 4px 0 0 0; color: #fde68a; font-size: 14px;">Official Event Bill & Invoice - #${invoice.invoiceNumber}</p>
      </div>
      <div style="padding: 28px; color: #1f2937;">
        <h2 style="color: #064e3b; margin-top: 0;">Invoice Confirmation</h2>
        <p style="font-size: 15px; line-height: 1.6;">Dear <strong>${invoice.customerName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6;">Your booking for <strong>${invoice.eventType}</strong> on <strong>${invoice.eventDate}</strong> has been officially approved! Please find attached your itemized invoice PDF.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <thead>
            <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
              <th style="text-align: left; padding: 10px;">Item / Service Description</th>
              <th style="text-align: right; padding: 10px;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((it: any) => `
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px;">${it.description}</td>
                <td style="padding: 10px; text-align: right;">₹${it.cost.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; font-size: 14px; text-align: right;">
          <p style="margin: 4px 0;">Subtotal: ₹${invoice.subtotal.toLocaleString('en-IN')}</p>
          ${invoice.tax ? `<p style="margin: 4px 0;">Tax (GST 5%): ₹${invoice.tax.toLocaleString('en-IN')}</p>` : ''}
          ${invoice.discount ? `<p style="margin: 4px 0; color: #059669;">Discount: -₹${invoice.discount.toLocaleString('en-IN')}</p>` : ''}
          <h3 style="margin: 8px 0 0 0; color: #064e3b; font-size: 18px;">Total Payable: ₹${invoice.totalAmount.toLocaleString('en-IN')}</h3>
        </div>

        <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">A formal PDF copy is attached to this email for your accounting records.</p>

        <p style="margin-top: 32px; font-size: 14px; color: #4b5563;">Warm regards,<br><strong>Accounts & Finance Dept</strong><br>Vanamali Events Kerala</p>
      </div>
    </div>
  `;
};
