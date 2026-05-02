import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

function createTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

const from = `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`;

async function send(to: string, subject: string, html: string) {
  if (!env.SMTP_USER || !env.SMTP_HOST) {
    logger.info(`[DEV EMAIL] To: ${to} | Subject: ${subject}\n${html.replace(/<[^>]+>/g, '').trim()}`);
    return;
  }
  await createTransporter().sendMail({ from, to, subject, html });
}

export async function sendVerificationEmail(to: string, firstName: string, otp: string) {
  await send(
    to,
    'Verify your City Commerce account',
    `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Hi ${firstName},</h2>
      <p>Enter this code to verify your email address. It expires in <strong>10 minutes</strong>.</p>
      <div style="font-size:40px;font-weight:bold;letter-spacing:12px;text-align:center;padding:24px 0">
        ${otp}
      </div>
      <p style="color:#888;font-size:12px">If you didn't create an account, ignore this email.</p>
    </div>
    `,
  );
}

export async function sendPasswordResetEmail(to: string, firstName: string, otp: string) {
  await send(
    to,
    'Reset your City Commerce password',
    `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Hi ${firstName},</h2>
      <p>Enter this code to reset your password. It expires in <strong>10 minutes</strong>.</p>
      <div style="font-size:40px;font-weight:bold;letter-spacing:12px;text-align:center;padding:24px 0">
        ${otp}
      </div>
      <p style="color:#888;font-size:12px">If you didn't request a password reset, ignore this email.</p>
    </div>
    `,
  );
}
