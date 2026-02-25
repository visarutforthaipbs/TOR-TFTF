import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import DashboardSection from '@/components/DashboardSection';
import ContentHub from '@/components/ContentHub';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ส่วน Header */}
      <Header />
      
      {/* ส่วน Hero Section */}
      <Hero />
      
      {/* ส่วน Feature Cards (3 ใบ) */}
      <FeatureCards />
      
      {/* ส่วน Dashboard (ฝุ่นไฟใกล้ฉัน) */}
      <DashboardSection />
      
      {/* ส่วน Content Hub (ฝุ่นไฟวันนี้) */}
      <ContentHub />
      
      {/* ส่วน Footer */}
      <Footer />
    </main>
  );
}
