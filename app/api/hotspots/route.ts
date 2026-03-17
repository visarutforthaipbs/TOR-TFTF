import { NextResponse } from 'next/server';

interface HotspotPoint {
  lat: number;
  lng: number;
  frp: number;
  confidence: string;
  acqDate: string;
  daynight: string;
}

function parseHotspotCsv(csv: string): HotspotPoint[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',');
  const idx = (key: string) => headers.indexOf(key);
  const latI  = idx('latitude');
  const lngI  = idx('longitude');
  const frpI  = idx('frp');
  const confI = idx('confidence');
  const dateI = idx('acq_date');
  const dnI   = idx('daynight');
  if (latI < 0 || lngI < 0) return []; // not valid CSV
  return lines.slice(1)
    .map(line => {
      const c = line.split(',');
      return {
        lat:        parseFloat(c[latI]),
        lng:        parseFloat(c[lngI]),
        frp:        parseFloat(c[frpI]) || 0,
        confidence: c[confI]?.trim() || 'n',
        acqDate:    c[dateI]?.trim() || '',
        daynight:   c[dnI]?.trim()   || 'D',
      };
    })
    .filter(p => !isNaN(p.lat) && !isNaN(p.lng));
}

export const revalidate = 3600; // revalidate every hour

export async function GET() {
  // Thailand bounding box (slightly padded): W,S,E,N
  const bbox = '97.3,5.4,105.8,20.6';
  const key  = '6d93fd438409ae8d0d19a793a973000b';

  // Fetch both VIIRS sources (SNPP + NOAA-20) with 2-day window
  // to ensure coverage even if today's pass hasn't happened yet
  const urls = [
    `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_SNPP_NRT/${bbox}/2`,
    `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${key}/VIIRS_NOAA20_NRT/${bbox}/2`,
  ];

  try {
    const results = await Promise.allSettled(
      urls.map(url =>
        fetch(url, {
          next: { revalidate: 3600 },
          headers: { 'User-Agent': 'TanFunTanFai-Dashboard/1.0' },
        }).then(r => (r.ok ? r.text() : ''))
      )
    );

    const allHotspots: HotspotPoint[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        allHotspots.push(...parseHotspotCsv(result.value));
      }
    }

    // Deduplicate by rounding lat/lng to 4 decimals + same date
    const seen = new Set<string>();
    const unique = allHotspots.filter(p => {
      const key = `${p.lat.toFixed(4)},${p.lng.toFixed(4)},${p.acqDate}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json(unique, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' },
    });
  } catch {
    return NextResponse.json([]);
  }
}
