import { Resend } from 'resend';

/**
 * Transactional email via Resend. Requires RESEND_API_KEY and EMAIL_FROM
 * (a verified sender on the Resend account, e.g. "بلدية عيدمون <no-reply@example.com>").
 */
export function isMailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendMail(options: { to: string; subject: string; html: string; text: string }): Promise<void> {
  if (!isMailerConfigured()) {
    throw new Error('Mailer is not configured: set RESEND_API_KEY and EMAIL_FROM');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export function passwordResetEmail(resetUrl: string): { subject: string; html: string; text: string } {
  const subject = 'إعادة تعيين كلمة المرور - بلدية عيدمون شيخلار';
  const text = `لقد طلبت إعادة تعيين كلمة المرور لحسابك في موقع بلدية عيدمون شيخلار.\n\nافتح الرابط التالي لاختيار كلمة مرور جديدة (صالح لمدة ساعة واحدة):\n${resetUrl}\n\nإذا لم تطلب ذلك، تجاهل هذه الرسالة.`;
  const html = `
  <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1f2937;">
    <h2 style="color: #1d4ed8;">إعادة تعيين كلمة المرور</h2>
    <p>لقد طلبت إعادة تعيين كلمة المرور لحسابك في موقع بلدية عيدمون شيخلار.</p>
    <p>اضغط على الزر التالي لاختيار كلمة مرور جديدة. الرابط صالح لمدة ساعة واحدة.</p>
    <p style="margin: 24px 0;">
      <a href="${resetUrl}" style="background: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">إعادة تعيين كلمة المرور</a>
    </p>
    <p style="font-size: 12px; color: #6b7280;">إذا لم يعمل الزر، انسخ هذا الرابط إلى المتصفح:<br />${resetUrl}</p>
    <p style="font-size: 12px; color: #6b7280;">إذا لم تطلب ذلك، تجاهل هذه الرسالة.</p>
  </div>`;
  return { subject, html, text };
}
