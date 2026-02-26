import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import LatestContent from '@/components/LatestContent';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ทันฝุ่น ทันไฟ — ติดตามสถานการณ์ PM2.5 และไฟป่า',
  description:
    'แพลตฟอร์มรวบรวมข้อมูล ข่าวสาร สารคดี และเครื่องมือติดตามสถานการณ์ PM 2.5 ฝุ่นควัน และไฟป่าในประเทศไทย โดย Thai PBS',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'ทันฝุ่น ทันไฟ — ติดตามสถานการณ์ PM2.5 และไฟป่า',
    description:
      'แพลตฟอร์มรวบรวมข้อมูล ข่าวสาร สารคดี และเครื่องมือติดตามสถานการณ์ PM 2.5 ฝุ่นควัน และไฟป่าในประเทศไทย โดย Thai PBS',
    url: '/',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ส่วน Header */}
      <Header />
      
      {/* ส่วน Hero Section */}
      <Hero />
      
      {/* ส่วน Feature Cards (3 ใบ) */}
      <FeatureCards />
      
      {/* ส่วนสื่อสารและความรู้ล่าสุด */}
      <LatestContent />
      
      {/* ส่วน Footer */}
      <Footer />
    </main>
  );
}
