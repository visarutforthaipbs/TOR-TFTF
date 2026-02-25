export default function Hero() {
  return (
    // Hero section with vibrant orange primary background
    <section className="bg-primary text-white py-20 px-4 relative overflow-hidden">
      {/* Background decorative elements for modern look */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          รับมือวิกฤตฝุ่นควัน<br />ด้วยพลังพลเมืองตื่นรู้
        </h1>
        {/* Subheadline / Slogan */}
        <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          แพลตฟอร์มรวบรวมข้อมูล ข่าวสาร และเครื่องมือจัดการปัญหา PM 2.5 ในเชียงใหม่ เพื่อคุณภาพชีวิตที่ดีกว่า
        </p>
        {/* Call to Action Button */}
        <button className="bg-white text-primary font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-secondary transition-colors duration-300">
          ดูสถานการณ์ฝุ่นวันนี้
        </button>
      </div>
    </section>
  );
}
