import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Learnivia <onboarding@resend.dev>"; // Use resend test domain for now, upgrade to custom domain later

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
