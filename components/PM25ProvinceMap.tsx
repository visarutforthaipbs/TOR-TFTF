'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RefreshCw, TrendingUp, TrendingDown, Wind, Flame, Layers, X, List } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Pm25Province {
  pv_tn: string;
  pv_en: string;
  pv_idn: number;
  pm25: number;
  pm25Avg24hr: number;
  dt: string;
}

export interface HotspotPoint {
  lat: number;
  lng: number;
  frp: number;
  confidence: string;
  acqDate: string;
  daynight: string;
}

interface Props {
  initialData: Pm25Province[];
  lastUpdated: string;
}

// ── PM2.5 level helpers (Thai national standards) ─────────────────────────────
function getLevel(pm25: number) {
  if (pm25 <= 25)   return { label: 'ดี',                  color: '#22c55e', textClass: 'text-green-700',  bgClass: 'bg-green-50',   borderClass: 'border-green-200' };
  if (pm25 <= 37.5) return { label: 'ปานกลาง',             color: '#eab308', textClass: 'text-yellow-700', bgClass: 'bg-yellow-50',  borderClass: 'border-yellow-200' };
  if (pm25 <= 75)   return { label: 'เริ่มมีผลต่อสุขภาพ',   color: '#f97316', textClass: 'text-orange-700', bgClass: 'bg-orange-50',  borderClass: 'border-orange-200' };
  if (pm25 <= 100)  return { label: 'มีผลต่อสุขภาพ',       color: '#ef4444', textClass: 'text-red-700',    bgClass: 'bg-red-50',     borderClass: 'border-red-200' };
  return             { label: 'อันตราย',                   color: '#a855f7', textClass: 'text-purple-700', bgClass: 'bg-purple-50',  borderClass: 'border-purple-200' };
}

// ── Hotspot fire icon (FRP-scaled) ────────────────────────────────────────────
function getFireIcon(frp: number, conf: string) {
  const size   = frp > 200 ? 28 : frp > 100 ? 22 : frp > 50 ? 18 : 14;
  const color  = frp > 200 ? '#dc2626' : frp > 50 ? '#ea580c' : '#f59e0b';
  const opacity = conf === 'h' ? 1 : conf === 'n' ? 0.8 : 0.55;
  return L.divIcon({
    className: '',
    iconSize:  [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" opacity="${opacity}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))"><path d="M12 23c-4.97 0-9-3.03-9-7 0-2.93 1.66-5.63 4.29-7.24.2-.12.44-.14.66-.05.22.09.38.28.43.51.35 1.55 1.13 2.82 2.17 3.67.08-.71.3-1.44.66-2.15C12.63 7.66 14.3 5.01 14.56 1.5c.02-.25.16-.47.38-.58.22-.11.48-.1.69.03C18.37 2.86 21 6.73 21 11c0 6.63-4.03 12-9 12z"/></svg>`,
  });
}

// ── Legend data ───────────────────────────────────────────────────────────────
const PM25_LEGEND = [
  { label: 'ดี',                  color: '#22c55e', range: '≤ 25' },
  { label: 'ปานกลาง',            color: '#eab308', range: '25–37.5' },
  { label: 'เริ่มมีผลต่อสุขภาพ', color: '#f97316', range: '37.5–75' },
  { label: 'มีผลต่อสุขภาพ',       color: '#ef4444', range: '75–100' },
  { label: 'อันตราย',             color: '#a855f7', range: '> 100' },
];

const HOTSPOT_LEGEND = [
  { label: 'ขนาดเล็ก (< 50 MW)',   color: '#f59e0b' },
  { label: 'ขนาดกลาง (50–200 MW)', color: '#ea580c' },
  { label: 'ขนาดใหญ่ (> 200 MW)',  color: '#dc2626' },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function PM25ProvinceMap({ initialData, lastUpdated }: Props) {
  const [geoJson, setGeoJson]                   = useState<any>(null);
  const [pm25Data]                               = useState<Pm25Province[]>(initialData);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [geoLoading, setGeoLoading]             = useState(true);
  const [hotspots, setHotspots]                 = useState<HotspotPoint[]>([]);
  const [hotspotLoading, setHotspotLoading]     = useState(true);
  const [showPM25, setShowPM25]                 = useState(true);
  const [showHotspots, setShowHotspots]         = useState(true);
  const [legendOpen, setLegendOpen]             = useState(true);
  const [sidebarOpen, setSidebarOpen]           = useState(false);

  // Prevent map interactions from bleeding through the legend panel
  // NOTE: do NOT stop 'click' — that breaks React's event delegation for checkboxes
  const legendRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = legendRef.current;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    ['dblclick','mousedown','touchstart'].forEach(ev =>
      el.addEventListener(ev, stop, { passive: false })
    );
    el.addEventListener('wheel', stop, { passive: false });
    return () => {
      ['dblclick','mousedown','touchstart'].forEach(ev =>
        el.removeEventListener(ev, stop)
      );
      el.removeEventListener('wheel', stop);
    };
  }, []);

  // Fast lookups
  const pm25ByTh   = Object.fromEntries(pm25Data.map(p => [p.pv_tn, p]));
  const pm25ByCode = Object.fromEntries(pm25Data.map(p => [p.pv_idn, p]));

  // Sorted descending by current PM2.5
  const sortedProvinces = [...pm25Data].sort((a, b) => b.pm25 - a.pm25);

  // Fetch GeoJSON on mount (client-side only — Leaflet requirement)
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/chingchai/OpenGISData-Thailand/master/provinces.geojson')
      .then(r => r.json())
      .then(data => { setGeoJson(data); setGeoLoading(false); })
      .catch(() => setGeoLoading(false));
  }, []);

  // Fetch hotspots from our API route (server proxies FIRMS, avoids CORS/build-time issues)
  useEffect(() => {
    fetch('/api/hotspots')
      .then(r => r.json())
      .then((data: HotspotPoint[]) => { setHotspots(data); setHotspotLoading(false); })
      .catch(() => setHotspotLoading(false));
  }, []);

  // Helper: resolve province data from a GeoJSON feature
  const resolveFeature = useCallback((feature: any): Pm25Province | null => {
    const code = parseInt(feature?.properties?.pro_code, 10);
    const th   = feature?.properties?.pro_th as string;
    return pm25ByCode[code] ?? pm25ByTh[th] ?? null;
  }, [pm25ByCode, pm25ByTh]);

  // Leaflet layer styles
  const getFeatureStyle = useCallback((feature: any) => {
    const data       = resolveFeature(feature);
    const pm25       = data?.pm25 ?? 0;
    const level      = getLevel(pm25);
    const isSelected = selectedProvince === (feature?.properties?.pro_th as string);
    return {
      fillColor:   showPM25 ? level.color : '#94a3b8',
      fillOpacity: isSelected ? 0.88 : 0.65,
      color:       isSelected ? '#1f2937' : '#ffffff',
      weight:      isSelected ? 2.5 : 0.7,
    };
  }, [resolveFeature, selectedProvince, showPM25]);

  const onEachFeature = useCallback((feature: any, layer: any) => {
    const proTh = feature?.properties?.pro_th as string;
    const data  = resolveFeature(feature);

    layer.on({
      click:     () => setSelectedProvince(prev => prev === proTh ? null : proTh),
      mouseover: (e: any) => e.target.setStyle({ fillOpacity: 0.92, weight: 2 }),
      mouseout:  (e: any) => e.target.setStyle(getFeatureStyle(feature)),
    });

    if (data) {
      const lvl = getLevel(data.pm25);
      const diff = data.pm25 - data.pm25Avg24hr;
      const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
      const diffColor = diff > 0 ? '#ef4444' : diff < 0 ? '#22c55e' : '#9ca3af';
      layer.bindTooltip(
        `<div style="padding:14px 16px;min-width:180px">
           <div style="font-weight:700;font-size:15px;color:#1f2937;margin-bottom:2px">${proTh}</div>
           <div style="font-size:12px;color:#9ca3af;margin-bottom:8px">${data.pv_en || ''}</div>
           <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:8px">
             <span style="font-size:28px;font-weight:700;color:#1f2937;line-height:1">${data.pm25.toFixed(1)}</span>
             <span style="font-size:12px;color:#4b5563">µg/m³</span>
           </div>
           <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
             <span style="display:inline-block;padding:2px 10px;border-radius:9999px;font-size:11px;font-weight:600;color:#fff;background:${lvl.color}">${lvl.label}</span>
             <span style="font-size:11px;font-weight:600;color:${diffColor}">${diffStr}</span>
           </div>
           <div style="border-top:1px solid #f3f4f6;padding-top:6px;display:flex;justify-content:space-between;font-size:12px;color:#9ca3af">
             <span>เฉลี่ย 24ชม</span>
             <span style="font-weight:600;color:#4b5563">${data.pm25Avg24hr.toFixed(1)} µg/m³</span>
           </div>
         </div>`,
        { sticky: true, opacity: 0.97 }
      );
    }
  }, [resolveFeature, getFeatureStyle]);

  const selectedData = selectedProvince ? (pm25ByTh[selectedProvince] ?? null) : null;
  const selectedLevel = selectedData ? getLevel(selectedData.pm25) : null;

  // Trend helper
  const trend = selectedData
    ? selectedData.pm25 - selectedData.pm25Avg24hr
    : 0;

  return (
    <div className="flex h-full relative">
      {/* ── Mobile sidebar toggle button ───────────────────────── */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden absolute top-3 left-3 z-[1000] bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2.5 flex items-center gap-2 hover:shadow-xl transition-shadow"
      >
        <List className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-text-main">รายจังหวัด</span>
        {pm25Data.length > 0 && (
          <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pm25Data.length}</span>
        )}
      </button>

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-[1001]" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Left Sidebar ─────────────────────────────────────────── */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-[1002] md:z-auto
        w-[85vw] sm:w-80 md:w-80 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white h-full overflow-hidden
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>

        {/* Mobile close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-text-muted" />
        </button>

        {/* Sticky header */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-text-main text-base">PM2.5 รายจังหวัด</h2>
            </div>
          </div>
          <p className="text-xs text-text-muted mb-3">{lastUpdated}</p>

          {/* Legend pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {PM25_LEGEND.map(l => (
              <div key={l.label} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded-full border border-gray-100">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                <span>{l.label}</span>
                <span className="text-gray-400">{l.range}</span>
              </div>
            ))}
          </div>

          {/* Hotspot count pill */}
          <div className="flex items-center gap-2 text-xs bg-orange-50 border border-orange-100 rounded-full px-2.5 py-1">
            <Flame className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-orange-700">จุดความร้อนวันนี้:</span>
            {hotspotLoading
              ? <span className="text-orange-400 italic">กำลังโหลด…</span>
              : <span className="font-bold text-orange-700">{hotspots.length} จุด</span>
            }
          </div>
        </div>

        {/* Selected province detail card */}
        {selectedData && selectedLevel && (
          <div className={`mx-3 mt-3 p-4 rounded-2xl border ${selectedLevel.borderClass} ${selectedLevel.bgClass} flex-shrink-0`}>
            <p className={`font-bold text-base ${selectedLevel.textClass}`}>{selectedData.pv_tn}</p>
            <p className="text-xs text-text-muted mb-2">{selectedData.pv_en}</p>

            <p className="text-3xl font-bold text-text-main leading-none">
              {selectedData.pm25.toFixed(1)}
              <span className="text-sm font-normal text-text-muted ml-1">µg/m³</span>
            </p>

            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${selectedLevel.bgClass} ${selectedLevel.textClass} border ${selectedLevel.borderClass}`}>
              {selectedLevel.label}
            </span>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
              {trend > 0
                ? <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                : <TrendingDown className="w-3.5 h-3.5 text-green-500" />}
              เฉลี่ย 24 ชม: {selectedData.pm25Avg24hr.toFixed(1)} µg/m³
              <span className={trend > 0 ? 'text-red-500' : 'text-green-500'}>
                ({trend > 0 ? '+' : ''}{trend.toFixed(1)})
              </span>
            </div>
          </div>
        )}

        {/* Province list */}
        <div className="flex-1 overflow-y-auto">
          {sortedProvinces.map((province, i) => {
            const lvl        = getLevel(province.pm25);
            const isSelected = selectedProvince === province.pv_tn;
            return (
              <button
                key={province.pv_idn}
                onClick={() => {
                  setSelectedProvince(prev => prev === province.pv_tn ? null : province.pv_tn);
                  // Close sidebar on mobile after selecting
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 transition-colors text-left hover:bg-gray-50 ${isSelected ? 'bg-secondary/60' : ''}`}
              >
                <span className="text-xs text-gray-400 w-6 text-right flex-shrink-0">{i + 1}</span>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: lvl.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">{province.pv_tn}</p>
                  <p className="text-xs text-text-muted truncate">{province.pv_en}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-text-main">{province.pm25.toFixed(1)}</p>
                  <p className="text-xs text-text-muted">µg/m³</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Map ─────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {geoLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-text-muted">กำลังโหลดชั้นข้อมูลจังหวัด...</p>
            </div>
          </div>
        )}

        <MapContainer
          center={[13.0, 101.0]}
          zoom={6}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          {geoJson && showPM25 && (
            <GeoJSON
              key={`${selectedProvince ?? 'none'}-${showPM25}`}
              data={geoJson}
              style={getFeatureStyle}
              onEachFeature={onEachFeature}
            />
          )}

          {showHotspots && hotspots.map((hs, i) => {
            const icon = getFireIcon(hs.frp, hs.confidence);
            return (
              <Marker
                key={i}
                position={[hs.lat, hs.lng]}
                icon={icon}
              >
                <Tooltip sticky opacity={0.97}>
                  <div style={{ padding: '14px 16px', minWidth: 190 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#FFF7ED', border: '1px solid #FDBA74' }}>🔥</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#1f2937', lineHeight: 1.2 }}>จุดความร้อน VIIRS</div>
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>NASA FIRMS</div>
                      </div>
                    </div>

                    {/* FRP */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                      <span>พลังงานความร้อน (FRP)</span>
                      <strong style={{ color: '#1f2937', fontSize: 14 }}>{hs.frp.toFixed(1)} MW</strong>
                    </div>

                    {/* Confidence */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#4b5563', marginBottom: 6 }}>
                      <span>ระดับความเชื่อมั่น</span>
                      <span style={{
                        display: 'inline-block',
                        padding: '1px 10px',
                        borderRadius: 9999,
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#fff',
                        background: hs.confidence === 'h' ? '#22c55e' : hs.confidence === 'n' ? '#F26522' : '#9ca3af',
                      }}>
                        {hs.confidence === 'h' ? 'สูง' : hs.confidence === 'n' ? 'ปานกลาง' : 'ต่ำ'}
                      </span>
                    </div>

                    {/* Footer */}
                    <div style={{ borderTop: '1px solid #f3f4f6', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#9ca3af' }}>
                      <span>{hs.acqDate}</span>
                      <span style={{
                        background: hs.daynight === 'D' ? '#FFF7ED' : '#EDE9FE',
                        color: hs.daynight === 'D' ? '#c2410c' : '#6d28d9',
                        border: `1px solid ${hs.daynight === 'D' ? '#FDBA74' : '#c4b5fd'}`,
                        padding: '1px 8px',
                        borderRadius: 9999,
                        fontSize: 11,
                        fontWeight: 500,
                      }}>
                        {hs.daynight === 'D' ? '☀️ กลางวัน' : '🌙 กลางคืน'}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
          {/* Label layer on top */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            attribution=""
            pane="shadowPane"
          />
        </MapContainer>

        {/* ── Floating Layer-Toggle Legend Panel ───────────────────── */}
        <div
          ref={legendRef}
          className="absolute bottom-4 right-3 sm:bottom-6 sm:right-4 z-[999] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-[calc(100vw-24px)]"
          style={{ minWidth: 180 }}
        >
          <button
            onClick={() => setLegendOpen(o => !o)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-text-main">ชั้นข้อมูล</span>
            </div>
            <span className="text-gray-400 text-xs">{legendOpen ? '▾' : '▸'}</span>
          </button>

          {legendOpen && (
            <div className="p-3 space-y-3">
              {/* PM2.5 layer toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={showPM25}
                    onChange={e => setShowPM25(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary"
                  />
                  <span className="text-xs font-semibold text-text-main">PM2.5 รายจังหวัด</span>
                </label>
                {showPM25 && (
                  <div className="pl-5 space-y-1">
                    {PM25_LEGEND.map(l => (
                      <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: l.color, opacity: 0.8 }} />
                        <span>{l.label}</span>
                        <span className="text-gray-400 ml-auto pl-2">{l.range}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full h-px bg-gray-100" />

              {/* Hotspot layer toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={showHotspots}
                    onChange={e => setShowHotspots(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary"
                  />
                  <span className="text-xs font-semibold text-text-main">จุดความร้อน VIIRS</span>
                </label>
                {showHotspots && (
                  <div className="pl-5 space-y-1">
                    {HOTSPOT_LEGEND.map(l => (
                      <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white shadow-sm" style={{ background: l.color }} />
                        <span>{l.label}</span>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-1.5 pt-1.5 border-t border-gray-100">
                      NASA FIRMS · อัปเดตรายวัน
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
