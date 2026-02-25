import Link from 'next/link';
import { Menu, User, PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    // Header container with sticky positioning
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            ท
          </div>
          <span className="text-xl font-bold text-primary">ทันฝุ่น ทันไฟ</span>
        </Link>
        
        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#dashboard" className="text-text-muted hover:text-primary transition-colors font-medium">แดชบอร์ด</Link>
          <Link href="#content" className="text-text-muted hover:text-primary transition-colors font-medium">คลังความรู้</Link>
          
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          
          {/* C-Site Citizen Report Button */}
          <Link href="/report" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium">
            <PlusCircle className="w-4 h-4" />
            รายงานสถานการณ์
          </Link>
          
          {/* User Management / Login */}
          <Link href="/login" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-text-main px-4 py-2 rounded-full transition-colors font-medium text-sm">
            <User className="w-4 h-4" />
            เข้าสู่ระบบ
          </Link>
        </nav>

        {/* Mobile Menu Button (Hamburger) */}
        <button className="md:hidden p-2 text-text-muted hover:text-primary">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
