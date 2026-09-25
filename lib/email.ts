import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { Resend } from 'resend';
import { SetupError, requireEnv } from './config';
import { HttpError } from './http';

/** Where the link went: a real email, or (development with no email service) the server console. */
export type Delivery = 'email' | 'console';

type Message = { to: string; subject: string; html: string; text: string };

// Verification emails go out through whichever service is configured:
//   1. Resend (RESEND_API_KEY): needs a domain verified in Resend to email anyone but yourself.
//   2. SMTP (SMTP_HOST, SMTP_USER, SMTP_PASSWORD): e.g. a Gmail account with an app password.
//   3. Neither, in development: the link is printed in the terminal instead.
export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<Delivery> {
  const message: Message = {
    to,
    subject: 'Verify your CamRa account',
    html: verificationEmailHtml(verifyUrl),
    text: `Welcome to CamRa! Verify your email to finish signing up: ${verifyUrl}\n\nThis link expires in 24 hours. If you didn't create a CamRa account, you can ignore this email.`,
  };

  if (process.env.RESEND_API_KEY) {
    await sendWithResend(message);
    return 'email';
  }
  if (process.env.SMTP_HOST) {
    await sendWithSmtp(message);
    return 'email';
  }
  if (process.env.NODE_ENV !== 'production') {
    console.info(`\n[email] No email service configured. Verification link for ${to}:\n${verifyUrl}\n`);
    return 'console';
  }
  throw new SetupError(
    'No email service is configured. Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD (e.g. a Gmail app password) or RESEND_API_KEY in .env.local.',
    "Email delivery isn't configured yet. Please try again later.",
  );
}

function deliveryFailed(service: string, reason: string): never {
  const detail = process.env.NODE_ENV === 'development' ? ` (${service}: ${reason})` : '';
  throw new HttpError(502, `We couldn't send the verification email. Please try again in a moment.${detail}`);
}

async function sendWithResend({ to, ...content }: Message) {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new SetupError(
      'EMAIL_FROM must be set when using Resend: an address on a domain verified in Resend, or "CamRa <onboarding@resend.dev>" for testing.',
    );
  }
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from, to: [to], ...content });
  if (error) {
    console.error('[email] Resend rejected the verification email:', error);
    deliveryFailed('Resend', error.message);
  }
}

// One SMTP connection pool per settings combination, so editing .env.local takes effect without a restart.
const globalForSmtp = globalThis as typeof globalThis & { smtp?: { key: string; transport: Transporter } };

function smtpTransport() {
  const host = requireEnv('SMTP_HOST');
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = requireEnv('SMTP_USER');
  // Gmail displays app passwords in groups of four; the spaces aren't part of the password.
  const password = host.endsWith('gmail.com')
    ? requireEnv('SMTP_PASSWORD').replace(/\s+/g, '')
    : requireEnv('SMTP_PASSWORD');

  const key = [host, port, user, password].join('\n');
  if (globalForSmtp.smtp?.key !== key) {
    globalForSmtp.smtp = {
      key,
      transport: nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass: password },
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 20_000,
      }),
    };
  }
  return { transport: globalForSmtp.smtp.transport, user };
}

async function sendWithSmtp(message: Message) {
  const { transport, user } = smtpTransport();
  try {
    await transport.sendMail({ from: process.env.EMAIL_FROM || `CamRa <${user}>`, ...message });
  } catch (error) {
    console.error('[email] SMTP could not send the verification email:', error);
    deliveryFailed('SMTP', (error as Error).message);
  }
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function verificationEmailHtml(verifyUrl: string) {
  const url = escapeHtml(verifyUrl);
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f1fb;">
    <span style="display:none;max-height:0;overflow:hidden;">Verify your email to start chatting on CamRa.</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1fb;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#100425;border-radius:20px;overflow:hidden;">
          <tr><td style="padding:0;"><img src="https://i.imgur.com/ja0ROVc.png" width="560" alt="CamRa" style="display:block;width:100%;height:auto;border:0;"></td></tr>
          <tr><td style="padding:32px 36px 8px;font-family:${font};color:#ffffff;">
            <h1 style="margin:0 0 12px;font-size:26px;line-height:1.25;">Welcome to CamRa!</h1>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#cfcfcf;">We're excited to have you join our community. Confirm your email address to finish creating your account.</p>
            <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#c700fb;background-image:linear-gradient(90deg,#00fff0,#ff00f5);">
              <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:${font};font-size:16px;font-weight:700;color:#100425;text-decoration:none;border-radius:999px;">Verify my account</a>
            </td></tr></table>
            <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#a7a7a7;">Button not working? Paste this link into your browser:<br><a href="${url}" style="color:#00fff0;word-break:break-all;">${url}</a></p>
            <p style="margin:16px 0 28px;font-size:13px;line-height:1.6;color:#a7a7a7;">This link expires in 24 hours. If you didn't create a CamRa account, you can safely ignore this email.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
