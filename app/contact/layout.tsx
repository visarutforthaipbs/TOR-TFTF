import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ติดต่อเรา',
  description:
    'ติดต่อทีมงาน ทันฝุ่น ทันไฟ เพื่อสอบถามข้อมูล ข้อเสนอแนะ หรือร่วมเป็นเครือข่ายเฝ้าระวังฝุ่นควันและไฟป่า',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'ติดต่อเรา | ทันฝุ่น ทันไฟ',
    description:
      'ติดต่อทีมงาน ทันฝุ่น ทันไฟ เพื่อสอบถามข้อมูล ข้อเสนอแนะ หรือร่วมเป็นเครือข่ายเฝ้าระวังฝุ่นควันและไฟป่า',
    url: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
