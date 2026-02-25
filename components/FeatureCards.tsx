import { Map, CloudRain, Users } from 'lucide-react';

export default function FeatureCards() {
  // Data for the 3 main feature cards
  const features = [
    {
      id: 1,
      title: 'ฝุ่นไฟใกล้ฉัน',
      description: 'แผนที่ PM 2.5 และจุดความร้อนแบบ Real-time',
      icon: <Map className="w-8 h-8 text-primary" />,
      color: 'bg-secondary' // Soft peach background for highlight
    },
    {
      id: 2,
      title: 'พยากรณ์ฝุ่นไฟ',
      description: 'ข้อมูลพยากรณ์คุณภาพอากาศล่วงหน้า',
      icon: <CloudRain className="w-8 h-8 text-primary" />,
      color: 'bg-white border border-gray-100'
    },
    {
      id: 3,
      title: 'พลเมืองจัดการฝุ่นไฟ',
      description: 'รายงานข่าวและสถานการณ์จากภาคพลเมือง',
      icon: <Users className="w-8 h-8 text-primary" />,
      color: 'bg-white border border-gray-100'
    }
  ];

  return (
    // Negative margin top to overlap the Hero section slightly
    <section className="py-12 px-4 -mt-12 relative z-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            // Card container with rounded corners and shadow
            <div 
              key={feature.id} 
              className={`${feature.color} rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center`}
            >
              {/* Icon container */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-text-main">{feature.title}</h3>
              <p className="text-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
