import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ',
  description:
    'เข้าสู่ระบบ ทันฝุ่น ทันไฟ เพื่อเข้าถึงข้อมูลเชิงลึก ดาวน์โหลดชุดข้อมูล PM2.5 และเครื่องมือวิเคราะห์',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'เข้าสู่ระบบ | ทันฝุ่น ทันไฟ',
    description:
      'เข้าสู่ระบบเพื่อเข้าถึงข้อมูลเชิงลึกและดาวน์โหลดชุดข้อมูล PM2.5',
    url: '/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
