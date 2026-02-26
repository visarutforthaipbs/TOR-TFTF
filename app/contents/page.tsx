import Header from '@/components/Header';
import ContentHub from '@/components/ContentHub';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'สื่อสารและความรู้',
  description:
    'รวมข่าว บทความ สารคดี อินโฟกราฟิก และพอดแคสต์เกี่ยวกับ PM2.5 ฝุ่นควัน และไฟป่าในประเทศไทย',
  alternates: { canonical: '/contents' },
  openGraph: {
    title: 'สื่อสารและความรู้ | ทันฝุ่น ทันไฟ',
    description:
      'รวมข่าว บทความ สารคดี อินโฟกราฟิก และพอดแคสต์เกี่ยวกับ PM2.5 ฝุ่นควัน และไฟป่าในประเทศไทย',
    url: '/contents',
  },
};

export default function ContentsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow pt-8">
        <ContentHub />
      </div>
      
      <Footer />
    </main>
  );
}
