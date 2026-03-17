import Link from 'next/link';
import { Map, CloudRain, Users, ArrowRight } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    {
      id: 1,
      title: 'ฝุ่นไฟใกล้ฉัน',
      description: 'แผนที่ PM 2.5 และจุดความร้อนแบบ Real-time ดูข้อมูลรายจังหวัดทั่วประเทศ',
      icon: <Map className="w-7 h-7" />,
      tag: 'Real-time',
      href: '/dashboard',
      featured: true,
    },
    {
      id: 2,
      title: 'พยากรณ์ฝุ่นไฟ',
      description: 'ข้อมูลพยากรณ์คุณภาพอากาศล่วงหน้า วางแผนกิจกรรมอย่างมั่นใจ',
      icon: <CloudRain className="w-7 h-7" />,
      tag: 'Forecast',
      href: '/forecast',
      featured: false,
    },
    {
      id: 3,
      title: 'พลเมืองจัดการฝุ่นไฟ',
      description: 'รายงานข่าวและสถานการณ์จากภาคพลเมือง ร่วมเป็นเครือข่ายเฝ้าระวัง',
      icon: <Users className="w-7 h-7" />,
      tag: 'Community',
      href: 'https://legacy.csitereport.com/pm25noclus',
      featured: false,
    },
  ];

  return (
    <section className="pt-16 pb-16 px-4 relative z-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              href={feature.href}
              key={feature.id}
              target={feature.href.startsWith('http') ? '_blank' : undefined}
              rel={feature.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`group relative rounded-2xl p-6 shadow-md ring-2 ring-transparent hover:ring-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden ${
                feature.featured
                  ? 'bg-secondary border border-primary/10'
                  : 'bg-white border border-gray-100'
              }`}
            >
              {/* Decorative blob */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none transition-transform duration-500 group-hover:scale-150" />

              {/* Top row: icon + tag */}
              <div className="flex items-start justify-between mb-5 relative">
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary text-primary">
                  {feature.tag}
                </span>
              </div>

              {/* Text content */}
              <h3 className="text-xl font-bold mb-2 text-text-main relative">{feature.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed relative flex-1">{feature.description}</p>

              {/* Bottom action hint */}
              <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary relative">
                <span className="group-hover:underline underline-offset-2">ดูรายละเอียด</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
