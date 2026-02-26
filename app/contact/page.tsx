'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle form submission
    alert('ขอบคุณสำหรับข้อความของคุณ เราจะติดต่อกลับโดยเร็วที่สุด');
  };

  return (
    <main className="min-h-screen flex flex-col bg-bg-light">
      <Header />
      
      <div className="flex-grow py-10 sm:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold text-text-main mb-3 sm:mb-4">ติดต่อเรา</h1>
            <p className="text-sm sm:text-lg text-text-muted">หากคุณมีข้อสงสัย ข้อเสนอแนะ หรือต้องการความร่วมมือ สามารถติดต่อเราได้ตามช่องทางด้านล่าง</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-16">
            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-text-main mb-2">อีเมล</h3>
              <a href="mailto:thenorththaipbs@gmail.com" className="text-primary hover:underline">thenorththaipbs@gmail.com</a>
            </div>

            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-text-main mb-2">เบอร์โทรศัพท์</h3>
              <p className="text-text-muted">--</p>
            </div>

            <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-text-main mb-2">ที่อยู่</h3>
              <p className="text-text-muted">ภาคเหนือ ประเทศไทย</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-2 bg-primary p-6 sm:p-10 text-white flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-6">ส่งข้อความถึงเรา</h2>
                  <p className="opacity-90 leading-relaxed mb-8">
                    เรายินดีรับฟังทุกความคิดเห็นและข้อเสนอแนะ เพื่อร่วมเป็นส่วนหนึ่งในการแก้ไขปัญหาฝุ่นควันและไฟป่าในพื้นที่ภาคเหนือ
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 opacity-80" />
                    <span>thenorththaipbs@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 p-6 sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-text-main">ชื่อ-นามสกุล</label>
                      <input 
                        type="text" 
                        id="name" 
                        required
                        placeholder="กรอกชื่อของคุณ"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-text-main">อีเมล</label>
                      <input 
                        type="email" 
                        id="email" 
                        required
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-text-main">หัวข้อ</label>
                    <input 
                      type="text" 
                      id="subject" 
                      required
                      placeholder="ระบุหัวข้อที่ต้องการติดต่อ"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-text-main">ข้อความ</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      required
                      placeholder="พิมพ์ข้อความของคุณที่นี่..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <Send className="w-5 h-5" />
                    ส่งข้อความ
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
