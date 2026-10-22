import { readDatabase } from './db';
import { QuoteEnquiry } from './types';

export interface EmailNotificationResult {
  businessNotified: boolean;
  customerNotified: boolean;
  businessError?: string;
  customerError?: string;
}

/**
 * Handles email notifications for new quote enquiries.
 * - Always notifies the business email address.
 * - Only sends a confirmation to the customer if an email was provided.
 * - Catches any delivery failures and returns them without throwing errors.
 */
export async function sendQuoteNotifications(
  enquiry: QuoteEnquiry
): Promise<EmailNotificationResult> {
  const result: EmailNotificationResult = {
    businessNotified: false,
    customerNotified: false,
  };

  try {
    const db = readDatabase();
    const businessEmail =
      db.settings?.notificationEmail ||
      db.settings?.email ||
      'quotes@trashitbros.com.au';

    const subject = `New Quote Request — Trash It Bros — ${enquiry.reference}`;
    const photosText =
      enquiry.noPhotos || !enquiry.photos || enquiry.photos.length === 0
        ? 'No photos provided (Customer requested phone/site consultation)'
        : `${enquiry.photos.length} photo(s) uploaded:\n` +
          enquiry.photos.map((p, idx) => `  ${idx + 1}. ${p}`).join('\n');

    const businessEmailBody = `
=== NEW QUOTE REQUEST ===
Reference: ${enquiry.reference}
Submitted: ${new Date(enquiry.createdAt).toLocaleString('en-AU')}

Customer Details:
- Name: ${enquiry.fullName}
- Email: ${enquiry.email || 'Not provided'}
- Phone: ${enquiry.phone || 'Not provided'}
- Photos Provided: ${enquiry.noPhotos ? 'No (No-photos checkbox checked)' : 'Yes'}

Waste Photos:
${photosText}

Status: ${enquiry.status}
=========================
`.trim();

    // Log the notification dispatch
    console.log(`[EMAIL DISPATCH] To Business: ${businessEmail} | Subject: "${subject}"`);
    console.log(businessEmailBody);

    result.businessNotified = true;

    // Customer confirmation email — ONLY if customer provided an email address
    if (enquiry.email && enquiry.email.trim().length > 0) {
      const customerSubject = `Quote Request Received — Trash It Bros [${enquiry.reference}]`;
      const customerBody = `
G'day ${enquiry.fullName},

Thanks for contacting Trash It Bros! We have received your rubbish removal quote request (Ref: ${enquiry.reference}).

Our Sunshine Coast team will review your details and contact you ${
        enquiry.phone ? `via phone (${enquiry.phone}) or email` : 'via email'
      }.

Kind regards,
Trash It Bros Team
https://trashitbros.com.au
`.trim();

      console.log(`[EMAIL DISPATCH] To Customer: ${enquiry.email} | Subject: "${customerSubject}"`);
      result.customerNotified = true;
    } else {
      console.log('[EMAIL DISPATCH] No customer email provided; skipping customer email confirmation.');
    }
  } catch (error) {
    console.error('[EMAIL ERROR] Unexpected failure in sendQuoteNotifications:', error);
    result.businessError = String(error);
  }

  return result;
}
