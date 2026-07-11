import nodemailer from "nodemailer";
import { env } from "../../../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,

  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: "Verify your UCET ERP account",

      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>UCET ERP</h2>

          <p>Hello,</p>

          <p>Your email verification OTP is:</p>

          <h1 style="letter-spacing:4px;color:#4f46e5;">
            ${otp}
          </h1>

          <p>This OTP is valid for <strong>10 minutes</strong>.</p>

          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send OTP email");
  }
}
