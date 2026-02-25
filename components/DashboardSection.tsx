'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Map as MapIcon, BarChart2, Table as TableIcon, RefreshCw } from 'lucide-react';

// Dynamic import for Leaflet Map to avoid SSR issues
const MapComponent = dynamic(() => import('./Map'), { 
  ssr: false, 
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100"><p className="text-gray-500 animate-pulse">กำลังโหลดแผนที่...</p></div> 
});

export default function DashboardSection() {
  const [activeTab, setActiveTab] = useState<'map' | 'chart' | 'table'>('map');
  const [pmData, setPmData] = useState<any[]>([]);
  const [currentAQI, setCurrentAQI] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('--:--');

  // Fetch real data from Open-Meteo Air Quality API for Chiang Mai
  const fetchRealData = async () => {
    setLoading(true);
    try {
      // Chiang Mai coordinates: 18.7883, 98.9853
      const res = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=18.7883&longitude=98.9853&current=pm2_5&hourly=pm2_5&timezone=Asia%2FBangkok&past_days=1');
      const data = await res.json();
      
      if (data && data.hourly) {
        // Get the last 24 hours of data
        const times = data.hourly.time.slice(-24);
        const pm25s = data.hourly.pm2_5.slice(-24);
        
        const formattedData = times.map((t: string, index: number) => {
          const date = new Date(t);
          return {
            time: `${date.getHours().toString().padStart(2, '0')}:00`,
            pm25: pm25s[index],
            location: 'อ.เมือง เชียงใหม่'
          };
        });
        
        setPmData(formattedData);
        setCurrentAQI(data.current.pm2_5);
      }
    } catch (error) {
      console.error("Failed to fetch air quality data:", error);
      // Fallback to mockup if API fails
      const mockData = [];
      let currentHour = new Date().getHours();
      for (let i = 23; i >= 0; i--) {
        let h = currentHour - i;
        if (h < 0) h += 24;
        mockData.push({
          time: `${h.toString().padStart(2, '0')}:00`,
          pm25: Math.floor(Math.random() * 100) + 20,
          location: 'อ.เมือง'
        });
      }
      setPmData(mockData);
      setCurrentAQI(85);
    } finally {
      setLoading(false);
      setLastUpdated(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const getHealthStatus = (pm25: number) => {
    if (pm25 > 100) return { label: 'มีผลกระทบต่อสุขภาพ', color: 'text-red-700', bg: 'bg-red-100', bar: 'bg-red-500', border: 'border-red-200' };
    if (pm25 > 50) return { label: 'เริ่มมีผลกระทบต่อสุขภาพ', color: 'text-orange-700', bg: 'bg-orange-50', bar: 'bg-orange-500', border: 'border-orange-200' };
    if (pm25 > 25) return { label: 'คุณภาพอากาศปานกลาง', color: 'text-yellow-700', bg: 'bg-yellow-50', bar: 'bg-yellow-500', border: 'border-yellow-200' };
    return { label: 'คุณภาพอากาศดี', color: 'text-green-700', bg: 'bg-green-50', bar: 'bg-green-500', border: 'border-green-200' };
  };

  const status = getHealthStatus(currentAQI);
  // Calculate percentage for progress bar (max 200 for visual scale)
  const progressPercent = Math.min((currentAQI / 200) * 100, 100);

  return (
    <section className="py-12 px-4 bg-white" id="dashboard">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <MapIcon className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-text-main">ฝุ่นไฟใกล้ฉัน (Dashboard)</h2>
            {loading && <RefreshCw className="w-5 h-5 text-gray-400 animate-spin ml-2" />}
          </div>
          
          {/* View Toggles */}
          <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-auto">
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'map' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-primary'}`}
            >
              <MapIcon className="w-4 h-4" /> แผนที่
            </button>
            <button 
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'chart' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-primary'}`}
            >
              <BarChart2 className="w-4 h-4" /> กราฟ
            </button>
            <button 
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'table' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-primary'}`}
            >
              <TableIcon className="w-4 h-4" /> ตาราง
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualization Area */}
          <div className="lg:col-span-2 bg-gray-50 rounded-2xl h-[450px] flex flex-col items-center justify-center relative border border-gray-200 shadow-inner overflow-hidden">
            {activeTab === 'map' && <MapComponent />}
            
            {activeTab === 'chart' && (
              <div className="w-full h-full p-6 bg-white">
                <h3 className="font-bold text-text-main mb-4">แนวโน้มค่าฝุ่น PM 2.5 (รายชั่วโมง)</h3>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={pmData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
                    <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="pm25" fill="#F26522" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {activeTab === 'table' && (
              <div className="w-full h-full p-6 bg-white overflow-auto">
                <h3 className="font-bold text-text-main mb-4">ตารางข้อมูลค่าฝุ่น PM 2.5</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-sm">
                      <th className="py-3 px-4 font-medium">เวลา</th>
                      <th className="py-3 px-4 font-medium">สถานที่</th>
                      <th className="py-3 px-4 font-medium">ค่า PM 2.5 (µg/m³)</th>
                      <th className="py-3 px-4 font-medium">ระดับสุขภาพ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pmData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{row.time}</td>
                        <td className="py-3 px-4">{row.location}</td>
                        <td className="py-3 px-4 font-mono">{row.pm25}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.pm25 > 100 ? 'bg-red-100 text-red-700' : 
                            row.pm25 > 50 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {row.pm25 > 100 ? 'มีผลกระทบ' : row.pm25 > 50 ? 'เริ่มมีผลกระทบ' : 'คุณภาพดี'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Data Visualization & Health Advisory Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Health Advisory Card - แถบสีแจ้งเตือนระดับสุขภาพ */}
            <div className={`${status.bg} border ${status.border} rounded-2xl p-6 shadow-sm transition-colors duration-500`}>
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className={`w-6 h-6 ${status.color} flex-shrink-0`} />
                <div>
                  <h3 className={`font-bold ${status.color} text-lg`}>{status.label}</h3>
                  <p className={`${status.color} opacity-80 text-sm`}>ค่า PM 2.5 ปัจจุบัน: {currentAQI} µg/m³</p>
                </div>
              </div>
              {/* Progress bar แสดงระดับค่าฝุ่น */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                <div className={`${status.bar} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>200+</span>
              </div>
              <p className={`text-sm ${status.color} bg-white/60 p-3 rounded-lg border ${status.border}`}>
                <strong>คำแนะนำ:</strong> {currentAQI > 50 ? 'ควรลดระยะเวลาการทำกิจกรรมกลางแจ้ง หรือใช้อุปกรณ์ป้องกันตนเองหากมีความจำเป็น' : 'สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm text-center">
                <p className="text-gray-500 text-sm mb-1">จุดความร้อน (Hotspot)</p>
                <p className="text-2xl font-bold text-red-500">24 จุด</p>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm text-center">
                <p className="text-gray-500 text-sm mb-1">อัปเดตล่าสุด</p>
                <p className="text-lg font-bold text-gray-700 mt-1">
                  {lastUpdated} น.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
