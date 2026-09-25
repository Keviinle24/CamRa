import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import TermsContent from '@/components/legal/TermsContent';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <TermsContent />
    </LegalPage>
  );
}
