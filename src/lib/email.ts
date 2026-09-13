import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || "Learnivia <onboarding@resend.dev>";

export async function sendBookingConfirmation(
  studentEmail: string,
  tutorEmail: string,
  details: {
    studentName: string;
    tutorName: string;
    subject: string;
    startTime: string; // ISO string
    zoomLink: string;
  }
) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping booking confirmation email.");
    return;
  }

  const date = new Date(details.startTime).toLocaleString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  try {
    // Send to Student
    await resend.emails.send({
      from: FROM_EMAIL,
      to: studentEmail,
      subject: `Booking Confirmed: ${details.subject} with ${details.tutorName}`,
      html: `
        <h2>Your tutoring session is confirmed!</h2>
        <p>Hi ${details.studentName},</p>
        <p>You have a confirmed session with <strong>${details.tutorName}</strong> for <strong>${details.subject}</strong>.</p>
        <p><strong>When:</strong> ${date}</p>
        <p><strong>Where:</strong> <a href="${details.zoomLink}">Join Zoom Meeting</a></p>
        <p>Thank you for using Learnivia!</p>
      `,
    });

    // Send to Tutor
    await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject: `New Booking: ${details.subject} with ${details.studentName}`,
      html: `
        <h2>You have a new booking!</h2>
        <p>Hi ${details.tutorName},</p>
        <p><strong>${details.studentName}</strong> just booked a session for <strong>${details.subject}</strong>.</p>
        <p><strong>When:</strong> ${date}</p>
        <p><strong>Where:</strong> <a href="${details.zoomLink}">Start Zoom Meeting</a></p>
        <p>Please log in to your dashboard to view more details.</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send booking confirmation emails:", error);
  }
}

export async function sendApplicationReceived(tutorEmail: string, tutorName: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping application received email.");
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject: "Volunteer Application Received - Learnivia",
      html: `
        <h2>Application Received!</h2>
        <p>Hi ${tutorName},</p>
        <p>Thank you for applying to be a volunteer tutor on Learnivia. We have received your application.</p>
        <p>Our team will review your details and get back to you within 3-5 working days.</p>
        <p>Best,<br>The Learnivia Team</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send application received email:", error);
  }
}

export async function sendApplicationApproved(tutorEmail: string, tutorName: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping application approved email.");
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject: "Welcome to Learnivia! Your application is approved",
      html: `
        <h2>You're approved! 🎉</h2>
        <p>Hi ${tutorName},</p>
        <p>Great news! Your volunteer tutor application has been approved.</p>
        <p>Your profile is now live. Please log in to your dashboard to set your availability so students can start booking sessions with you.</p>
        <p><a href="https://learnivia-green.vercel.app/tutor">Go to Tutor Dashboard</a></p>
        <p>Thank you for volunteering!</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send application approved email:", error);
  }
}

export async function sendBookingCancellation(
  recipientEmail: string,
  details: {
    recipientName: string;
    otherPartyName: string;
    subject: string;
    startTime: string;
    reason?: string;
  }
) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping booking cancellation email.");
    return;
  }
  const date = new Date(details.startTime).toLocaleString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `Session Canceled: ${details.subject} with ${details.otherPartyName}`,
      html: `
        <h2>Tutoring Session Canceled</h2>
        <p>Hi ${details.recipientName},</p>
        <p>The session for <strong>${details.subject}</strong> scheduled with <strong>${details.otherPartyName}</strong> on <strong>${date}</strong> has been canceled.</p>
        ${details.reason ? `<p><strong>Reason:</strong> ${details.reason}</p>` : ""}
        <p>You can visit your dashboard to view your schedule or book another session.</p>
        <p><a href="https://learnivia-green.vercel.app/dashboard">Go to Dashboard</a></p>
      `,
    });
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
  }
}

export async function sendPasswordResetEmail(recipientEmail: string, resetUrl: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping password reset email.");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: "Reset your Learnivia password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; color: #1E293B; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; color: #0E8345; letter-spacing: -0.02em;">Learnivia</span>
          </div>
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 16px;">Password Reset Request</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
            We received a request to reset your password for your Learnivia account. Click the secure button below to choose a new password:
          </p>
          <div style="margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #0E8345; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">
              Reset Password →
            </a>
          </div>
          <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 24px 0 0;">
            This link will expire in 1 hour. If you didn't request this password reset, you can safely ignore this email — your account remains completely secure.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0 16px;" />
          <p style="font-size: 12px; color: #94A3B8; margin: 0;">
            Learnivia — Free K–10 Peer Tutoring Platform
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
}

export async function sendEmailVerification(recipientEmail: string, verifyUrl: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured; skipping email verification email.");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: "Verify your email on Learnivia",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; color: #1E293B; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; color: #0E8345; letter-spacing: -0.02em;">Learnivia</span>
          </div>
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 16px;">Verify your email address</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
            Welcome to Learnivia! To keep our tutoring community safe and secure for all students and tutors, please verify your email address.
          </p>
          <div style="margin: 28px 0;">
            <a href="${verifyUrl}" style="background-color: #0E8345; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">
              Verify My Email →
            </a>
          </div>
          <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 24px 0 0;">
            This link is valid for 24 hours. If you did not create a Learnivia account, no further action is required.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0 16px;" />
          <p style="font-size: 12px; color: #94A3B8; margin: 0;">
            Learnivia — Free K–10 Peer Tutoring Platform
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}
