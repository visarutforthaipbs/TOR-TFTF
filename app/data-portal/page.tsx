'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/AuthContext';
import {
  Database,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Globe,
  Flame,
  Wind,
  MapPin,
  Newspaper,
} from 'lucide-react';

interface Dataset {
  id: string;
  title: string;
  description: string;
  source: string;
  format: string;
  icon: React.ElementType;
  category: 'local' | 'external';
  url: string;
  isDownload: boolean;
}

const datasets: Dataset[] = [
  // Local datasets (downloadable files)
  {
    id: 'news-thaipbs',
    title: 'รวมสื่อสารคดี ข่าว และบทความฝุ่นควัน (Thai PBS)',
    description: 'รวบรวม 67 ชิ้นงานสื่อจาก Thai PBS ครอบคลุมสารคดี วิดีโอสั้น รายการทีวี และบทความ พร้อมลิงก์ต้นฉบับ',
    source: 'Thai PBS',
    format: 'CSV',
    icon: Newspaper,
    category: 'local',
    url: '/datas/news-thaipbs.csv',
    isDownload: true,
  },
  {
    id: 'pm25-impact',
    title: 'ผลกระทบ PM2.5 รายจังหวัดทั่วประเทศ',
    description: 'ข้อมูลผลกระทบจากฝุ่น PM2.5 ต่อสุขภาพ เศรษฐกิจ และการท่องเที่ยว จำแนกตามจังหวัด',
    source: 'โครงการ FunFai',
    format: 'CSV',
    icon: MapPin,
    category: 'local',
    url: '/datas/pm25_impact_meaning_all_provinces.csv',
    isDownload: true,
  },
  // External datasets (links to open data portals)
  {
    id: 'gistda-pm25',
    title: 'ข้อมูล PM2.5 จาก GISTDA',
    description: 'ข้อมูลค่าฝุ่น PM2.5 เรียลไทม์จากดาวเทียมและสถานีตรวจวัด โดย GISTDA (สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ)',
    source: 'GISTDA',
    format: 'API / GeoJSON',
    icon: Wind,
    category: 'external',
    url: 'https://pm25.gistda.or.th/',
    isDownload: false,
  },
  {
    id: 'firms-hotspots',
    title: 'ข้อมูลจุดความร้อน (Hotspot) จาก NASA FIRMS',
    description: 'ข้อมูลจุดความร้อนจากเซ็นเซอร์ VIIRS และ MODIS ของ NASA อัปเดตทุกวัน ครอบคลุมทั่วโลก',
    source: 'NASA FIRMS',
    format: 'CSV / GeoJSON / SHP',
    icon: Flame,
    category: 'external',
    url: 'https://firms.modaps.eosdis.nasa.gov/download/',
    isDownload: false,
  },
  {
    id: 'open-meteo-air',
    title: 'ข้อมูลคุณภาพอากาศ Open-Meteo',
    description: 'API ข้อมูลคุณภาพอากาศฟรี รวมถึง PM2.5, PM10, O3, NO2, SO2, CO พร้อมข้อมูลพยากรณ์',
    source: 'Open-Meteo',
    format: 'JSON API',
    icon: Globe,
    category: 'external',
    url: 'https://open-meteo.com/en/docs/air-quality-api',
    isDownload: false,
  },
  {
    id: 'pcd-aqm',
    title: 'ข้อมูลคุณภาพอากาศ กรมควบคุมมลพิษ',
    description: 'ข้อมูลสถานีตรวจวัดคุณภาพอากาศทั่วประเทศไทย โดยกรมควบคุมมลพิษ กระทรวงทรัพยากรธรรมชาติและสิ่งแวดล้อม',
    source: 'กรมควบคุมมลพิษ',
    format: 'Web / API',
    icon: Wind,
    category: 'external',
    url: 'http://air4thai.pcd.go.th/webV3/',
    isDownload: false,
  },
  {
    id: 'fire-forest',
    title: 'ข้อมูลไฟป่าและการเผา กรมอุทยานฯ',
    description: 'ข้อมูลสถิติไฟป่า พื้นที่เผาไหม้ และจุดความร้อนในเขตป่าอนุรักษ์ทั่วประเทศ',
    source: 'กรมอุทยานแห่งชาติ',
    format: 'Web',
    icon: Flame,
    category: 'external',
    url: 'https://www.dnp.go.th/forestfire/2546/firestatistic.htm',
    isDownload: false,
  },
  {
    id: 'cmu-ccdc',
    title: 'สถานีวัดคุณภาพอากาศ มช. (CCDC)',
    description: 'ข้อมูลคุณภาพอากาศจากสถานีตรวจวัดของศูนย์ข้อมูลการเปลี่ยนแปลงสภาพภูมิอากาศ มหาวิทยาลัยเชียงใหม่',
    source: 'ม.เชียงใหม่',
    format: 'Web',
    icon: Database,
    category: 'external',
    url: 'https://www.cmuccdc.org/',
    isDownload: false,
  },
];

export default function DataPortalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="animate-pulse text-text-muted">กำลังโหลด...</div>
      </div>
    );
  }

  const localDatasets = datasets.filter(d => d.category === 'local');
  const externalDatasets = datasets.filter(d => d.category === 'external');

  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-8 sm:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">คลังข้อมูลเปิด</h1>
                <p className="text-white/80 text-sm sm:text-lg">
                  ดาวน์โหลดชุดข้อมูลด้าน PM2.5 จุดความร้อน และคุณภาพอากาศ
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 pr-5">
                {user.photoURL && (
                  <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                )}
                <div className="text-sm">
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="text-white/70 text-xs">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
              {[
                { label: 'ชุดข้อมูลทั้งหมด', value: datasets.length },
                { label: 'ดาวน์โหลดได้ทันที', value: localDatasets.length },
                { label: 'แหล่งข้อมูลภายนอก', value: externalDatasets.length },
                { label: 'รูปแบบข้อมูล', value: '4+' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local Datasets — Downloadable */}
        <section className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">ข้อมูลจากโครงการ</h2>
              <p className="text-sm text-text-muted">ดาวน์โหลดไฟล์ข้อมูลที่รวบรวมโดยทีมงาน</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localDatasets.map(ds => (
              <div key={ds.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ds.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-main mb-1">{ds.title}</h3>
                    <p className="text-sm text-text-muted mb-3 line-clamp-2">{ds.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">{ds.format}</span>
                      <span className="text-xs text-text-muted">โดย {ds.source}</span>
                    </div>
                    <a
                      href={ds.url}
                      download
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      ดาวน์โหลด
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* External Datasets */}
        <section className="max-w-6xl mx-auto px-4 pb-8 sm:pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">แหล่งข้อมูลภายนอก</h2>
              <p className="text-sm text-text-muted">ลิงก์ไปยังแหล่งข้อมูลเปิดจากหน่วยงานต่าง ๆ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {externalDatasets.map(ds => (
              <a
                key={ds.id}
                href={ds.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                    <ds.icon className="w-5 h-5 text-blue-600 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-text-main text-sm group-hover:text-primary transition-colors">{ds.title}</h3>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{ds.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">{ds.format}</span>
                      <span className="text-xs text-text-muted">{ds.source}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
