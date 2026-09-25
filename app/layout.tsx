import type { Metadata, Viewport } from 'next';
import { Istok_Web, Josefin_Sans, Kaushan_Script } from 'next/font/google';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './globals.scss';

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-josefin',
  display: 'swap',
});
const istok = Istok_Web({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-istok', display: 'swap' });
const kaushan = Kaushan_Script({ subsets: ['latin'], weight: '400', variable: '--font-kaushan', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  title: {
    default: 'CamRa — The future of college networking',
    template: '%s · CamRa',
  },
  description:
    'Spontaneous video chat with verified college students around the world. Connect, meet, and chat with just a click.',
  applicationName: 'CamRa',
  openGraph: { siteName: 'CamRa', type: 'website' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#100425',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-bs-theme="dark" className={`${josefin.variable} ${istok.variable} ${kaushan.variable}`}>
      <body>{children}</body>
    </html>
  );
}
