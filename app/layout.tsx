import type {Metadata} from 'next';
import { Kanit } from 'next/font/google';
import './globals.css'; // Global styles

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
});

export const metadata: Metadata = {
  title: 'ทันฝุ่น ทันไฟ',
  description: 'แพลตฟอร์มรวบรวมงานสื่อสารและความรู้เรื่อง PM 2.5 ในเชียงใหม่',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} font-sans text-text-main bg-bg-light`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
