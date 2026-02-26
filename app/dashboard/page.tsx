import { readFileSync } from 'fs';
import { join } from 'path';
import Header from '@/components/Header';
import PM25MapWrapper from '@/components/PM25MapWrapper';
import type { Metadata } from 'next';
import type { Pm25Province } from '@/components/PM25ProvinceMap';
import type { PM25ImpactRow } from '@/components/PM25ImpactPanel';

export const metadata: Metadata = {
  title: 'แดชบอร์ด PM2.5',
  description:
    'ข้อมูลคุณภาพอากาศ PM2.5 รายจังหวัดทั่วประเทศไทย แบบ Real-time แผนที่แสดงผลจุดความร้อนและค่าฝุ่นละอองขนาดเล็ก',
  alternates: { canonical: '/dashboard' },
  openGraph: {
    title: 'แดชบอร์ด PM2.5 | ทันฝุ่น ทันไฟ',
    description:
      'ข้อมูลคุณภาพอากาศ PM2.5 รายจังหวัดทั่วประเทศไทย แบบ Real-time แผนที่แสดงผลจุดความร้อนและค่าฝุ่นละอองขนาดเล็ก',
    url: '/dashboard',
  },
};

// ── PM2.5 fetch (revalidate hourly) ──────────────────────────────────────────
async function getPm25Data(): Promise<{ data: Pm25Province[]; lastUpdated: string }> {
  try {
    const res = await fetch('https://pm25.gistda.or.th/rest/getPm25byProvince', {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const lastUpdated =
      json.datetimeThai
        ? `${json.datetimeThai.dateThai} ${json.datetimeThai.timeThai}`
        : new Date().toLocaleString('th-TH');
    return { data: (json.data ?? []) as Pm25Province[], lastUpdated };
  } catch {
    return { data: [], lastUpdated: 'ไม่สามารถโหลดข้อมูลได้' };
  }
}

// ── Parse PM2.5 impact CSV (static at build time) ───────────────────────────
function getImpactData(): PM25ImpactRow[] {
  try {
    const csv = readFileSync(
      join(process.cwd(), 'public/datas/pm25_impact_meaning_all_provinces.csv'),
      'utf-8',
    );
    const lines = csv.split('\n').filter(Boolean);
    // Skip header
    return lines.slice(1).map(line => {
      // Split only first 4 commas — Impact_Meaning may contain commas
      const parts = line.split(',');
      const province = parts[0].trim();
      const y2024 = Number(parts[1]);
      const y2025 = Number(parts[2]);
      const total = Number(parts[3]);
      const impactRaw = parts.slice(4).join(',').trim();
      // Extract level keyword
      const levelMatch = impactRaw.match(/\((.+?)\)/);
      const impactLevel = levelMatch?.[1] ?? 'Safe';
      return { province, y2024, y2025, total, impactLevel, impactText: impactRaw };
    });
  } catch {
    return [];
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const { data, lastUpdated } = await getPm25Data();
  const impactData = getImpactData();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden">
        <PM25MapWrapper initialData={data} lastUpdated={lastUpdated} impactData={impactData} />
      </div>
    </div>
  );
}
