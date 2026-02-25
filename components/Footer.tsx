export default function Footer() {
  return (
    // Simple footer with dark background
    <footer className="bg-text-main text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-bold mb-4">ทันฝุ่น ทันไฟ</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          โครงการการสร้างความร่วมมือและเครือข่ายการสื่อสารภาคประชาชน เพื่อพัฒนาการจัดการปัญหา PM 2.5 ในระดับพื้นที่จังหวัดเชียงใหม่อย่างยั่งยืน
        </p>
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ทันฝุ่น ทันไฟ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
