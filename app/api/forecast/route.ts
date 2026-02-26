import { NextRequest, NextResponse } from 'next/server';

// ── Types ────────────────────────────────────────────────────────────────────
interface GistdaPredResponse {
  status: number;
  errMsg: string;
  graphPredictByHrs: [number, string][];
  graphMetadata: string[];
  datetimeThai: { dateThai: string; timeThai: string };
  datetimeEng:  { dateEng: string; timeEng: string };
  pm25: [number, string];
}

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

// ── All 77 provinces by region ───────────────────────────────────────────────
interface ProvinceInfo {
  pvIdn: number;
  pvTh: string;
  pvEn: string;
  region: string;
}

const ALL_PROVINCES: ProvinceInfo[] = [
  // ภาคเหนือ (North) — 9
  { pvIdn: 50, pvTh: 'เชียงใหม่',     pvEn: 'Chiang Mai',      region: 'ภาคเหนือ' },
  { pvIdn: 51, pvTh: 'ลำพูน',         pvEn: 'Lamphun',         region: 'ภาคเหนือ' },
  { pvIdn: 52, pvTh: 'ลำปาง',         pvEn: 'Lampang',         region: 'ภาคเหนือ' },
  { pvIdn: 53, pvTh: 'อุตรดิตถ์',     pvEn: 'Uttaradit',       region: 'ภาคเหนือ' },
  { pvIdn: 54, pvTh: 'แพร่',          pvEn: 'Phrae',           region: 'ภาคเหนือ' },
  { pvIdn: 55, pvTh: 'น่าน',          pvEn: 'Nan',             region: 'ภาคเหนือ' },
  { pvIdn: 56, pvTh: 'พะเยา',         pvEn: 'Phayao',          region: 'ภาคเหนือ' },
  { pvIdn: 57, pvTh: 'เชียงราย',      pvEn: 'Chiang Rai',      region: 'ภาคเหนือ' },
  { pvIdn: 58, pvTh: 'แม่ฮ่องสอน',    pvEn: 'Mae Hong Son',    region: 'ภาคเหนือ' },
  // ภาคตะวันออกเฉียงเหนือ (Northeast / Isan) — 20
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
  // ภาคกลาง (Central) — 21
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
  // ภาคตะวันออก (East) — 8
  { pvIdn: 20, pvTh: 'ชลบุรี',        pvEn: 'Chon Buri',         region: 'ภาคตะวันออก' },
  { pvIdn: 21, pvTh: 'ระยอง',         pvEn: 'Rayong',            region: 'ภาคตะวันออก' },
  { pvIdn: 22, pvTh: 'จันทบุรี',      pvEn: 'Chanthaburi',       region: 'ภาคตะวันออก' },
  { pvIdn: 23, pvTh: 'ตราด',          pvEn: 'Trat',              region: 'ภาคตะวันออก' },
  { pvIdn: 24, pvTh: 'ฉะเชิงเทรา',   pvEn: 'Chachoengsao',      region: 'ภาคตะวันออก' },
  { pvIdn: 25, pvTh: 'ปราจีนบุรี',    pvEn: 'Prachin Buri',      region: 'ภาคตะวันออก' },
  { pvIdn: 26, pvTh: 'นครนายก',       pvEn: 'Nakhon Nayok',      region: 'ภาคตะวันออก' },
  { pvIdn: 27, pvTh: 'สระแก้ว',       pvEn: 'Sa Kaeo',           region: 'ภาคตะวันออก' },
  // ภาคตะวันตก (West) — 5
  { pvIdn: 63, pvTh: 'ตาก',           pvEn: 'Tak',               region: 'ภาคตะวันตก' },
  { pvIdn: 70, pvTh: 'ราชบุรี',       pvEn: 'Ratchaburi',        region: 'ภาคตะวันตก' },
  { pvIdn: 71, pvTh: 'กาญจนบุรี',     pvEn: 'Kanchanaburi',      region: 'ภาคตะวันตก' },
  { pvIdn: 76, pvTh: 'เพชรบุรี',      pvEn: 'Phetchaburi',       region: 'ภาคตะวันตก' },
  { pvIdn: 77, pvTh: 'ประจวบคีรีขันธ์', pvEn: 'Prachuap Khiri Khan', region: 'ภาคตะวันตก' },
  // ภาคใต้ (South) — 14
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

// ── Per-province in-memory cache (1 hour TTL) ───────────────────────────────
const cache = new Map<number, { data: ProvinceForecast; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000;

async function fetchProvince(prov: ProvinceInfo): Promise<ProvinceForecast> {
  const cached = cache.get(prov.pvIdn);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  try {
    const res = await fetch(
      `https://pm25.gistda.or.th/rest/pred/getPM25byProvince?pv_idn=${prov.pvIdn}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: GistdaPredResponse = await res.json();

    const forecast: ForecastPoint[] = [];

    if (json.pm25) {
      forecast.push({ pm25: json.pm25[0], dt: json.pm25[1], isCurrent: true });
    }
    for (const [val, dt] of json.graphPredictByHrs ?? []) {
      forecast.push({ pm25: val, dt, isCurrent: false });
    }
    forecast.sort((a, b) => new Date(a.dt).getTime() - new Date(b.dt).getTime());

    const result: ProvinceForecast = {
      pvIdn: prov.pvIdn,
      pvTh: prov.pvTh,
      pvEn: prov.pvEn,
      currentPm25: json.pm25?.[0] ?? 0,
      currentDt: json.pm25?.[1] ?? '',
      forecast,
      updatedThai: json.datetimeThai
        ? `${json.datetimeThai.dateThai} ${json.datetimeThai.timeThai}`
        : '',
    };

    cache.set(prov.pvIdn, { data: result, ts: Date.now() });
    return result;
  } catch {
    return {
      pvIdn: prov.pvIdn,
      pvTh: prov.pvTh,
      pvEn: prov.pvEn,
      currentPm25: 0,
      currentDt: '',
      forecast: [],
      updatedThai: '',
      error: 'ไม่สามารถโหลดข้อมูลได้',
    };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const pvIdnParam = searchParams.get('pv_idn');

  // If no province specified, return the province list
  if (!pvIdnParam) {
    return NextResponse.json(
      { provinces: ALL_PROVINCES },
      { headers: { 'Cache-Control': 'public, max-age=86400' } },
    );
  }

  const pvIdn = Number(pvIdnParam);
  const prov = ALL_PROVINCES.find(p => p.pvIdn === pvIdn);

  if (!prov) {
    return NextResponse.json({ error: 'Province not found' }, { status: 404 });
  }

  const result = await fetchProvince(prov);

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
  });
}
