'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Search, PlayCircle, FileText, Users, Lightbulb } from 'lucide-react';

// JSON Mockup Data สำหรับบทความ (Long-form Journalism)
const articles = [
  {
    id: 1,
    title: 'ทำความเข้าใจปรากฏการณ์เอลนีโญกับผลกระทบต่อฝุ่นควันภาคเหนือ',
    author: 'ทีมวิจัย ทันฝุ่น ทันไฟ',
    date: '12 มี.ค. 2568',
    image: 'https://picsum.photos/seed/dust1/600/400',
    category: 'Long-form',
    type: 'longform'
  },
  {
    id: 2,
    title: 'เสียงจากชาวบ้าน: การจัดการไฟป่าในพื้นที่ชุมชน',
    author: 'นักข่าวพลเมือง C-Site',
    date: '10 มี.ค. 2568',
    image: 'https://picsum.photos/seed/dust2/600/400',
    category: 'C-Site',
    type: 'csite'
  },
  {
    id: 3,
    title: 'คู่มือการเลือกซื้อเครื่องฟอกอากาศให้เหมาะกับขนาดห้อง',
    author: 'Knowledge Hub',
    date: '8 มี.ค. 2568',
    image: 'https://picsum.photos/seed/dust3/600/400',
    category: 'ความรู้',
    type: 'knowledge'
  },
  {
    id: 4,
    title: 'สารคดีสั้น: ลมหายใจที่หายไปในฤดูฝุ่น',
    author: 'สื่อสร้างสรรค์',
    date: '5 มี.ค. 2568',
    image: 'https://picsum.photos/seed/dust4/600/400',
    category: 'วิดีโอ',
    type: 'media'
  }
];

export default function ContentHub() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(a => {
    const matchesTab = activeTab === 'all' || a.type === activeTab;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section className="py-16 px-4 bg-gray-50" id="content">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-text-main">แพลตฟอร์มสื่อสารและความรู้</h2>
            </div>
            <p className="text-text-muted">บทความเชิงลึก ข่าวสารจากพลเมือง และคลังความรู้เรื่อง PM 2.5</p>
          </div>
          
          {/* Search Bar - ระบบค้นหา */}
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="สืบค้นข้อมูล..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 hide-scrollbar">
          <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-text-main text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}>ทั้งหมด</button>
          <button onClick={() => setActiveTab('longform')} className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'longform' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}><FileText className="w-4 h-4"/> Long-form</button>
          <button onClick={() => setActiveTab('csite')} className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'csite' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}><Users className="w-4 h-4"/> C-Site (พลเมือง)</button>
          <button onClick={() => setActiveTab('knowledge')} className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'knowledge' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}><Lightbulb className="w-4 h-4"/> คลังความรู้</button>
          <button onClick={() => setActiveTab('media')} className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'media' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}><PlayCircle className="w-4 h-4"/> สื่อสร้างสรรค์</button>
        </div>

        {/* Articles Grid - แสดงรายการบทความล่าสุดในรูปแบบ Card */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link href={`/article/${article.id}`} key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer flex flex-col">
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={article.image} 
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary flex items-center gap-1">
                    {article.type === 'media' && <PlayCircle className="w-3 h-3" />}
                    {article.category}
                  </div>
                </div>
                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-text-main mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-sm text-text-muted pt-4 border-t border-gray-100">
                    <span className="font-medium">{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">ไม่พบเนื้อหาที่ค้นหา</h3>
            <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่อีกครั้ง</p>
          </div>
        )}
        
        {/* View All Button */}
        <div className="mt-10 text-center">
          <button className="text-primary font-semibold hover:underline">
            ดูเนื้อหาทั้งหมด &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
