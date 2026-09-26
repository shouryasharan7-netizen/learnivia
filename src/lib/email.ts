import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL =
  process.env.FROM_EMAIL || "Learnivia <onboarding@resend.dev>";

export async function sendBookingConfirmation(
  studentEmail: string,
  tutorEmail: string,
  details: {
    studentName: string;
    tutorName: string;
    subject: string;
    startTime: string; // ISO string
    zoomLink: string;
  },
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping booking confirmation email.",
    );
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
    const studentRes = await resend.emails.send({
      from: FROM_EMAIL,
      to: studentEmail,
      subject: `Booking Confirmed: ${details.subject} with ${details.tutorName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6;">
          <h2 style="color: #1b4d3e;">Your tutoring session is confirmed!</h2>
          <p>Hi ${details.studentName},</p>
          <p>You have a confirmed 1-on-1 tutoring session with <strong>${details.tutorName}</strong> for <strong>${details.subject}</strong>.</p>
          
          <div style="background-color: #f8f6f0; border: 1px solid #e5dfd5; border-radius: 8px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Scheduled Time:</strong> ${date}</p>
            <p style="margin: 0 0 16px 0;"><strong>Format:</strong> Zoom Video Meeting (Waiting Room enabled)</p>
            <a href="${details.zoomLink}" style="display: inline-block; background-color: #1b4d3e; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Join Zoom Session →
            </a>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #78716c; word-break: break-all;">
              Direct link: <a href="${details.zoomLink}" style="color: #1b4d3e;">${details.zoomLink}</a>
            </p>
          </div>
          
          <p style="font-size: 13px; color: #78716c;">
            Tip: You can also access and copy this Zoom link anytime directly from your <a href="https://learnivia-green.vercel.app/dashboard" style="color: #1b4d3e;">Learnivia Dashboard</a>.
          </p>
          <p>Thank you for learning with Learnivia!</p>
        </div>
      `,
    });
    if (studentRes.error) {
      console.warn(
        "Resend booking email delivery note (Student):",
        studentRes.error,
      );
    }

    // Send to Tutor
    const tutorRes = await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject: `New Booking: ${details.subject} with ${details.studentName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6;">
          <h2 style="color: #1b4d3e;">You have a new tutoring booking!</h2>
          <p>Hi ${details.tutorName},</p>
          <p><strong>${details.studentName}</strong> just booked a 1-on-1 session with you for <strong>${details.subject}</strong>.</p>
          
          <div style="background-color: #f8f6f0; border: 1px solid #e5dfd5; border-radius: 8px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Scheduled Time:</strong> ${date}</p>
            <p style="margin: 0 0 16px 0;"><strong>Session Meeting Link:</strong></p>
            <a href="${details.zoomLink}" style="display: inline-block; background-color: #1b4d3e; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Start Zoom Session →
            </a>
            <p style="margin: 12px 0 0 0; font-size: 12px; color: #78716c; word-break: break-all;">
              Meeting URL: <a href="${details.zoomLink}" style="color: #1b4d3e;">${details.zoomLink}</a>
            </p>
          </div>

          <p>Please log in to your <a href="https://learnivia-green.vercel.app/tutor" style="color: #1b4d3e;">Tutor Dashboard</a> to view student details and preparation notes.</p>
          <p>Thank you for volunteering!</p>
        </div>
      `,
    });
    if (tutorRes.error) {
      console.warn(
        "Resend booking email delivery note (Tutor):",
        tutorRes.error,
      );
    }
  } catch (error) {
    console.error("Failed to send booking confirmation emails:", error);
  }
}

export async function sendApplicationReceived(
  tutorEmail: string,
  tutorName: string,
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping application received email.",
    );
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject: "Volunteer Application Received - Learnivia",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; color: #1E293B; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; color: #0E8345; letter-spacing: -0.02em;">Learnivia</span>
          </div>
          <h2 style="font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 16px;">Application Received!</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px;">Hi ${tutorName},</p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px;">Thank you for applying to be a volunteer tutor on Learnivia. We have successfully received your application.</p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">Our Academic Board will carefully review your details and get back to you within 3-5 working days.</p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0 16px;" />
          <p style="font-size: 12px; color: #94A3B8; margin: 0;">
            The Learnivia Team<br/>Free K-10 Peer Tutoring Platform
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send application received email:", error);
  }
}

export async function sendApplicationApproved(
  tutorEmail: string,
  tutorName: string,
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping application approved email.",
    );
    return;
  }
  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject:
        "You're Approved! Complete Your Tutoring Training Course - Learnivia",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6;">
          <h2 style="color: #1b4d3e; font-size: 24px; margin-bottom: 16px;">Welcome to Learnivia, ${tutorName}!</h2>
          <p>Congratulations! Your volunteer tutor application has been reviewed and <strong>approved</strong> by our Academic Board.</p>
          
          <div style="background-color: #f8f6f0; border: 1px solid #e5dfd5; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #1b4d3e; font-size: 16px;">Next Step: Complete Your 5-Video Training Course</h3>
            <p style="margin-bottom: 16px; font-size: 14px; color: #44403c;">
              To safeguard students and ensure the highest pedagogical standards, all approved tutors must complete the mandatory 5-module training course before accessing the tutoring dashboard or hosting sessions.
            </p>
            <a href="https://learnivia-green.vercel.app/tutor/training" style="display: inline-block; background-color: #1b4d3e; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Start 5-Module Training Course →
            </a>
          </div>

          <p style="font-size: 14px; color: #78716c;">
            While in training, you can also review our comprehensive tutoring guidelines and best practices in the <a href="https://learnivia-green.vercel.app/resources" style="color: #1b4d3e; text-decoration: underline;">Tutoring Guide &amp; Resources Hub</a>.
          </p>
          <p style="font-size: 14px; color: #78716c;">
            Once you have watched all 5 videos and completed the quick comprehension checks, your tutoring dashboard, session hosting, and weekly calendar will automatically unlock.
          </p>
          <p style="margin-top: 24px;">Warm regards,<br><strong>The Learnivia Academic &amp; Safeguarding Team</strong></p>
        </div>
      `,
    });
    if (res.error) {
      console.warn("Resend application approved delivery notice:", res.error);
    }
  } catch (error) {
    console.error("Failed to send application approved email:", error);
  }
}

export async function sendApplicationRejected(
  tutorEmail: string,
  tutorName: string,
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping application rejected email.",
    );
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject: "Update on your Learnivia Volunteer Application",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6;">
          <h2 style="color: #991b1b; font-size: 22px; margin-bottom: 16px;">Update on your application</h2>
          <p>Hi ${tutorName},</p>
          <p>Thank you for applying to be a volunteer tutor on Learnivia. We appreciate the time you took to submit your application and academic credentials.</p>
          <p>After careful review by our Academic Board, we regret to inform you that we are unable to approve your application at this time. We receive many applications and must ensure all tutors meet specific academic and safeguarding criteria for peer mentorship.</p>
          <p>We wish you the best in your future endeavors.</p>
          <p style="margin-top: 24px;">Warm regards,<br><strong>The Learnivia Team</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send application rejected email:", error);
  }
}

export async function sendTutorSuspended(
  tutorEmail: string,
  tutorName: string,
  reason: string,
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping tutor suspended email.",
    );
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject:
        "Important Notice: Your Learnivia Tutor Account has been Suspended",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6;">
          <h2 style="color: #991b1b; font-size: 22px; margin-bottom: 16px;">Account Suspended</h2>
          <p>Hi ${tutorName},</p>
          <p>This email is to notify you that your volunteer tutor account on Learnivia has been suspended following an administrative review.</p>
          
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #991b1b; font-weight: 500;">
              Reason provided by administration:<br/><br/>
              <strong>${reason || "Violation of platform safeguarding or tutoring guidelines."}</strong>
            </p>
          </div>

          <p>As a result, any upcoming scheduled sessions have been automatically canceled, and your public profile is no longer visible to students.</p>
          <p>If you believe this was in error or wish to appeal this decision, please reply directly to this email.</p>
          <p style="margin-top: 24px;">Sincerely,<br><strong>Learnivia Trust &amp; Safety</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send tutor suspended email:", error);
  }
}

export async function sendTutorAvailabilityReminder(
  tutorEmail: string,
  tutorName: string,
  daysRemaining: number,
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping availability reminder email.",
    );
    return;
  }
  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject:
        "Action Required: Set Your Weekly Tutoring Availability - Learnivia",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6;">
          <h2 style="color: #2563eb; font-size: 22px; margin-bottom: 16px;">Reminder: Please add your available tutoring hours</h2>
          <p>Hi ${tutorName},</p>
          <p>You recently joined Learnivia as a volunteer educator, but you haven't set your weekly available time slots yet.</p>
          
          <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 500;">
              Important Policy: Volunteer tutors must specify their available hours within 3 days of joining to maintain active tutor status. You have approximately <strong>${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} remaining</strong> before your profile is automatically deactivated.
            </p>
          </div>

          <p>Adding your availability takes less than 2 minutes and lets eager students book free 1-on-1 sessions with you.</p>
          
          <a href="https://learnivia-green.vercel.app/tutor" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 22px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 12px 0;">
            Set Weekly Availability Now →
          </a>

          <p style="font-size: 13px; color: #78716c; margin-top: 24px;">Thank you for your dedication to peer learning!<br>The Learnivia Team</p>
        </div>
      `,
    });
    if (res.error) {
      console.warn("Resend availability reminder delivery notice:", res.error);
    }
  } catch (error) {
    console.error("Failed to send tutor availability reminder:", error);
  }
}

export async function sendTutorTrainingReminder(
  tutorEmail: string,
  tutorName: string,
  completedCount: number,
  daysRemaining: number,
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping training reminder email.",
    );
    return;
  }
  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: tutorEmail,
      subject:
        "Action Required: Complete Tutor Training (15-Day Policy) - Learnivia",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917; line-height: 1.6;">
          <h2 style="color: #2563eb; font-size: 22px; margin-bottom: 16px;">Action Required: Complete Mandatory Tutor Training</h2>
          <p>Hi ${tutorName},</p>
          <p>You have completed <strong>${completedCount} of 5</strong> mandatory safeguarding and tutoring training modules on Learnivia.</p>
          
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #991b1b; font-weight: 500;">
              Important Policy: Volunteer tutors must complete all 5 mandatory modules within 15 days of applying. You have <strong>${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} remaining</strong> before your profile is automatically removed.
            </p>
          </div>

          <p>Completing your remaining modules takes around 15-20 minutes and ensures student safety and high-quality mentorship.</p>
          
          <a href="https://learnivia-green.vercel.app/tutor/training" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 22px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 12px 0;">
            Complete Training Modules Now →
          </a>

          <p style="font-size: 13px; color: #78716c; margin-top: 24px;">Thank you for helping keep our learning community safe and empowering!<br>The Learnivia Team</p>
        </div>
      `,
    });
    if (res.error) {
      console.warn("Resend training reminder delivery notice:", res.error);
    }
  } catch (error) {
    console.error("Failed to send tutor training reminder:", error);
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
  },
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping booking cancellation email.",
    );
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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; color: #1E293B; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0;">
          <div style="margin-bottom: 24px;">
            <span style="font-size: 20px; font-weight: 800; color: #0E8345; letter-spacing: -0.02em;">Learnivia</span>
          </div>
          <h2 style="font-size: 22px; font-weight: 700; color: #991B1B; margin: 0 0 16px;">Tutoring Session Canceled</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px;">Hi ${details.recipientName},</p>
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
            The session for <strong>${details.subject}</strong> scheduled with <strong>${details.otherPartyName}</strong> on <strong>${date}</strong> has been canceled.
          </p>
          ${details.reason ? `<div style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 16px; margin: 20px 0;"><p style="font-size: 14px; color: #991B1B; margin: 0;"><strong>Reason:</strong> ${details.reason}</p></div>` : ""}
          <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 24px 0;">You can visit your dashboard to view your updated schedule or book another session.</p>
          <div style="margin: 28px 0;">
            <a href="https://learnivia-green.vercel.app/dashboard" style="background-color: #0E8345; color: #FFFFFF; font-size: 15px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">
              Go to Dashboard →
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0 16px;" />
          <p style="font-size: 12px; color: #94A3B8; margin: 0;">
            Learnivia: Free K-10 Peer Tutoring Platform
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
  }
}

export async function sendPasswordResetEmail(
  recipientEmail: string,
  resetUrl: string,
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping password reset email.",
    );
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
            This link will expire in 1 hour. If you didn't request this password reset, you can safely ignore this email, your account remains completely secure.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0 16px;" />
          <p style="font-size: 12px; color: #94A3B8; margin: 0;">
            Learnivia: Free K-10 Peer Tutoring Platform
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
}

export async function sendEmailVerification(
  recipientEmail: string,
  verifyUrl: string,
) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured; skipping email verification email.",
    );
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
            Learnivia: Free K-10 Peer Tutoring Platform
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}
