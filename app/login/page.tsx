'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/AuthContext';
import { Shield, Database, Download, Users } from 'lucide-react';

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // If already logged in, redirect to data portal
  useEffect(() => {
    if (!loading && user) {
      router.replace('/data-portal');
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // onAuthStateChanged will set user → useEffect redirects
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        // User closed the popup — no error to show
      } else {
        setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="animate-pulse text-text-muted">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-light">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4 py-10 sm:py-16">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left — Value Proposition */}
          <div className="hidden lg:block space-y-8 pr-8">
            <div>
              <h1 className="text-4xl font-bold text-text-main mb-4 leading-tight">
                เข้าถึงข้อมูล<br />เพื่อสู้วิกฤตฝุ่นควัน
              </h1>
              <p className="text-lg text-text-muted leading-relaxed">
                เข้าสู่ระบบเพื่อเข้าถึงคลังข้อมูลเปิดด้าน PM 2.5
                จุดความร้อน และคุณภาพอากาศ
                สำหรับใช้ในการวิจัย วิเคราะห์ และรายงานข่าว
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Database, title: 'คลังข้อมูลเปิด', desc: 'ข้อมูล PM2.5, Hotspot, คุณภาพอากาศรายจังหวัด' },
                { icon: Download, title: 'ดาวน์โหลดได้ทันที', desc: 'ไฟล์ CSV, GeoJSON พร้อมใช้วิเคราะห์' },
                { icon: Users, title: 'สำหรับทุกคน', desc: 'นักวิจัย สื่อมวลชน ภาคประชาสังคม และประชาชน' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main text-sm">{item.title}</h3>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login Card */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full mx-auto">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold mx-auto mb-4">
                <Image src="/logos/logo.svg" alt="Logo" width={40} height={40} className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-text-main">เข้าสู่ระบบ</h2>
              <p className="text-text-muted mt-2 text-sm">เพื่อเข้าถึงคลังข้อมูลและดาวน์โหลดชุดข้อมูล</p>
            </div>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-primary hover:bg-gray-50 text-text-main font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {signingIn ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {signingIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-text-muted">
                เราใช้ Google Authentication ในการยืนยันตัวตน โดยไม่เก็บรหัสผ่านของคุณ
              </p>
            </div>

            {/* Mobile-only value proposition */}
            <div className="lg:hidden mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-text-muted text-center mb-4">
                เข้าถึงคลังข้อมูลเปิดด้าน PM 2.5 เพื่อการวิจัยและรายงานข่าว
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: Database, label: 'ข้อมูลเปิด' },
                  { icon: Download, label: 'ดาวน์โหลด' },
                  { icon: Users, label: 'ทุกคนเข้าถึง' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5 p-2">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs text-text-muted font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
