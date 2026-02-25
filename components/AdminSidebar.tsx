import Link from 'next/link';
import { LayoutDashboard, FileText, Users, AlertTriangle, Settings, LogOut } from 'lucide-react';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-text-main text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            ท
          </div>
          <span className="text-xl font-bold text-primary">ทันฝุ่น ทันไฟ</span>
        </Link>
        <p className="text-xs text-gray-400 mt-2">ระบบจัดการหลังบ้าน (Admin)</p>
      </div>

      <nav className="flex-grow py-6 px-4 space-y-2">
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
          <LayoutDashboard className="w-5 h-5" />
          ภาพรวม (Dashboard)
        </Link>
        <Link href="/admin/articles" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
          <FileText className="w-5 h-5" />
          จัดการบทความ
        </Link>
        <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
          <AlertTriangle className="w-5 h-5" />
          รายงาน C-Site
        </Link>
        <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
          <Users className="w-5 h-5" />
          จัดการผู้ใช้งาน
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
          <Settings className="w-5 h-5" />
          ตั้งค่าระบบ
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/50 text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          ออกจากระบบ
        </Link>
      </div>
    </aside>
  );
}
