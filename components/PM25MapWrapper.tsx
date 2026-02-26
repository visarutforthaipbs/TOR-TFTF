'use client';

import dynamic from 'next/dynamic';
import { RefreshCw } from 'lucide-react';
import PM25ImpactPanel from './PM25ImpactPanel';
import type { Pm25Province } from './PM25ProvinceMap';
import type { PM25ImpactRow } from './PM25ImpactPanel';

// Leaflet must only run client-side — wrap the dynamic import in a Client Component
const PM25ProvinceMap = dynamic(() => import('./PM25ProvinceMap'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-text-muted">กำลังโหลดแผนที่...</p>
      </div>
    </div>
  ),
});

interface Props {
  initialData: Pm25Province[];
  lastUpdated: string;
  impactData?: PM25ImpactRow[];
}

export default function PM25MapWrapper({ initialData, lastUpdated, impactData }: Props) {
  return (
    <div className="relative h-full w-full">
      <PM25ProvinceMap initialData={initialData} lastUpdated={lastUpdated} />
      {impactData && impactData.length > 0 && <PM25ImpactPanel data={impactData} />}
    </div>
  );
}

