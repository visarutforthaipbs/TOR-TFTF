import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4 text-xl">
              ท
            </div>
            <h1 className="text-2xl font-bold text-text-main">เข้าสู่ระบบ</h1>
            <p className="text-text-muted mt-2">เพื่อเข้าถึงระบบจัดการและรายงานข้อมูล</p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                <span className="text-gray-600">จดจำฉันไว้</span>
              </label>
              <a href="#" className="text-primary hover:underline">ลืมรหัสผ่าน?</a>
            </div>
            
            <button 
              type="button"
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors mt-6"
            >
              เข้าสู่ระบบ
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            ยังไม่มีบัญชี? <a href="#" className="text-primary font-medium hover:underline">สมัครสมาชิก</a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
