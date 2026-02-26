import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Portal',
  description:
    'ศูนย์รวมชุดข้อมูลเปิด PM2.5 จุดความร้อน คุณภาพอากาศ และข้อมูลสิ่งแวดล้อม สำหรับนักวิจัย สื่อมวลชน และประชาชน',
  alternates: { canonical: '/data-portal' },
  openGraph: {
    title: 'Data Portal | ทันฝุ่น ทันไฟ',
    description:
      'ศูนย์รวมชุดข้อมูลเปิด PM2.5 จุดความร้อน คุณภาพอากาศ และข้อมูลสิ่งแวดล้อม',
    url: '/data-portal',
  },
};

export default function DataPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
