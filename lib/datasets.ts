import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ── Types ────────────────────────────────────────────────────────────────────
export interface DatasetDoc {
  id: string;           // Firestore doc ID
  title: string;
  description: string;
  source: string;
  format: string;
  iconName: string;     // stored as string, mapped to component at render
  category: 'local' | 'external';
  url: string;
  isDownload: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export type DatasetInput = Omit<DatasetDoc, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;

const COLLECTION = 'datasets';

// ── Read ─────────────────────────────────────────────────────────────────────
export async function fetchDatasets(): Promise<DatasetDoc[]> {
  const q = query(collection(db, COLLECTION), orderBy('category'), orderBy('title'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DatasetDoc));
}

// ── Create ───────────────────────────────────────────────────────────────────
export async function createDataset(data: DatasetInput, uid: string): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// ── Update ───────────────────────────────────────────────────────────────────
export async function updateDataset(id: string, data: Partial<DatasetInput>): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// ── Delete ───────────────────────────────────────────────────────────────────
export async function deleteDataset(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

// ── Icon choices for the form dropdown ───────────────────────────────────────
export const ICON_OPTIONS = [
  { value: 'Database', label: 'ฐานข้อมูล' },
  { value: 'Newspaper', label: 'ข่าว/สื่อ' },
  { value: 'MapPin', label: 'แผนที่/พิกัด' },
  { value: 'Wind', label: 'อากาศ/ลม' },
  { value: 'Flame', label: 'ไฟ/ความร้อน' },
  { value: 'Globe', label: 'เว็บ/API' },
  { value: 'FileSpreadsheet', label: 'สเปรดชีต' },
  { value: 'BarChart3', label: 'กราฟ/สถิติ' },
] as const;

// ── Default datasets to seed ─────────────────────────────────────────────────
export const DEFAULT_DATASETS: DatasetInput[] = [
  {
    title: 'รวมสื่อสารคดี ข่าว และบทความฝุ่นควัน (Thai PBS)',
    description: 'รวบรวม 67 ชิ้นงานสื่อจาก Thai PBS ครอบคลุมสารคดี วิดีโอสั้น รายการทีวี และบทความ พร้อมลิงก์ต้นฉบับ',
    source: 'Thai PBS',
    format: 'CSV',
    iconName: 'Newspaper',
    category: 'local',
    url: '/datas/news-thaipbs.csv',
    isDownload: true,
  },
  {
    title: 'ผลกระทบ PM2.5 รายจังหวัดทั่วประเทศ',
    description: 'ข้อมูลผลกระทบจากฝุ่น PM2.5 ต่อสุขภาพ เศรษฐกิจ และการท่องเที่ยว จำแนกตามจังหวัด',
    source: 'โครงการ FunFai',
    format: 'CSV',
    iconName: 'MapPin',
    category: 'local',
    url: '/datas/pm25_impact_meaning_all_provinces.csv',
    isDownload: true,
  },
  {
    title: 'ข้อมูล PM2.5 จาก GISTDA',
    description: 'ข้อมูลค่าฝุ่น PM2.5 เรียลไทม์จากดาวเทียมและสถานีตรวจวัด โดย GISTDA',
    source: 'GISTDA',
    format: 'API / GeoJSON',
    iconName: 'Wind',
    category: 'external',
    url: 'https://pm25.gistda.or.th/',
    isDownload: false,
  },
  {
    title: 'ข้อมูลจุดความร้อน (Hotspot) จาก NASA FIRMS',
    description: 'ข้อมูลจุดความร้อนจากเซ็นเซอร์ VIIRS และ MODIS ของ NASA อัปเดตทุกวัน ครอบคลุมทั่วโลก',
    source: 'NASA FIRMS',
    format: 'CSV / GeoJSON / SHP',
    iconName: 'Flame',
    category: 'external',
    url: 'https://firms.modaps.eosdis.nasa.gov/download/',
    isDownload: false,
  },
  {
    title: 'ข้อมูลคุณภาพอากาศ Open-Meteo',
    description: 'API ข้อมูลคุณภาพอากาศฟรี รวมถึง PM2.5, PM10, O3, NO2, SO2, CO พร้อมข้อมูลพยากรณ์',
    source: 'Open-Meteo',
    format: 'JSON API',
    iconName: 'Globe',
    category: 'external',
    url: 'https://open-meteo.com/en/docs/air-quality-api',
    isDownload: false,
  },
  {
    title: 'ข้อมูลคุณภาพอากาศ กรมควบคุมมลพิษ',
    description: 'ข้อมูลสถานีตรวจวัดคุณภาพอากาศทั่วประเทศไทย โดยกรมควบคุมมลพิษ',
    source: 'กรมควบคุมมลพิษ',
    format: 'Web / API',
    iconName: 'Wind',
    category: 'external',
    url: 'http://air4thai.pcd.go.th/webV3/',
    isDownload: false,
  },
  {
    title: 'ข้อมูลไฟป่าและการเผา กรมอุทยานฯ',
    description: 'ข้อมูลสถิติไฟป่า พื้นที่เผาไหม้ และจุดความร้อนในเขตป่าอนุรักษ์ทั่วประเทศ',
    source: 'กรมอุทยานแห่งชาติ',
    format: 'Web',
    iconName: 'Flame',
    category: 'external',
    url: 'https://www.dnp.go.th/forestfire/2546/firestatistic.htm',
    isDownload: false,
  },
  {
    title: 'สถานีวัดคุณภาพอากาศ มช. (CCDC)',
    description: 'ข้อมูลคุณภาพอากาศจากสถานีตรวจวัดของศูนย์ข้อมูลการเปลี่ยนแปลงสภาพภูมิอากาศ มหาวิทยาลัยเชียงใหม่',
    source: 'ม.เชียงใหม่',
    format: 'Web',
    iconName: 'Database',
    category: 'external',
    url: 'https://www.cmuccdc.org/',
    isDownload: false,
  },
];
