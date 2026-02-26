'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, ExternalLink } from 'lucide-react';

// Same CSV parser as ContentHub — parse from public CSV
interface Article {
  id: number;
  mediaType: string;
  category: string;
  title: string;
  thumbnail: string;
  link: string;
}

function parseCsv(text: string): Article[] {
  const rawLines = text.split('\n');
  const mergedLines: string[] = [];
  let buffer = '';
  for (const line of rawLines) {
    buffer = buffer ? buffer + '\n' + line : line;
    const quoteCount = (buffer.match(/"/g) || []).length;
    if (quoteCount % 2 === 0) { mergedLines.push(buffer); buffer = ''; }
  }
  if (buffer) mergedLines.push(buffer);

  return mergedLines.slice(1).filter(l => l.trim()).map(line => {
    const positions: number[] = [];
    for (const m of [',https://', ',http://']) {
      let from = 0;
      while (true) { const idx = line.indexOf(m, from); if (idx === -1) break; positions.push(idx); from = idx + 1; }
    }
    positions.sort((a, b) => a - b);
    if (positions.length < 2) return null;
    const linkStart = positions[positions.length - 1];
    const thumbStart = positions[positions.length - 2];
    const link = line.slice(linkStart + 1).trim();
    const thumbnail = line.slice(thumbStart + 1, linkStart).trim();
    const before = line.slice(0, thumbStart);
    const c1 = before.indexOf(','), c2 = before.indexOf(',', c1 + 1), c3 = before.indexOf(',', c2 + 1);
    if (c1 < 0 || c2 < 0 || c3 < 0) return null;
    const id = parseInt(before.slice(0, c1));
    const mediaType = before.slice(c1 + 1, c2).trim();
    const category = before.slice(c2 + 1, c3).trim();
    let title = before.slice(c3 + 1).trim();
    if (title.startsWith('"') && title.endsWith('"')) title = title.slice(1, -1);
    title = title.replace(/""/g, '"').replace(/\n/g, ' ').trim();
    if (!title || !link) return null;
    return { id, mediaType, category, title, thumbnail, link };
  }).filter(Boolean) as Article[];
}

export default function LatestContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/datas/news-thaipbs.csv')
      .then(r => r.text())
      .then(text => { setArticles(parseCsv(text).slice(0, 3)); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || articles.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <h2 className="text-xl sm:text-3xl font-bold text-text-main">สื่อสารและความรู้ล่าสุด</h2>
          </div>
          <Link href="/contents" className="text-primary font-semibold flex items-center gap-1 hover:underline text-sm sm:text-base">
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <a
              href={article.link}
              key={article.id}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                  {article.mediaType}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-text-main mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <div className="mt-auto flex items-center justify-between text-sm text-text-muted pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 text-xs font-medium text-gray-600">
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
      </div>
    </section>
  );
}
