import { Users, FileText, AlertTriangle, Eye } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-main mb-8">ภาพรวมระบบ (Dashboard)</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">บทความทั้งหมด</p>
            <p className="text-2xl font-bold text-text-main">124</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">รายงาน C-Site รอดำเนินการ</p>
            <p className="text-2xl font-bold text-text-main">12</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">ผู้ใช้งานระบบ</p>
            <p className="text-2xl font-bold text-text-main">1,450</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">ยอดเข้าชมวันนี้</p>
            <p className="text-2xl font-bold text-text-main">3,200</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-text-main mb-6">กิจกรรมล่าสุด</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-text-main">มีรายงานสถานการณ์ใหม่จาก C-Site (อ.แม่ริม)</p>
                  <p className="text-sm text-gray-500">โดย สมชาย ใจดี • 10 นาทีที่แล้ว</p>
                </div>
              </div>
              <button className="text-primary text-sm font-medium hover:underline">ตรวจสอบ</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
