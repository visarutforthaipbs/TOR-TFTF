'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  ReferenceLine, ReferenceArea,
} from 'recharts';
import { CloudRain, RefreshCw, AlertTriangle, MapPin, Clock, Search } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface ForecastPoint {
  pm25: number;
  dt: string;
  isCurrent: boolean;
}

interface ProvinceForecast {
  pvIdn: number;
  pvTh: string;
  pvEn: string;
  currentPm25: number;
  currentDt: string;
  forecast: ForecastPoint[];
  updatedThai: string;
  error?: string;
}

interface ProvinceInfo {
  pvIdn: number;
  pvTh: string;
  pvEn: string;
  region: string;
}

// ── Static province list (all 77) ────────────────────────────────────────────
const REGIONS = [
  'ทั้งหมด',
  'ภาคเหนือ',
  'ภาคตะวันออกเฉียงเหนือ',
  'ภาคกลาง',
  'ภาคตะวันออก',
  'ภาคตะวันตก',
  'ภาคใต้',
] as const;

const REGION_SHORT: Record<string, string> = {
  'ทั้งหมด': 'ทั้งหมด',
  'ภาคเหนือ': 'เหนือ',
  'ภาคตะวันออกเฉียงเหนือ': 'อีสาน',
  'ภาคกลาง': 'กลาง',
  'ภาคตะวันออก': 'ตะวันออก',
  'ภาคตะวันตก': 'ตะวันตก',
  'ภาคใต้': 'ใต้',
};

const ALL_PROVINCES: ProvinceInfo[] = [
  // ภาคเหนือ
  { pvIdn: 50, pvTh: 'เชียงใหม่',     pvEn: 'Chiang Mai',      region: 'ภาคเหนือ' },
  { pvIdn: 51, pvTh: 'ลำพูน',         pvEn: 'Lamphun',         region: 'ภาคเหนือ' },
  { pvIdn: 52, pvTh: 'ลำปาง',         pvEn: 'Lampang',         region: 'ภาคเหนือ' },
  { pvIdn: 53, pvTh: 'อุตรดิตถ์',     pvEn: 'Uttaradit',       region: 'ภาคเหนือ' },
  { pvIdn: 54, pvTh: 'แพร่',          pvEn: 'Phrae',           region: 'ภาคเหนือ' },
  { pvIdn: 55, pvTh: 'น่าน',          pvEn: 'Nan',             region: 'ภาคเหนือ' },
  { pvIdn: 56, pvTh: 'พะเยา',         pvEn: 'Phayao',          region: 'ภาคเหนือ' },
  { pvIdn: 57, pvTh: 'เชียงราย',      pvEn: 'Chiang Rai',      region: 'ภาคเหนือ' },
  { pvIdn: 58, pvTh: 'แม่ฮ่องสอน',    pvEn: 'Mae Hong Son',    region: 'ภาคเหนือ' },
  // ภาคตะวันออกเฉียงเหนือ
  { pvIdn: 30, pvTh: 'นครราชสีมา',    pvEn: 'Nakhon Ratchasima', region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 31, pvTh: 'บุรีรัมย์',     pvEn: 'Buri Ram',         region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 32, pvTh: 'สุรินทร์',      pvEn: 'Surin',             region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 33, pvTh: 'ศรีสะเกษ',      pvEn: 'Si Sa Ket',         region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 34, pvTh: 'อุบลราชธานี',   pvEn: 'Ubon Ratchathani',  region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 35, pvTh: 'ยโสธร',         pvEn: 'Yasothon',          region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 36, pvTh: 'ชัยภูมิ',       pvEn: 'Chaiyaphum',        region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 37, pvTh: 'อำนาจเจริญ',    pvEn: 'Amnat Charoen',     region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 38, pvTh: 'บึงกาฬ',        pvEn: 'Bueng Kan',         region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 39, pvTh: 'หนองบัวลำภู',   pvEn: 'Nong Bua Lam Phu',  region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 40, pvTh: 'ขอนแก่น',       pvEn: 'Khon Kaen',         region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 41, pvTh: 'อุดรธานี',      pvEn: 'Udon Thani',        region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 42, pvTh: 'เลย',           pvEn: 'Loei',              region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 43, pvTh: 'หนองคาย',       pvEn: 'Nong Khai',         region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 44, pvTh: 'มหาสารคาม',     pvEn: 'Maha Sarakham',     region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 45, pvTh: 'ร้อยเอ็ด',      pvEn: 'Roi Et',            region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 46, pvTh: 'กาฬสินธุ์',     pvEn: 'Kalasin',           region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 47, pvTh: 'สกลนคร',        pvEn: 'Sakon Nakhon',      region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 48, pvTh: 'นครพนม',        pvEn: 'Nakhon Phanom',     region: 'ภาคตะวันออกเฉียงเหนือ' },
  { pvIdn: 49, pvTh: 'มุกดาหาร',      pvEn: 'Mukdahan',          region: 'ภาคตะวันออกเฉียงเหนือ' },
  // ภาคกลาง
  { pvIdn: 10, pvTh: 'กรุงเทพมหานคร', pvEn: 'Bangkok',           region: 'ภาคกลาง' },
  { pvIdn: 11, pvTh: 'สมุทรปราการ',   pvEn: 'Samut Prakan',      region: 'ภาคกลาง' },
  { pvIdn: 12, pvTh: 'นนทบุรี',       pvEn: 'Nonthaburi',        region: 'ภาคกลาง' },
  { pvIdn: 13, pvTh: 'ปทุมธานี',      pvEn: 'Pathum Thani',      region: 'ภาคกลาง' },
  { pvIdn: 14, pvTh: 'พระนครศรีอยุธยา', pvEn: 'Phra Nakhon Si Ayutthaya', region: 'ภาคกลาง' },
  { pvIdn: 15, pvTh: 'อ่างทอง',       pvEn: 'Ang Thong',         region: 'ภาคกลาง' },
  { pvIdn: 16, pvTh: 'ลพบุรี',        pvEn: 'Lop Buri',          region: 'ภาคกลาง' },
  { pvIdn: 17, pvTh: 'สิงห์บุรี',     pvEn: 'Sing Buri',         region: 'ภาคกลาง' },
  { pvIdn: 18, pvTh: 'ชัยนาท',        pvEn: 'Chai Nat',          region: 'ภาคกลาง' },
  { pvIdn: 19, pvTh: 'สระบุรี',       pvEn: 'Saraburi',          region: 'ภาคกลาง' },
  { pvIdn: 60, pvTh: 'นครสวรรค์',     pvEn: 'Nakhon Sawan',      region: 'ภาคกลาง' },
  { pvIdn: 61, pvTh: 'อุทัยธานี',     pvEn: 'Uthai Thani',       region: 'ภาคกลาง' },
  { pvIdn: 62, pvTh: 'กำแพงเพชร',     pvEn: 'Kamphaeng Phet',    region: 'ภาคกลาง' },
  { pvIdn: 64, pvTh: 'สุโขทัย',       pvEn: 'Sukhothai',         region: 'ภาคกลาง' },
  { pvIdn: 65, pvTh: 'พิษณุโลก',      pvEn: 'Phitsanulok',       region: 'ภาคกลาง' },
  { pvIdn: 66, pvTh: 'พิจิตร',        pvEn: 'Phichit',           region: 'ภาคกลาง' },
  { pvIdn: 67, pvTh: 'เพชรบูรณ์',     pvEn: 'Phetchabun',        region: 'ภาคกลาง' },
  { pvIdn: 72, pvTh: 'สุพรรณบุรี',    pvEn: 'Suphan Buri',       region: 'ภาคกลาง' },
  { pvIdn: 73, pvTh: 'นครปฐม',        pvEn: 'Nakhon Pathom',     region: 'ภาคกลาง' },
  { pvIdn: 74, pvTh: 'สมุทรสาคร',     pvEn: 'Samut Sakhon',      region: 'ภาคกลาง' },
  { pvIdn: 75, pvTh: 'สมุทรสงคราม',   pvEn: 'Samut Songkhram',   region: 'ภาคกลาง' },
  // ภาคตะวันออก
  { pvIdn: 20, pvTh: 'ชลบุรี',        pvEn: 'Chon Buri',         region: 'ภาคตะวันออก' },
  { pvIdn: 21, pvTh: 'ระยอง',         pvEn: 'Rayong',            region: 'ภาคตะวันออก' },
  { pvIdn: 22, pvTh: 'จันทบุรี',      pvEn: 'Chanthaburi',       region: 'ภาคตะวันออก' },
  { pvIdn: 23, pvTh: 'ตราด',          pvEn: 'Trat',              region: 'ภาคตะวันออก' },
  { pvIdn: 24, pvTh: 'ฉะเชิงเทรา',   pvEn: 'Chachoengsao',      region: 'ภาคตะวันออก' },
  { pvIdn: 25, pvTh: 'ปราจีนบุรี',    pvEn: 'Prachin Buri',      region: 'ภาคตะวันออก' },
  { pvIdn: 26, pvTh: 'นครนายก',       pvEn: 'Nakhon Nayok',      region: 'ภาคตะวันออก' },
  { pvIdn: 27, pvTh: 'สระแก้ว',       pvEn: 'Sa Kaeo',           region: 'ภาคตะวันออก' },
  // ภาคตะวันตก
  { pvIdn: 63, pvTh: 'ตาก',           pvEn: 'Tak',               region: 'ภาคตะวันตก' },
  { pvIdn: 70, pvTh: 'ราชบุรี',       pvEn: 'Ratchaburi',        region: 'ภาคตะวันตก' },
  { pvIdn: 71, pvTh: 'กาญจนบุรี',     pvEn: 'Kanchanaburi',      region: 'ภาคตะวันตก' },
  { pvIdn: 76, pvTh: 'เพชรบุรี',      pvEn: 'Phetchaburi',       region: 'ภาคตะวันตก' },
  { pvIdn: 77, pvTh: 'ประจวบคีรีขันธ์', pvEn: 'Prachuap Khiri Khan', region: 'ภาคตะวันตก' },
  // ภาคใต้
  { pvIdn: 80, pvTh: 'นครศรีธรรมราช', pvEn: 'Nakhon Si Thammarat', region: 'ภาคใต้' },
  { pvIdn: 81, pvTh: 'กระบี่',        pvEn: 'Krabi',              region: 'ภาคใต้' },
  { pvIdn: 82, pvTh: 'พังงา',         pvEn: 'Phangnga',           region: 'ภาคใต้' },
  { pvIdn: 83, pvTh: 'ภูเก็ต',        pvEn: 'Phuket',             region: 'ภาคใต้' },
  { pvIdn: 84, pvTh: 'สุราษฎร์ธานี',  pvEn: 'Surat Thani',        region: 'ภาคใต้' },
  { pvIdn: 85, pvTh: 'ระนอง',         pvEn: 'Ranong',             region: 'ภาคใต้' },
  { pvIdn: 86, pvTh: 'ชุมพร',         pvEn: 'Chumphon',           region: 'ภาคใต้' },
  { pvIdn: 90, pvTh: 'สงขลา',         pvEn: 'Songkhla',           region: 'ภาคใต้' },
  { pvIdn: 91, pvTh: 'สตูล',          pvEn: 'Satun',              region: 'ภาคใต้' },
  { pvIdn: 92, pvTh: 'ตรัง',          pvEn: 'Trang',              region: 'ภาคใต้' },
  { pvIdn: 93, pvTh: 'พัทลุง',        pvEn: 'Phatthalung',        region: 'ภาคใต้' },
  { pvIdn: 94, pvTh: 'ปัตตานี',       pvEn: 'Pattani',            region: 'ภาคใต้' },
  { pvIdn: 95, pvTh: 'ยะลา',          pvEn: 'Yala',               region: 'ภาคใต้' },
  { pvIdn: 96, pvTh: 'นราธิวาส',      pvEn: 'Narathiwat',         region: 'ภาคใต้' },
];

// ── Thai PM2.5 color scale ──────────────────────────────────────────────────
const LEVELS = [
  { max: 25,    label: 'ดี',                  color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
  { max: 37.5,  label: 'ปานกลาง',            color: '#eab308', bg: '#fefce8', border: '#fde68a' },
  { max: 75,    label: 'เริ่มมีผลต่อสุขภาพ', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { max: 100,   label: 'มีผลต่อสุขภาพ',      color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  { max: 9999,  label: 'อันตราย',            color: '#a855f7', bg: '#faf5ff', border: '#e9d5ff' },
];

function getLevel(pm25: number) {
  return LEVELS.find(l => pm25 <= l.max) ?? LEVELS[LEVELS.length - 1];
}

const BANDS = [
  { y1: 0,    y2: 25,   fill: '#22c55e', opacity: 0.07 },
  { y1: 25,   y2: 37.5, fill: '#eab308', opacity: 0.07 },
  { y1: 37.5, y2: 75,   fill: '#f97316', opacity: 0.07 },
  { y1: 75,   y2: 100,  fill: '#ef4444', opacity: 0.07 },
  { y1: 100,  y2: 200,  fill: '#a855f7', opacity: 0.07 },
];

function formatICT(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' น.';
}

function formatICTShort(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// ── Custom tooltip ──────────────────────────────────────────────────────────
function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  const lvl = getLevel(d.pm25);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-[180px]">
      <p className="text-xs text-text-muted mb-1">
        <Clock className="w-3 h-3 inline mr-1" />
        {formatICT(d.dt)}
        {d.isCurrent && <span className="ml-1 text-primary font-bold">(ปัจจุบัน)</span>}
      </p>
      <p className="text-lg font-bold text-text-main">
        {d.pm25.toFixed(1)} <span className="text-sm font-normal text-text-muted">µg/m³</span>
      </p>
      <span
        className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.border}` }}
      >
        {lvl.label}
      </span>
    </div>
  );
}

// ── Active dot ──────────────────────────────────────────────────────────────
function ActiveDot(props: any) {
  const { cx, cy, payload } = props;
  if (payload?.isCurrent) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="#F26522" opacity={0.2} />
        <circle cx={cx} cy={cy} r={5} fill="#F26522" stroke="#fff" strokeWidth={2} />
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={4} fill="#F26522" stroke="#fff" strokeWidth={2} />;
}

// ── Province selector dropdown ──────────────────────────────────────────────
function ProvinceSelector({
  region, setRegion, selected, onSelect, search, setSearch,
}: {
  region: string;
  setRegion: (r: string) => void;
  selected: number;
  onSelect: (id: number) => void;
  search: string;
  setSearch: (s: string) => void;
}) {
  const filtered = ALL_PROVINCES.filter(p => {
    const matchRegion = region === 'ทั้งหมด' || p.region === region;
    const matchSearch =
      !search ||
      p.pvTh.includes(search) ||
      p.pvEn.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
      {/* Region tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {REGIONS.map(r => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              region === r
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-text-muted hover:bg-gray-200'
            }`}
          >
            {REGION_SHORT[r]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาจังหวัด..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Province grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 max-h-[240px] overflow-y-auto">
        {filtered.map(p => (
          <button
            key={p.pvIdn}
            onClick={() => onSelect(p.pvIdn)}
            className={`px-2.5 py-2 rounded-xl text-sm text-left transition-colors truncate ${
              selected === p.pvIdn
                ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                : 'bg-gray-50 text-text-main hover:bg-gray-100 border border-transparent'
            }`}
          >
            {p.pvTh}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-text-muted text-sm py-4">ไม่พบจังหวัด</p>
        )}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ForecastClient() {
  const [selectedPvIdn, setSelectedPvIdn] = useState(50); // default: Chiang Mai
  const [region, setRegion]       = useState('ภาคเหนือ');
  const [search, setSearch]       = useState('');
  const [data, setData]           = useState<ProvinceForecast | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const fetchForecast = useCallback((pvIdn: number) => {
    setLoading(true);
    setError(null);
    fetch(`/api/forecast?pv_idn=${pvIdn}`)
      .then(r => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then((d: ProvinceForecast) => { setData(d); setLoading(false); })
      .catch(() => { setError('ไม่สามารถโหลดข้อมูลพยากรณ์ได้'); setLoading(false); });
  }, []);

  useEffect(() => { fetchForecast(selectedPvIdn); }, [selectedPvIdn, fetchForecast]);

  const handleSelect = (pvIdn: number) => {
    setSelectedPvIdn(pvIdn);
  };

  const selectedProv = ALL_PROVINCES.find(p => p.pvIdn === selectedPvIdn);

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <CloudRain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-main">พยากรณ์คุณภาพอากาศ</h1>
              <p className="text-sm text-text-muted">PM2.5 รายชั่วโมง — ทุกจังหวัดทั่วประเทศ</p>
            </div>
          </div>
          <p className="text-text-muted mt-2 max-w-2xl">
            ข้อมูลพยากรณ์ค่าฝุ่น PM2.5 ล่วงหน้ารายชั่วโมง จากระบบ GISTDA สำหรับทุกจังหวัดในประเทศไทย
            เลือกจังหวัดด้านล่างเพื่อดูข้อมูล อัปเดตทุก 1 ชั่วโมง เวลาแสดงเป็นเวลาประเทศไทย (ICT, UTC+7)
          </p>
        </div>

        {/* Color scale legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {LEVELS.map(l => (
            <div
              key={l.label}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
              style={{ background: l.bg, borderColor: l.border, color: l.color }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="font-semibold">{l.label}</span>
              <span style={{ color: '#9ca3af' }}>≤ {l.max === 9999 ? '100+' : l.max}</span>
            </div>
          ))}
          <span className="text-xs text-text-muted self-center ml-2">µg/m³</span>
        </div>

        {/* Province selector */}
        <ProvinceSelector
          region={region}
          setRegion={setRegion}
          selected={selectedPvIdn}
          onSelect={handleSelect}
          search={search}
          setSearch={setSearch}
        />

        {/* Chart section */}
        <div className="mt-6">
          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <p className="text-text-muted">กำลังโหลดข้อมูล{selectedProv ? ` ${selectedProv.pvTh}` : ''}...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 justify-center py-20 text-text-muted">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <p>{error}</p>
            </div>
          )}

          {/* Chart card */}
          {!loading && !error && data && <ForecastChart data={data} />}
        </div>
      </div>
    </section>
  );
}

// ── Single forecast chart card ──────────────────────────────────────────────
function ForecastChart({ data }: { data: ProvinceForecast }) {
  const lvl = getLevel(data.currentPm25);

  if (data.error || data.forecast.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-text-main text-lg">{data.pvTh}</h3>
          <span className="text-sm text-text-muted">({data.pvEn})</span>
        </div>
        <div className="flex items-center gap-3 justify-center py-12 text-text-muted">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <p>ไม่มีข้อมูลการพยากรณ์สำหรับจังหวัดนี้ในขณะนี้</p>
        </div>
      </div>
    );
  }

  const chartData = data.forecast.map(f => ({
    ...f,
    time: formatICTShort(f.dt),
  }));

  const maxPm25 = Math.max(...data.forecast.map(f => f.pm25), 30);
  const yMax = Math.ceil(maxPm25 / 25) * 25;
  const currentEntry = data.forecast.find(f => f.isCurrent);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <h3 className="font-bold text-text-main text-xl">{data.pvTh}</h3>
            <span className="text-sm text-text-muted">({data.pvEn})</span>
          </div>
          {data.updatedThai && (
            <p className="text-xs text-text-muted pl-7">อัปเดต: {data.updatedThai}</p>
          )}
        </div>
        {currentEntry && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border self-start"
            style={{ background: lvl.bg, borderColor: lvl.border }}
          >
            <div>
              <p className="text-2xl font-bold leading-none" style={{ color: lvl.color }}>
                {data.currentPm25.toFixed(1)}
              </p>
              <p className="text-xs text-text-muted">µg/m³</p>
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: lvl.color, color: '#fff' }}
            >
              {lvl.label}
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="px-2 pb-4" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            {BANDS.filter(b => b.y1 < yMax).map(b => (
              <ReferenceArea
                key={b.y1}
                y1={b.y1}
                y2={Math.min(b.y2, yMax)}
                fill={b.fill}
                fillOpacity={b.opacity}
                strokeOpacity={0}
              />
            ))}
            <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={37.5} stroke="#eab308" strokeDasharray="4 4" strokeOpacity={0.5} />
            {yMax > 75 && <ReferenceLine y={75} stroke="#f97316" strokeDasharray="4 4" strokeOpacity={0.5} />}
            {yMax > 100 && <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} />}

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              domain={[0, yMax]}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}`}
              width={40}
              label={{
                value: 'µg/m³',
                position: 'insideTopLeft',
                offset: -5,
                style: { fontSize: 11, fill: '#9ca3af' },
              }}
            />
            <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: '#F26522', strokeDasharray: '4 4' }} />
            <Line
              type="monotone"
              dataKey="pm25"
              stroke="#F26522"
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload?.isCurrent) {
                  return (
                    <g key={`dot-${payload.dt}`}>
                      <circle cx={cx} cy={cy} r={8} fill="#F26522" opacity={0.2}>
                        <animate attributeName="r" from="6" to="12" dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={cx} cy={cy} r={5} fill="#F26522" stroke="#fff" strokeWidth={2} />
                    </g>
                  );
                }
                return (
                  <circle
                    key={`dot-${payload?.dt ?? props.index}`}
                    cx={cx} cy={cy} r={3}
                    fill="#fff" stroke="#F26522" strokeWidth={2}
                  />
                );
              }}
              activeDot={<ActiveDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast pills */}
      <div className="px-3 sm:px-5 pb-4 flex flex-wrap gap-1.5 sm:gap-2 max-h-[150px] overflow-y-auto hide-scrollbar">
        {data.forecast.map((f, i) => {
          const fl = getLevel(f.pm25);
          return (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${
                f.isCurrent ? 'ring-2 ring-primary/30' : ''
              }`}
              style={{ background: fl.bg, borderColor: fl.border, color: fl.color }}
            >
              <span className="font-medium">{formatICTShort(f.dt)}</span>
              <span className="font-bold">{f.pm25.toFixed(1)}</span>
              {f.isCurrent && <span className="text-primary">●</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
