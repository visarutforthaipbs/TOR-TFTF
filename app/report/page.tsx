'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Camera, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to save report
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-primary p-6 text-white text-center">
              <h1 className="text-2xl font-bold mb-2">รายงานสถานการณ์ฝุ่นไฟ (C-Site)</h1>
              <p className="opacity-90">ร่วมเป็นส่วนหนึ่งในการเฝ้าระวังและแจ้งเหตุในพื้นที่ของคุณ</p>
            </div>
            
            {isSuccess ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-2">ส่งรายงานสำเร็จ!</h2>
                <p className="text-gray-500 mb-8">ขอบคุณที่ร่วมเป็นส่วนหนึ่งในการเฝ้าระวังปัญหาฝุ่นควัน ข้อมูลของคุณจะถูกส่งไปยังหน่วยงานที่เกี่ยวข้อง</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  รายงานเหตุการณ์อื่นเพิ่ม
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">รูปภาพประกอบ</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <Camera className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-primary font-medium">คลิกเพื่ออัปโหลดรูปภาพ</p>
                    <p className="text-xs text-gray-500 mt-1">รองรับ JPG, PNG ขนาดไม่เกิน 5MB</p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">สถานที่เกิดเหตุ <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                      placeholder="ระบุสถานที่ หรือกดปุ่มหมุดเพื่อใช้ตำแหน่งปัจจุบัน"
                    />
                    <button type="button" className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                      <MapPin className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">รายละเอียดสถานการณ์ <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={4}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="อธิบายสิ่งที่พบเห็น เช่น พบกลุ่มควันไฟป่าบริเวณเชิงเขา..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">กำลังส่งข้อมูล...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      ส่งรายงาน
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
