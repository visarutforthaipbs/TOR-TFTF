'use client';

import { useState, useMemo } from 'react';
import { Search, X, ChevronRight, BarChart3, AlertTriangle, ShieldAlert, Eye, ShieldCheck } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
export interface PM25ImpactRow {
  province: string;
  y2024: number;
  y2025: number;
  total: number;
  impactLevel: string;  // Critical | Severe | Moderate | Safe
  impactText: string;   // full Thai text
}

// ── Impact-level styling ─────────────────────────────────────────────────────
const IMPACT_STYLES: Record<string, { color: string; bg: string; border: string; icon: typeof AlertTriangle; label: string }> = {
  Critical: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: AlertTriangle,  label: 'วิกฤตเรื้อรัง' },
  Severe:   { color: '#f97316', bg: '#fff7ed', border: '#fed7aa', icon: ShieldAlert,    label: 'อันตรายสูง' },
  Moderate: { color: '#eab308', bg: '#fefce8', border: '#fde68a', icon: Eye,            label: 'เฝ้าระวัง' },
  Safe:     { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', icon: ShieldCheck,    label: 'ปลอดภัย' },
};

function getImpactKey(raw: string): string {
  if (raw.includes('Critical')) return 'Critical';
  if (raw.includes('Severe'))   return 'Severe';
  if (raw.includes('Moderate')) return 'Moderate';
  return 'Safe';
}

// ── Bar component ────────────────────────────────────────────────────────────
function DayBar({ days, maxDays, color, year }: { days: number; maxDays: number; color: string; year: string }) {
  const pct = maxDays > 0 ? (days / maxDays) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-text-muted w-8 text-right flex-shrink-0">{year}</span>
      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color, minWidth: days > 0 ? 4 : 0 }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right flex-shrink-0" style={{ color }}>
        {days}
      </span>
    </div>
  );
}

// ── Province Row ─────────────────────────────────────────────────────────────
function ProvinceRow({ row, maxDays, rank }: { row: PM25ImpactRow; maxDays: number; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const impactKey = getImpactKey(row.impactLevel);
  const style = IMPACT_STYLES[impactKey] ?? IMPACT_STYLES.Safe;
  const Icon = style.icon;

  return (
    <div
      className="border rounded-xl overflow-hidden transition-colors"
      style={{ borderColor: expanded ? style.border : '#e5e7eb' }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full p-3 flex items-start gap-2.5 text-left hover:bg-gray-50/50 transition-colors"
      >
        {/* Rank badge */}
        <span className="text-[10px] font-bold text-text-muted bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
          {rank}
        </span>

        <div className="flex-1 min-w-0">
          {/* Province name + impact badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-bold text-sm text-text-main truncate">{row.province}</span>
            <span
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
              style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
            >
              <Icon className="w-2.5 h-2.5" />
              {style.label}
            </span>
          </div>

          {/* Bars */}
          <div className="space-y-1">
            <DayBar days={row.y2024} maxDays={maxDays} color="#F26522" year="2567" />
            <DayBar days={row.y2025} maxDays={maxDays} color="#3b82f6" year="2568" />
          </div>

          {/* Total */}
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] text-text-muted">รวม 2 ปี</span>
            <span className="text-xs font-bold text-text-main">{row.total} วัน</span>
          </div>
        </div>

        <ChevronRight
          className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t" style={{ borderColor: style.border }}>
          <p className="text-xs text-text-muted leading-relaxed mt-2">
            {row.impactText}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────────────────
interface Props {
  data: PM25ImpactRow[];
}

export default function PM25ImpactPanel({ data }: Props) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const maxDays = useMemo(() => Math.max(...data.map(d => Math.max(d.y2024, d.y2025))), [data]);

  const filtered = useMemo(() => {
    return data.filter(row => {
      const matchSearch = !search || row.province.includes(search);
      const matchFilter = !filter || getImpactKey(row.impactLevel) === filter;
      return matchSearch && matchFilter;
    });
  }, [data, search, filter]);

  // Count per category
  const counts = useMemo(() => {
    const c: Record<string, number> = { Critical: 0, Severe: 0, Moderate: 0, Safe: 0 };
    data.forEach(r => { c[getImpactKey(r.impactLevel)]++; });
    return c;
  }, [data]);

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute top-20 right-3 z-[1000] bg-white rounded-xl shadow-lg border border-gray-200 px-3 py-2.5 flex items-center gap-2 hover:shadow-xl transition-shadow"
        >
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-text-main hidden sm:inline">สถิติฝุ่นเกินมาตรฐาน</span>
        </button>
      )}

      {/* Panel */}
      <div
        className={`absolute top-0 right-0 z-[1000] h-full w-full sm:w-[380px] bg-white shadow-2xl border-l border-gray-200 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-sm font-bold text-text-main">จำนวนวันฝุ่นเกินมาตรฐาน</h2>
                <p className="text-[10px] text-text-muted">PM2.5 &gt; 37.5 µg/m³ (ปี พ.ศ. 2567-2568)</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาจังหวัด..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter(null)}
              className={`px-2 py-1 rounded-full text-[10px] font-medium transition-colors ${
                !filter ? 'bg-gray-800 text-white' : 'bg-gray-100 text-text-muted hover:bg-gray-200'
              }`}
            >
              ทั้งหมด ({data.length})
            </button>
            {Object.entries(IMPACT_STYLES).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setFilter(filter === key ? null : key)}
                className="px-2 py-1 rounded-full text-[10px] font-medium transition-colors flex items-center gap-1"
                style={
                  filter === key
                    ? { background: s.color, color: '#fff' }
                    : { background: s.bg, color: s.color, border: `1px solid ${s.border}` }
                }
              >
                {s.label} ({counts[key]})
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 mt-3 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1.5 rounded-full bg-[#F26522]" /> 2567 (2024)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1.5 rounded-full bg-[#3b82f6]" /> 2568 (2025)
            </span>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.map((row, i) => (
            <ProvinceRow
              key={row.province}
              row={row}
              maxDays={maxDays}
              rank={data.indexOf(row) + 1}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-text-muted text-sm py-8">ไม่พบจังหวัด</p>
          )}
        </div>
      </div>
    </>
  );
}
