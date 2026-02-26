import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-bg-light via-orange-50 via-40% to-primary/70 pt-12 sm:pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl flex flex-col items-center gap-6 sm:gap-8">
        {/* Partner Logos */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Image src="/logos/partners-1.svg" alt="Partner 1" width={120} height={40} className="h-8 sm:h-10 object-contain" style={{ width: 'auto' }} />
          <Image src="/logos/partners-2.svg" alt="Partner 2" width={120} height={40} className="h-8 sm:h-10 object-contain" style={{ width: 'auto' }} />
          <Image src="/logos/partners-3.svg" alt="Partner 3" width={120} height={40} className="h-8 sm:h-10 object-contain" style={{ width: 'auto' }} />
          <Image src="/logos/partners-4.svg" alt="Partner 4" width={120} height={40} className="h-8 sm:h-10 object-contain" style={{ width: 'auto' }} />
          <Image src="/logos/partners-5.svg" alt="Partner 5" width={120} height={40} className="h-8 sm:h-10 object-contain" style={{ width: 'auto' }} />
          <Image src="/logos/partners-6.svg" alt="Partner 6" width={120} height={40} className="h-8 sm:h-10 object-contain" style={{ width: 'auto' }} />
          <Image src="/logos/partners-7.svg" alt="Partner 7" width={120} height={40} className="h-8 sm:h-10 object-contain" style={{ width: 'auto' }} />
          <Image src="/logos/partners-8.svg" alt="Partner 8" width={120} height={40} className="h-8 sm:h-10 object-contain" style={{ width: 'auto' }} />
        </div>

        {/* Copyright & Contact */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8 text-white text-center">
          <span className="text-xs sm:text-sm">&copy; 2025 Public intelligence</span>
          <Link href="/contact" className="text-xs sm:text-sm font-medium hover:underline">ติดต่อเรา</Link>
        </div>
      </div>
    </footer>
  );
}
