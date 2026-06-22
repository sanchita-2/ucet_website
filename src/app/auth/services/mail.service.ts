import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // STARTTLS

  auth: {
    user: process.env.BREVO_SMTP_USER as string,
    pass: process.env.BREVO_SMTP_KEY as string,
  },
});

export async function sendOtpEmail(
  email: string,
  otp: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"UCET ERP" <${process.env.BREVO_SMTP_USER}>`,
      to: email,
      subject: "Email Verification OTP",

      html: `
        <div style="font-family: Arial;">
          <h2>College ERP Email Verification</h2>
          <p>Your OTP is:</p>

          <h1 style="color:#4f46e5">${otp}</h1>

          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email error:", err);
    throw new Error("Failed to send OTP email");
  }
}