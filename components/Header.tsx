'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, User, PlusCircle, Database, LogOut, X, Shield } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Header() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/new-logo-favicon.svg" alt="ทันฝุ่น ทันไฟ" width={73} height={61} className="h-10 w-auto" priority />
        </Link>
        
        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-text-muted hover:text-primary transition-colors font-medium">แดชบอร์ด</Link>
          <Link href="/forecast" className="text-text-muted hover:text-primary transition-colors font-medium">พยากรณ์</Link>
          <Link href="/contents" className="text-text-muted hover:text-primary transition-colors font-medium">คลังความรู้</Link>
          <Link href="/contact" className="text-text-muted hover:text-primary transition-colors font-medium">ติดต่อเรา</Link>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          {/* C-Site Citizen Report Button */}
          <Link href="https://legacy.csitereport.com/pm25noclus" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium">
            <PlusCircle className="w-4 h-4" />
            รายงานสถานการณ์
          </Link>
          
          {/* Auth State */}
          {loading ? (
            <div className="w-20 h-9 bg-gray-100 rounded-full animate-pulse" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border-2 border-primary/30" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-text-main max-w-[100px] truncate hidden lg:inline">
                  {user.displayName?.split(' ')[0]}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-text-main truncate">{user.displayName}</p>
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 bg-yellow-100 text-yellow-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <Shield className="w-2.5 h-2.5" />
                        ผู้ดูแลระบบ
                      </span>
                    )}
                  </div>
                  <Link
                    href="/data-portal"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-main hover:bg-gray-50 transition-colors"
                  >
                    <Database className="w-4 h-4 text-primary" />
                    คลังข้อมูล
                  </Link>
                  <button
                    onClick={() => { signOut(); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-text-main px-4 py-2 rounded-full transition-colors font-medium text-sm">
              <User className="w-4 h-4" />
              เข้าสู่ระบบ
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileOpen(prev => !prev)} className="md:hidden p-2 text-text-muted hover:text-primary">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col p-4 gap-1">
            {[
              { href: '/dashboard', label: 'แดชบอร์ด' },
              { href: '/forecast', label: 'พยากรณ์' },
              { href: '/contents', label: 'คลังความรู้' },
              { href: '/contact', label: 'ติดต่อเรา' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-text-muted hover:text-primary hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="https://legacy.csitereport.com/pm25noclus"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-primary hover:bg-primary/5 px-3 py-2.5 rounded-lg transition-colors font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              รายงานสถานการณ์
            </Link>
            <div className="h-px bg-gray-100 my-2" />
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-semibold text-text-main">{user.displayName}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/data-portal"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-text-main hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-colors font-medium"
                >
                  <Database className="w-4 h-4 text-primary" />
                  คลังข้อมูล
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg transition-colors font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-text-main px-4 py-2.5 rounded-lg transition-colors font-medium text-sm justify-center"
              >
                <User className="w-4 h-4" />
                เข้าสู่ระบบ
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
