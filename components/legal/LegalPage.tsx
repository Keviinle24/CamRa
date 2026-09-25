import SiteFooter from '@/components/site/SiteFooter';
import SiteNavbar from '@/components/site/SiteNavbar';

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <SiteNavbar />
      <main className="section" style={{ paddingTop: 'calc(var(--camra-navbar-height) + 3rem)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <p className="eyebrow mb-2">Legal</p>
          <h1 className="display-5 fw-bold mb-5">{title}</h1>
          <div className="glass-card p-4 p-md-5">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
