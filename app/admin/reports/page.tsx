import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function AdminReports() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-main">จัดการรายงาน C-Site</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium shadow-sm">รอดำเนินการ (12)</button>
          <button className="px-4 py-2 text-text-muted hover:bg-bg-light rounded-lg text-sm font-medium transition-colors">อนุมัติแล้ว</button>
          <button className="px-4 py-2 text-text-muted hover:bg-bg-light rounded-lg text-sm font-medium transition-colors">ปฏิเสธ</button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-text-muted text-sm bg-white">
              <th className="py-4 px-6 font-medium">รายละเอียด</th>
              <th className="py-4 px-6 font-medium">สถานที่</th>
              <th className="py-4 px-6 font-medium">ผู้รายงาน</th>
              <th className="py-4 px-6 font-medium">เวลา</th>
              <th className="py-4 px-6 font-medium text-right">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, desc: 'พบกลุ่มควันไฟป่าบริเวณเชิงเขา...', loc: 'อ.แม่ริม', user: 'สมชาย ใจดี', time: '10 นาทีที่แล้ว' },
              { id: 2, desc: 'ค่าฝุ่นสูงผิดปกติในหมู่บ้าน', loc: 'อ.หางดง', user: 'วิภาดา รักป่า', time: '1 ชั่วโมงที่แล้ว' },
              { id: 3, desc: 'มีคนลักลอบเผาขยะริมทาง', loc: 'อ.เมือง', user: 'ไม่ระบุตัวตน', time: '3 ชั่วโมงที่แล้ว' },
            ].map((report) => (
              <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-medium text-text-main max-w-xs truncate">{report.desc}</td>
                <td className="py-4 px-6 text-text-muted">{report.loc}</td>
                <td className="py-4 px-6 text-text-muted">{report.user}</td>
                <td className="py-4 px-6 text-text-muted">{report.time}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-text-muted hover:bg-bg-light rounded-lg transition-colors" title="ดูรายละเอียด">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="อนุมัติ">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ปฏิเสธ">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
