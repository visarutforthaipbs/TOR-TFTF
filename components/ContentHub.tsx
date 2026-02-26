'use client';

import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Search, PlayCircle, FileText, Tv, Film, MessageSquare, ExternalLink, RefreshCw, ChevronDown } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Article {
  id: number;
  mediaType: string;
  category: string;
  title: string;
  thumbnail: string;
  link: string;
}

// ── CSV Parser ───────────────────────────────────────────────────────────────
// Handles multiline quoted fields and URL-based column detection
function parseCsv(text: string): Article[] {
  const rawLines = text.split('\n');
  const mergedLines: string[] = [];
  let buffer = '';

  for (const line of rawLines) {
    buffer = buffer ? buffer + '\n' + line : line;
    const quoteCount = (buffer.match(/"/g) || []).length;
    if (quoteCount % 2 === 0) {
      mergedLines.push(buffer);
      buffer = '';
    }
  }
  if (buffer) mergedLines.push(buffer);

  const dataLines = mergedLines.slice(1).filter(l => l.trim());

  return dataLines
    .map(line => {
      // Find ,https:// and ,http:// boundaries to split thumbnail + link
      const positions: number[] = [];
      for (const m of [',https://', ',http://']) {
        let from = 0;
        while (true) {
          const idx = line.indexOf(m, from);
          if (idx === -1) break;
          positions.push(idx);
          from = idx + 1;
        }
      }
      positions.sort((a, b) => a - b);
      if (positions.length < 2) return null;

      const linkStart = positions[positions.length - 1];
      const thumbStart = positions[positions.length - 2];

      const link = line.slice(linkStart + 1).trim();
      const thumbnail = line.slice(thumbStart + 1, linkStart).trim();
      const beforeUrls = line.slice(0, thumbStart);

      const c1 = beforeUrls.indexOf(',');
      const c2 = beforeUrls.indexOf(',', c1 + 1);
      const c3 = beforeUrls.indexOf(',', c2 + 1);
      if (c1 < 0 || c2 < 0 || c3 < 0) return null;

      const id = parseInt(beforeUrls.slice(0, c1));
      const mediaType = beforeUrls.slice(c1 + 1, c2).trim();
      const category = beforeUrls.slice(c2 + 1, c3).trim();
      let title = beforeUrls.slice(c3 + 1).trim();

      if (title.startsWith('"') && title.endsWith('"')) title = title.slice(1, -1);
      title = title.replace(/""/g, '"').replace(/\n/g, ' ').trim();
      if (!title || !link) return null;

      return { id, mediaType, category, title, thumbnail, link };
    })
    .filter(Boolean) as Article[];
}

// ── Media type icon mapping ──────────────────────────────────────────────────
const MEDIA_ICONS: Record<string, React.ReactNode> = {
  'สารคดี':           <Film className="w-4 h-4" />,
  'วีดีโอสั้น':        <PlayCircle className="w-4 h-4" />,
  'รายการทีวี':        <Tv className="w-4 h-4" />,
  'บทความ':           <FileText className="w-4 h-4" />,
  'สำรวจความเห็น':     <MessageSquare className="w-4 h-4" />,
};

// ── Main Component ───────────────────────────────────────────────────────────
export default function ContentHub() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaType, setActiveMediaType] = useState('ทั้งหมด');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    fetch('/datas/news-thaipbs.csv')
      .then(res => res.text())
      .then(text => {
        setArticles(parseCsv(text));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const mediaTypes = useMemo(
    () => ['ทั้งหมด', ...Array.from(new Set(articles.map(a => a.mediaType)))],
    [articles],
  );
  const categories = useMemo(
    () => ['ทั้งหมด', ...Array.from(new Set(articles.map(a => a.category)))],
    [articles],
  );

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchMedia = activeMediaType === 'ทั้งหมด' || a.mediaType === activeMediaType;
      const matchCat   = activeCategory === 'ทั้งหมด' || a.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.mediaType.toLowerCase().includes(q);
      return matchMedia && matchCat && matchSearch;
    });
  }, [articles, activeMediaType, activeCategory, searchQuery]);

  return (
    <section className="py-16 px-4 bg-bg-light" id="content">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <h2 className="text-xl sm:text-3xl font-bold text-text-main">แพลตฟอร์มสื่อสารและความรู้</h2>
            </div>
            <p className="text-text-muted">
              รวบรวมสื่อ สารคดี บทความ และรายงานข่าวพลเมืองเกี่ยวกับ PM 2.5 และไฟป่า
              <span className="ml-2 text-sm text-gray-400">({articles.length} ชิ้นงาน)</span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="สืบค้นข้อมูล..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Media Type Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-4 gap-2 hide-scrollbar">
          {mediaTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveMediaType(type)}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeMediaType === type
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-muted border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {MEDIA_ICONS[type]}
              {type}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {(showAllCategories ? categories : categories.slice(0, 5)).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'bg-white text-text-muted border border-gray-100 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
            {categories.length > 5 && (
              <button
                onClick={() => setShowAllCategories(v => !v)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-primary transition-colors"
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${showAllCategories ? 'rotate-180' : ''}`} />
                {showAllCategories ? 'แสดงน้อยลง' : `+${categories.length - 5} หมวดหมู่`}
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-text-muted">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* Article Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(article => (
              <a
                href={article.link}
                key={article.id}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Placeholder shown when image fails */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                    <div className="w-12 h-12 mb-2 opacity-40">
                      {MEDIA_ICONS[article.mediaType] || <FileText className="w-12 h-12" />}
                    </div>
                    <span className="text-xs text-gray-400 px-4 text-center line-clamp-2">{article.title}</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      const img = e.target as HTMLImageElement;
                      const src = img.src;
                      // YouTube maxresdefault fallback → hqdefault (always exists)
                      if (src.includes('img.youtube.com') && src.includes('maxresdefault')) {
                        img.src = src.replace('maxresdefault', 'hqdefault');
                        return;
                      }
                      // Hide broken image to reveal the placeholder underneath
                      img.style.display = 'none';
                    }}
                  />
                  {/* Media Type Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary flex items-center gap-1">
                    {MEDIA_ICONS[article.mediaType]}
                    {article.mediaType}
                  </div>
                  {/* External Link Icon */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-text-main mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-sm text-text-muted pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-light text-xs font-medium text-text-muted">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium">
                      ดูเพิ่มเติม <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-main mb-1">ไม่พบเนื้อหาที่ค้นหา</h3>
            <p className="text-text-muted">ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่อีกครั้ง</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && filtered.length > 0 && (
          <div className="mt-8 text-center text-sm text-text-muted">
            แสดง {filtered.length} จาก {articles.length} ชิ้นงาน
          </div>
        )}
      </div>
    </section>
  );
}
