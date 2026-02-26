import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ForecastClient from '@/components/ForecastClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'พยากรณ์ฝุ่นไฟ',
  description:
    'ข้อมูลพยากรณ์คุณภาพอากาศ PM2.5 ล่วงหน้ารายชั่วโมง สำหรับจังหวัดภาคเหนือของประเทศไทย พร้อมกราฟแนวโน้มและการแจ้งเตือน',
  alternates: { canonical: '/forecast' },
  openGraph: {
    title: 'พยากรณ์ฝุ่นไฟ | ทันฝุ่น ทันไฟ',
    description:
      'ข้อมูลพยากรณ์คุณภาพอากาศ PM2.5 ล่วงหน้ารายชั่วโมง สำหรับจังหวัดภาคเหนือของประเทศไทย',
    url: '/forecast',
  },
};

export default function ForecastPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />
      <main className="flex-1">
        <ForecastClient />
      </main>
      <Footer />
    </div>
  );
}
