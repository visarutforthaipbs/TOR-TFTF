import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css'; // Global styles
import Providers from '@/components/Providers';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://funfai.thaipbs.or.th';
const SITE_NAME = 'ทันฝุ่น ทันไฟ';
const SITE_DESCRIPTION =
  'แพลตฟอร์มรวบรวมข้อมูล ข่าวสาร สารคดี และเครื่องมือติดตามสถานการณ์ PM 2.5 ฝุ่นควัน และไฟป่าในประเทศไทย โดย Thai PBS';

const dbHelvethaicaX = localFont({
  src: [
    {
      path: '../public/fonts/dbhelvethaicax-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/dbhelvethaicaxmed-webfont.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/dbhelvethaicaxbd-webfont.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ทันฝุ่น ทันไฟ — ติดตามสถานการณ์ PM2.5 และไฟป่า',
    template: '%s | ทันฝุ่น ทันไฟ',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'PM2.5', 'ฝุ่นควัน', 'ไฟป่า', 'คุณภาพอากาศ', 'เชียงใหม่', 'ภาคเหนือ',
    'หมอกควัน', 'จุดความร้อน', 'hotspot', 'air quality', 'Thailand',
    'พยากรณ์อากาศ', 'Thai PBS', 'ทันฝุ่น ทันไฟ', 'สิ่งแวดล้อม',
  ],
  authors: [{ name: 'Thai PBS', url: 'https://www.thaipbs.or.th' }],
  creator: 'Thai PBS Public Intelligence',
  publisher: 'Thai PBS',
  icons: {
    icon: '/logos/logo.svg',
    apple: '/logos/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'ทันฝุ่น ทันไฟ — ติดตามสถานการณ์ PM2.5 และไฟป่า',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'ทันฝุ่น ทันไฟ — แพลตฟอร์มติดตาม PM2.5 และไฟป่า',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ทันฝุ่น ทันไฟ — ติดตามสถานการณ์ PM2.5 และไฟป่า',
    description: SITE_DESCRIPTION,
    images: ['/api/og'],
    creator: '@ThaiPBS',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add your Google Search Console verification token here when available
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="th" className={dbHelvethaicaX.variable}>
      <body className="font-sans text-text-main bg-bg-light" suppressHydrationWarning>
        <JsonLd type="website" />
        <JsonLd type="organization" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
