import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative text-white py-16 sm:py-28 md:py-40 px-4 overflow-hidden">
      {/* Background Image */}
      <Image
        src="https://files-locals.thaipbs.or.th/prod//1/001_5680093082.jpg"
        alt="Hero background"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
        quality={90}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/20" />

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight drop-shadow-lg">
          รับมือวิกฤตฝุ่นควัน<br />ด้วยพลังพลเมืองตื่นรู้
        </h1>
        {/* Subheadline / Slogan */}
        <p className="text-sm sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto drop-shadow-md">
          แพลตฟอร์มรวบรวมข้อมูล ข่าวสาร และเครื่องมือจัดการปัญหา PM 2.5 ในเชียงใหม่ เพื่อคุณภาพชีวิตที่ดีกว่า
        </p>
        {/* Call to Action Button */}
        <Link href="/dashboard" className="inline-block bg-primary text-white font-semibold py-2.5 px-6 sm:py-3 sm:px-8 rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 text-sm sm:text-base">
          ดูสถานการณ์ฝุ่นวันนี้
        </Link>
      </div>
    </section>
  );
}
