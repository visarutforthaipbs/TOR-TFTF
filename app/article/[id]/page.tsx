import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Share2, MessageCircle, ThumbsUp, Calendar, User } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // In a real app, fetch article data from API/DB here
  const title = 'ทำความเข้าใจปรากฏการณ์เอลนีโญกับผลกระทบต่อฝุ่นควันภาคเหนือ';
  const description =
    'ปรากฏการณ์เอลนีโญ ไม่ได้ส่งผลแค่เรื่องความแห้งแล้ง แต่ยังเป็นตัวแปรสำคัญที่ทำให้สถานการณ์ฝุ่นควัน PM 2.5 ในภาคเหนือทวีความรุนแรง';

  return {
    title,
    description,
    alternates: { canonical: `/article/${id}` },
    openGraph: {
      title: `${title} | ทันฝุ่น ทันไฟ`,
      description,
      url: `/article/${id}`,
      type: 'article',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(title)}`],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Article Header (Hero Image) */}
        <div className="relative w-full h-[40vh] md:h-[60vh] bg-gray-900">
          <Image 
            src={`https://picsum.photos/seed/dust${id}/1920/1080`}
            alt="Article Cover"
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto max-w-4xl px-4 pb-12">
              <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                Long-form Interactive Journalism
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                ทำความเข้าใจปรากฏการณ์เอลนีโญกับผลกระทบต่อฝุ่นควันภาคเหนือ
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-200 text-sm">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> ทีมวิจัย ทันฝุ่น ทันไฟ</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 12 มีนาคม 2568</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="container mx-auto max-w-3xl px-4 py-12">
          {/* Social Share Bar */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                <ThumbsUp className="w-5 h-5" /> <span className="text-sm font-medium">124</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" /> <span className="text-sm font-medium">18</span>
              </button>
            </div>
            <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" /> <span className="text-sm font-medium">แชร์</span>
            </button>
          </div>

          {/* Typography Content */}
          <article className="prose prose-lg prose-orange max-w-none">
            <p className="lead text-xl text-gray-600 font-medium mb-8">
              ปรากฏการณ์เอลนีโญ (El Niño) ไม่ได้ส่งผลแค่เรื่องความแห้งแล้ง แต่ยังเป็นตัวแปรสำคัญที่ทำให้สถานการณ์ฝุ่นควัน PM 2.5 ในภาคเหนือของประเทศไทยทวีความรุนแรงขึ้นอย่างมีนัยสำคัญ
            </p>
            
            <h2 className="text-2xl font-bold text-text-main mt-8 mb-4">เอลนีโญคืออะไร?</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              เอลนีโญ เป็นปรากฏการณ์ทางธรรมชาติที่เกิดจากความผิดปกติของอุณหภูมิผิวน้ำทะเลในมหาสมุทรแปซิฟิก...
              (เนื้อหาจำลองสำหรับการแสดงผล Long-form Interactive Journalism)
            </p>

            {/* Interactive Element Mockup (Video/Chart) */}
            <div className="my-10 bg-gray-100 rounded-2xl p-8 text-center border border-gray-200">
              <h3 className="text-lg font-bold text-text-main mb-2">Interactive Data Visualization</h3>
              <p className="text-gray-500 mb-4">ส่วนแสดงผลกราฟิกแบบโต้ตอบ (Interactive Chart) หรือวิดีโอสารคดี</p>
              <div className="w-full h-64 bg-white rounded-xl shadow-inner flex items-center justify-center">
                <span className="text-gray-400">[ Interactive Element Placeholder ]</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-text-main mt-8 mb-4">การรับมือของภาคประชาชน</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              เครือข่าย Active Citizen ในพื้นที่จังหวัดเชียงใหม่ได้เริ่มสร้างแนวกันไฟและเฝ้าระวัง...
            </p>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
