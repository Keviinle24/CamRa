import type { Metadata } from 'next';
import ActivateAccount from '@/components/auth/ActivateAccount';
import AuthShell from '@/components/auth/AuthShell';

export const metadata: Metadata = { title: 'Verify your email', robots: { index: false } };

export default async function ActivatePage({ params }: PageProps<'/activate/[token]'>) {
  const { token } = await params;
  return (
    <AuthShell>
      <ActivateAccount token={token} />
    </AuthShell>
  );
}
