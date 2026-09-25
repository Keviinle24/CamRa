import type { Metadata } from 'next';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';
import { safeNextPath } from '@/lib/api-client';

export const metadata: Metadata = { title: 'Log in' };

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next } = await searchParams;
  return (
    <AuthShell>
      <LoginForm
        next={safeNextPath(typeof next === 'string' ? next : undefined)}
        devLogin={process.env.NODE_ENV === 'development'}
      />
    </AuthShell>
  );
}
