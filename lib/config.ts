// Server configuration checks. Deliberately free of `server-only` so proxy.ts can use it.

/** The server is missing configuration or can't reach a service it depends on. */
export class SetupError extends Error {
  constructor(
    message: string,
    /** Shown to visitors in production instead of the detailed message. */
    public publicMessage = "This server isn't configured correctly yet. Check the server logs.",
  ) {
    super(message);
  }
}

export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new SetupError(`${name} is not set. Add it to .env.local, then restart the server.`);
  }
  return value;
}

/** Problems worth shouting about when the server starts. */
export function configurationWarnings() {
  const warnings: string[] = [];
  if (!process.env.MONGODB_URI) {
    warnings.push(
      process.env.NODE_ENV === 'development'
        ? 'MONGODB_URI is not set: using a local development database (data in .dev-db/).'
        : 'MONGODB_URI is missing, so sign-up and login will fail.',
    );
  }
  if (!process.env.JWT_SECRETKEY) warnings.push('JWT_SECRETKEY is missing, so sign-up and login will fail.');
  const agora = { AGORA_APP_ID: process.env.AGORA_APP_ID || process.env.NEXT_PUBLIC_AGORA_APP_ID, AGORA_APP_CERT: process.env.AGORA_APP_CERT };
  if (!agora.AGORA_APP_ID || !agora.AGORA_APP_CERT) {
    warnings.push('AGORA_APP_ID / AGORA_APP_CERT are missing, so video chat will not start.');
  }
  for (const [name, value] of Object.entries(agora)) {
    // Both are 32-character hex strings in the Agora console; catch copy/paste slips early.
    if (value && !/^[0-9a-f]{32}$/i.test(value)) warnings.push(`${name} doesn't look right (expected 32 letters/digits from the Agora console).`);
  }
  if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
    warnings.push(
      process.env.NODE_ENV === 'production'
        ? 'No email service (SMTP_* or RESEND_API_KEY), so verification emails cannot be sent and sign-up will fail.'
        : 'No email service configured (SMTP_* or RESEND_API_KEY): verification links will be printed in this terminal.',
    );
  }
  return warnings;
}
