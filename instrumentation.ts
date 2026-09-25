// Runs once when the server starts: flag missing configuration right away
// instead of letting the first sign-up attempt fail with a vague error.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { configurationWarnings } = await import('./lib/config');
  const warnings = configurationWarnings();
  if (warnings.length === 0) return;
  console.warn(
    ['', '⚠ CamRa configuration (see .env.example):', ...warnings.map((w) => `  • ${w}`), ''].join('\n'),
  );
}
