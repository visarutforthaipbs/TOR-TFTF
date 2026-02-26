'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Users, AlertTriangle, Settings, LogOut, Menu, X } from 'lucide-react';

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'ภาพรวม (Dashboard)' },
    { href: '/admin/articles', icon: FileText, label: 'จัดการบทความ' },
    { href: '/admin/reports', icon: AlertTriangle, label: 'รายงาน C-Site' },
    { href: '/admin/users', icon: Users, label: 'จัดการผู้ใช้งาน' },
    { href: '/admin/settings', icon: Settings, label: 'ตั้งค่าระบบ' },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-text-main h-14 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
            ท
          </div>
          <span className="text-lg font-bold text-primary">ทันฝุ่น ทันไฟ</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="p-2 text-gray-300 hover:text-white">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 w-64 bg-text-main text-white min-h-screen flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-700 hidden md:block">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              ท
            </div>
            <span className="text-xl font-bold text-primary">ทันฝุ่น ทันไฟ</span>
          </Link>
          <p className="text-xs text-gray-400 mt-2">ระบบจัดการหลังบ้าน (Admin)</p>
        </div>

        {/* Spacer for mobile to clear mobile top bar */}
        <div className="h-14 md:hidden flex-shrink-0" />

        <nav className="flex-grow py-6 px-4 space-y-2">
          {navLinks.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/50 text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            ออกจากระบบ
          </Link>
        </div>
      </aside>
    </>
  );
}
