# เอกสารประกอบโครงการฉบับสมบูรณ์ (Final Project Documentation)
**โครงการ:** ทันฝุ่น ทันไฟ (TunFoon TunFai)  
**เว็บไซต์:** https://funfai.thaipbs.or.th  
**เวอร์ชัน:** 1.0  

---

## สารบัญ
1. [ภาพรวมโครงการ](#1-ภาพรวมโครงการ)
2. [Technology Stack](#2-technology-stack)
3. [โครงสร้างไดเรกทอรี](#3-โครงสร้างไดเรกทอรี)
4. [สถาปัตยกรรมระบบ](#4-สถาปัตยกรรมระบบ)
5. [Data Flow & แหล่งข้อมูล](#5-data-flow--แหล่งข้อมูล)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [หน้าและ Component](#7-หน้าและ-component)
8. [API Routes](#8-api-routes)
9. [Styling & Design System](#9-styling--design-system)
10. [SEO & Metadata](#10-seo--metadata)
11. [Deployment](#11-deployment)
12. [แผนพัฒนาในอนาคต](#12-แผนพัฒนาในอนาคต)

---

## 1. ภาพรวมโครงการ

"ทันฝุ่น ทันไฟ" (TunFoon TunFai) เป็นแพลตฟอร์มที่พัฒนาร่วมกับ Thai PBS เพื่อให้ประชาชนติดตามสถานการณ์ฝุ่น PM2.5 และจุดความร้อน (ไฟป่า) ในประเทศไทย โดยดึงข้อมูลจริงจากหลายแหล่ง ได้แก่ GISTDA, NASA FIRMS และ Thai PBS แล้วนำเสนอผ่าน:
- แผนที่เชิงโต้ตอบ (Interactive Choropleth Map)
- กราฟพยากรณ์รายชั่วโมง (Hourly Forecast Chart)
- คลังสื่อสารความรู้ (Content Hub)
- คลังข้อมูลเปิด (Open Data Portal)

---

## 2. Technology Stack

### 2.1 Core Framework
| เทคโนโลยี | เวอร์ชัน | บทบาท |
|:----------|:---------|:------|
| Next.js | 15 | App Router, SSR, ISR, API Routes |
| React | 19 | UI Component Library |
| TypeScript | 5.9 | Type Safety |

### 2.2 Styling
| เทคโนโลยี | เวอร์ชัน | บทบาท |
|:----------|:---------|:------|
| Tailwind CSS | v4 | Utility-first CSS |
| postcss-config (`@tailwindcss/postcss`) | — | PostCSS Plugin |

### 2.3 Backend & Database
| เทคโนโลยี | บทบาท |
|:----------|:------|
| Firebase Auth | Google OAuth (signInWithPopup) |
| Firebase Firestore | Database — Collections: `users`, `datasets` |
| Firestore Named Instance | `funfai-data-portal` |

### 2.4 Data Visualization
| เทคโนโลยี | บทบาท |
|:----------|:------|
| React-Leaflet + Leaflet | Interactive Map, GeoJSON Choropleth, Custom Markers |
| Recharts | Line Chart สำหรับ Forecast |

### 2.5 Icons & Fonts
| เทคโนโลยี | บทบาท |
|:----------|:------|
| Lucide React | Icon Library (ใช้ทั้งระบบ) |
| DB Helvethaica X | Custom Thai Font (Local, weights: 400/500/700) |

### 2.6 Dependencies (package.json)
```json
{
  "dependencies": {
    "next": "15.3.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "firebase": "^11.8.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^5.0.0",
    "recharts": "^2.15.3",
    "lucide-react": "^0.513.0",
    "@vercel/og": "^0.6.5"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "@tailwindcss/postcss": "^4.1.8",
    "tailwindcss": "^4.1.8",
    "@types/leaflet": "^1.9.18",
    "eslint": "^9",
    "eslint-config-next": "15.3.3",
    "@eslint/eslintrc": "^3"
  }
}
```

---

## 3. โครงสร้างไดเรกทอรี

```
TOR-TFTF/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root Layout (font, metadata, Providers, JsonLd)
│   ├── page.tsx                   # Landing Page (/, SSC)
│   ├── globals.css                # Tailwind CSS v4 imports + custom vars
│   ├── robots.ts                  # robots.txt generation
│   ├── sitemap.ts                 # sitemap.xml generation
│   ├── dashboard/
│   │   └── page.tsx               # PM2.5 Dashboard (SSR, data from GISTDA + CSV)
│   ├── forecast/
│   │   └── page.tsx               # Forecast Page wrapper
│   ├── contents/
│   │   └── page.tsx               # Content Hub wrapper
│   ├── contact/
│   │   ├── layout.tsx             # Contact layout (metadata)
│   │   └── page.tsx               # Contact Form (alert only)
│   ├── login/
│   │   ├── layout.tsx             # Login layout (metadata)
│   │   └── page.tsx               # Google OAuth Login
│   ├── data-portal/
│   │   ├── layout.tsx             # Data Portal layout (metadata)
│   │   ├── page.tsx               # Data Portal — CRUD (Firestore)
│   │   └── manage-users/
│   │       └── page.tsx           # User Management (Admin only)
│   ├── admin/
│   │   ├── layout.tsx             # Admin Layout (Sidebar)
│   │   ├── page.tsx               # Admin Dashboard (UI Mockup)
│   │   ├── articles/
│   │   │   └── page.tsx           # Article Management (UI Mockup)
│   │   └── reports/
│   │       └── page.tsx           # C-Site Reports (UI Mockup)
│   ├── article/
│   │   └── [id]/
│   │       └── page.tsx           # Single Article (Hardcoded content)
│   └── api/
│       ├── hotspots/
│       │   └── route.ts           # NASA FIRMS Proxy (VIIRS SNPP + NOAA-20)
│       ├── forecast/
│       │   └── route.ts           # GISTDA Forecast Proxy (In-memory cache)
│       └── og/
│           └── route.tsx          # Dynamic Open Graph Image Generator
├── components/
│   ├── Header.tsx                 # Navigation, Auth State, Mobile Menu
│   ├── Hero.tsx                   # Landing Hero Section
│   ├── FeatureCards.tsx           # 3 Feature Cards
│   ├── LatestContent.tsx          # Latest 3 Articles from CSV
│   ├── Footer.tsx                 # Partner Logos, Copyright
│   ├── PM25MapWrapper.tsx         # Dynamic Import Wrapper (ssr:false)
│   ├── PM25ProvinceMap.tsx        # Full Map Component (491 lines)
│   ├── PM25ImpactPanel.tsx        # Impact Stats Panel
│   ├── ForecastClient.tsx         # Forecast UI Component (557 lines)
│   ├── ContentHub.tsx             # Content Hub with CSV Parser
│   ├── AdminSidebar.tsx           # Admin Panel Sidebar
│   ├── Providers.tsx              # AuthProvider Wrapper
│   └── JsonLd.tsx                 # Structured Data Component
├── lib/
│   ├── firebase.ts                # Firebase Config + Firestore Instance
│   ├── AuthContext.tsx             # Auth Context + Google OAuth + Role Mgmt
│   └── datasets.ts                # Firestore CRUD + Default Datasets
├── public/
│   ├── datas/
│   │   ├── news-thaipbs.csv       # Thai PBS Articles Data (67+ records)
│   │   └── pm25_impact_meaning_all_provinces.csv  # PM2.5 Impact Data
│   ├── fonts/                     # DB Helvethaica X Font Files
│   ├── icon/                      # App Icons
│   └── logos/                     # Partner Logos (8 SVGs)
├── apphosting.yaml                # Firebase App Hosting Config
├── firebase.json                  # Firebase Project Config
├── firestore.rules                # Firestore Security Rules
├── firestore.indexes.json         # Firestore Indexes
├── next.config.ts                 # Next.js Config (image domains)
├── tsconfig.json                  # TypeScript Config
├── package.json                   # Dependencies
└── docs/                          # Project Documentation
```

---

## 4. สถาปัตยกรรมระบบ

### 4.1 Rendering Strategy
| หน้า | Strategy | หมายเหตุ |
|:-----|:---------|:---------|
| `/` Landing Page | SSC (Server Component) | Static, ไม่มี Data Fetching |
| `/dashboard` | SSR + ISR | Server fetch GISTDA + CSV, `revalidate: 3600` |
| `/forecast` | Client-side | ForecastClient fetch ผ่าน API Route |
| `/contents` | Client-side | ContentHub fetch CSV ฝั่ง Client |
| `/data-portal` | Client-side | Auth-gated, Firestore real-time |
| `/admin/*` | Client-side | UI Mockup (Hardcoded data) |

### 4.2 Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │Dashboard │ │ Forecast │ │ Contents │ │Data Portal │ │
│  │  (Map)   │ │ (Chart)  │ │  (CSV)   │ │(Firestore) │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
│       │             │            │              │        │
└───────┼─────────────┼────────────┼──────────────┼────────┘
        │             │            │              │
        ▼             ▼            ▼              ▼
┌───────────────────────────────────────────────┐ ┌───────┐
│           Next.js Server (API Routes)         │ │       │
│  ┌──────────────┐  ┌───────────────────────┐  │ │Firebase│
│  │/api/hotspots │  │  /api/forecast        │  │ │       │
│  │(NASA proxy)  │  │  (GISTDA proxy+cache) │  │ │ Auth  │
│  └──────┬───────┘  └──────────┬────────────┘  │ │ Store │
│         │                     │               │ │       │
└─────────┼─────────────────────┼───────────────┘ └───┬───┘
          │                     │                     │
          ▼                     ▼                     ▼
   ┌──────────┐      ┌──────────────┐         ┌──────────┐
   │NASA FIRMS│      │GISTDA PM2.5  │         │Firestore │
   │(VIIRS)   │      │  API + Pred  │         │Collections│
   └──────────┘      └──────────────┘         │users     │
                                              │datasets  │
                                              └──────────┘
```

### 4.3 Component Hierarchy

```
RootLayout (layout.tsx)
├── Providers (AuthProvider)
├── JsonLd (Structured Data)
└── {children}
    │
    ├── Landing Page (/)
    │   ├── Header
    │   ├── Hero
    │   ├── FeatureCards
    │   ├── LatestContent
    │   └── Footer
    │
    ├── Dashboard (/dashboard)
    │   ├── Header
    │   ├── PM25MapWrapper  (dynamic, ssr:false)
    │   │   └── PM25ProvinceMap
    │   │       ├── GeoJSON Choropleth Layer
    │   │       ├── Hotspot Markers Layer
    │   │       ├── Sidebar (Province List)
    │   │       ├── Layer Control Panel
    │   │       ├── Province Detail Card
    │   │       └── PM25ImpactPanel
    │   └── Footer
    │
    ├── Forecast (/forecast)
    │   ├── Header
    │   ├── ForecastClient
    │   │   ├── Province Selector (Tabs + Grid + Search)
    │   │   ├── Current Value Card
    │   │   ├── LineChart (Recharts)
    │   │   └── Forecast Pills
    │   └── Footer
    │
    ├── Contents (/contents)
    │   ├── Header
    │   ├── ContentHub
    │   │   ├── Media Type Tabs
    │   │   ├── Category Chips
    │   │   ├── Search Bar
    │   │   └── Article Grid
    │   └── Footer
    │
    ├── Data Portal (/data-portal)
    │   ├── Header
    │   ├── Stats Cards
    │   ├── Admin Toolbar
    │   ├── Dataset Cards (local + external)
    │   ├── CRUD Modal
    │   └── Footer
    │
    └── Admin (/admin/*)
        ├── AdminSidebar
        └── {children}  (Dashboard / Articles / Reports)
```

---

## 5. Data Flow & แหล่งข้อมูล

### 5.1 GISTDA PM2.5 (Real-time)
| รายการ | รายละเอียด |
|:-------|:-----------|
| URL | `https://pm25.gistda.or.th/rest/getPm25byProvince` |
| ใช้ใน | `/dashboard` (Server Component, ISR 1hr) |
| Method | GET |
| Response | Array of province objects: `{ name_th, name_en, pm25, dustboy_id, ... }` |
| Rendering | Server-side fetch → ส่งเป็น `initialData` prop → Client render |

### 5.2 GISTDA Forecast (Prediction)
| รายการ | รายละเอียด |
|:-------|:-----------|
| URL | `https://pm25.gistda.or.th/rest/pred/getPM25byProvince?pv_idn=XX` |
| Proxy | `/api/forecast` (In-memory Map cache, TTL 1 ชม. ต่อจังหวัด) |
| ใช้ใน | `/forecast` (Client-side fetch) |
| Response | `{ province, prediction: [{ datetime, pm25 }] }` |

### 5.3 NASA FIRMS (Hotspots)
| รายการ | รายละเอียด |
|:-------|:-----------|
| Sources | VIIRS_SNPP_NRT + VIIRS_NOAA20_NRT |
| URL | `https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/...` |
| Proxy | `/api/hotspots` (Server-side, ISR 1hr) |
| Bounding Box | Thailand: `92,5,110,21` |
| Duration | 2 วัน |
| Dedup | ลบจุดซ้ำด้วย key `${lat}_${lon}_${date}_${time}` |
| ใช้ใน | PM25ProvinceMap (Client-side fetch) |

### 5.4 CSV Files (Static Data)
| ไฟล์ | ตำแหน่ง | ใช้ใน | วิธี Parse |
|:-----|:--------|:------|:----------|
| `news-thaipbs.csv` | `/public/datas/` | LatestContent, ContentHub | Custom CSV parser (รองรับ multiline quotes, URL boundaries) |
| `pm25_impact_meaning_all_provinces.csv` | `/public/datas/` | Dashboard (SSR), PM25ImpactPanel | `fs.readFileSync` (Server) + `split(',')` |

#### news-thaipbs.csv Fields
```
title, description, url, image, category, mediaType, publishedDate
```

#### pm25_impact_meaning_all_provinces.csv Fields
```
province, days_2567, days_2568, diff, trend, impact_level, meaning
```

### 5.5 GeoJSON (Province Boundaries)
| รายการ | รายละเอียด |
|:-------|:-----------|
| Source | GitHub: chingchai/OpenGISData-Thailand |
| URL | `https://raw.githubusercontent.com/.../thailand-province-geo.json` |
| ใช้ใน | PM25ProvinceMap (Client-side fetch) |
| Matching | Match province ด้วย `properties.pro_th` vs PM2.5 name_th (normalized) |

### 5.6 Firestore Collections

#### `users` Collection
```typescript
interface UserDoc {
  email: string;
  displayName: string;
  photoURL: string;
  role: "admin" | "user";
  createdAt: Timestamp;
}
// Document ID = Firebase Auth UID
```

#### `datasets` Collection
```typescript
interface Dataset {
  id?: string;  // Firestore auto-generated
  name: string;
  description: string;
  source: string;
  format: string;
  url: string;
  icon: string;
  type: "local" | "external";
  createdBy: string;  // UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 6. Authentication & Authorization

### 6.1 Firebase Auth Setup
```typescript
// lib/firebase.ts
const firebaseConfig = {
  apiKey: "...",
  authDomain: "tftf-bfbc9.firebaseapp.com",
  projectId: "tftf-bfbc9",
  // ...
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, 'funfai-data-portal');
```

### 6.2 Auth Flow
```
User clicks "Login" → /login page
    → Click "Login with Google"
    → signInWithPopup(auth, GoogleAuthProvider)
    → Firebase returns user object
    → Check Firestore: any admin exists?
        → No admin → set role = "admin"
        → Has admin → set role = "user"
    → Write/Update Firestore users/{uid}
    → AuthContext provides { user, role, loading }
    → Redirect to /data-portal
```

### 6.3 Route Protection
| Pattern | Method | Implementation |
|:--------|:-------|:---------------|
| `/data-portal` | Client-side redirect | `if (!user && !loading) router.replace('/login')` |
| `/data-portal/manage-users` | Client-side redirect | `if (role !== 'admin') router.replace('/data-portal')` |
| `/admin/*` | ❌ ไม่มี Auth Guard | เข้าถึงได้โดย URL โดยตรง |

### 6.4 AuthContext API
```typescript
const { user, role, loading, signInWithGoogle, logout } = useAuth();
// user: FirebaseUser | null
// role: "admin" | "user" | null
// loading: boolean
```

---

## 7. หน้าและ Component

### 7.1 Component สำคัญ

#### PM25ProvinceMap.tsx (491 lines)
**หน้าที่**: แผนที่ Choropleth แบบ Full-screen
- Map Provider: `react-leaflet` → `MapContainer`, `TileLayer`, `GeoJSON`
- Base Tiles: CARTO Light (no labels) + CARTO Labels overlay
- GeoJSON styling: `fillColor` จาก `getColor(pm25)` — 5 ระดับตามมาตรฐานไทย
- Province matching: Normalize ชื่อจังหวัด (ตัด "จังหวัด", ".") แล้ว match กับ GISTDA data
- Hotspot markers: Custom `divIcon` ด้วย fire emoji, ขนาด/สี/opacity ตาม FRP + Confidence
- State management: `selectedProvince`, `showSidebar`, `showHotspots`, `showPM25Layer`
- Mobile: Sidebar เป็น Full-screen overlay + Backdrop

#### ForecastClient.tsx (557 lines)
**หน้าที่**: Province selector + Forecast chart
- 77 จังหวัดแบ่ง 7 ภูมิภาค (Tab-based)
- `currentHourIndex`: หา timepoint ปัจจุบัน → AnimatedDot pulse
- Recharts: `LineChart` + `ReferenceLine` (25/37.5/75/100) + `ReferenceArea` (bands)
- Custom `Tooltip` component → เวลา ICT, ค่า PM2.5, Badge

#### ContentHub.tsx
**หน้าที่**: Content listing + filtering
- Custom CSV parser: Handle `"quoted fields"`, multiline, URL boundaries (`http`)
- Filter chain: mediaType → category → search term
- Image fallback: YouTube `maxresdefault` → `hqdefault` → placeholder div

#### PM25ImpactPanel.tsx
**หน้าที่**: Slide panel ข้อมูลผลกระทบ
- Data: `pm25_impact_meaning_all_provinces.csv`
- Filter: impact level (Critical ≥80 วัน, Severe ≥50, Moderate ≥20, Safe <20)
- Search: province name
- Bar chart: Recharts horizontal bars (2567 vs 2568)

### 7.2 สรุปบทบาท Component
| Component | ใช้ใน | หมายเหตุ |
|:----------|:------|:---------|
| Header | ทุกหน้า Public | Auth-aware, responsive |
| Footer | ทุกหน้า Public | 8 partner logos |
| Hero | Landing Page | Thai PBS background |
| FeatureCards | Landing Page | 3 cards, 1 external link |
| LatestContent | Landing Page | 3 articles from CSV |
| PM25MapWrapper | Dashboard | Dynamic import wrapper |
| PM25ProvinceMap | Dashboard | Full map + sidebar + hotspots |
| PM25ImpactPanel | Dashboard | Impact stats panel |
| ForecastClient | Forecast | Province selector + chart |
| ContentHub | Contents | CSV parser + filters |
| AdminSidebar | Admin Panel | Dark sidebar, 5 menu items |
| Providers | Root Layout | AuthProvider wrapper |
| JsonLd | Root Layout | Structured data |

---

## 8. API Routes

### 8.1 `/api/hotspots` (GET)
```typescript
// Purpose: Server-side proxy for NASA FIRMS VIIRS data
// Sources: VIIRS_SNPP_NRT + VIIRS_NOAA20_NRT
// BBox: Thailand (92,5,110,21)
// Duration: 2 days
// Process: Fetch CSV → Parse → Deduplicate by lat_lon_date_time → JSON
// Cache: ISR revalidate 3600 seconds
// Response: { hotspots: Array<{latitude, longitude, bright_ti4, frp, confidence, acq_date, acq_time, daynight, satellite, instrument}> }
```

### 8.2 `/api/forecast` (GET)
```typescript
// Purpose: Server-side proxy for GISTDA PM2.5 forecast
// Query: ?pv_idn=XX (province ID number)
// If no pv_idn: Returns province list (77 provinces)
// Cache: In-memory Map<string, {data, timestamp}>, TTL 1 hour per province
// Response: Proxied GISTDA response JSON
```

### 8.3 `/api/og` (GET)
```typescript
// Purpose: Generate Open Graph images for social sharing
// Uses: @vercel/og ImageResponse
// Output: 1200×630 PNG with branded design
```

---

## 9. Styling & Design System

### 9.1 Tailwind CSS v4
Configuration ผ่าน CSS variables ใน `globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-primary: #F26522;     /* ส้ม Thai PBS */
  --color-secondary: #1a1a2e;   /* กรมท่า */
  --color-accent: #FF8C00;      /* ส้มเข้ม */
  --font-sans: 'DB Helvethaica X', sans-serif;
}
```

### 9.2 Color Palette
| ชื่อ | Hex | การใช้งาน |
|:-----|:----|:---------|
| Primary | `#F26522` | ปุ่มหลัก, CTA, Header, Branding |
| Secondary | `#1a1a2e` | พื้นหลังเข้ม, Admin Sidebar |
| Accent | `#FF8C00` | Hover states |
| Background | `#FAF9F6` | พื้นหลังหน้าเว็บ |

### 9.3 PM2.5 Color Scale (Map)
| ระดับ | ค่า | สี | Hex |
|:------|:----|:---|:----|
| ดีมาก | 0–25 | เขียว | `#22c55e` |
| ดี | 26–37.5 | เหลือง | `#eab308` |
| ปานกลาง | 38–75 | ส้ม | `#f97316` |
| มีผลต่อสุขภาพ | 76–100 | แดง | `#ef4444` |
| อันตราย | >100 | ม่วง | `#a855f7` |

### 9.4 Typography
- **Font Family**: DB Helvethaica X (Local files)
- **Weights**: 400 (Regular), 500 (Medium), 700 (Bold)
- **Loading**: `next/font/local` in Root Layout

### 9.5 Responsive Breakpoints
| Breakpoint | ใช้ใน |
|:-----------|:------|
| `sm` (640px) | Mobile → 1 column |
| `md` (768px) | Tablet → 2 columns |
| `lg` (1024px) | Desktop → 3 columns, sidebar visible |
| `xl` (1280px) | Wide desktop |

---

## 10. SEO & Metadata

### 10.1 Root Metadata (layout.tsx)
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://funfai.thaipbs.or.th'),
  title: { default: '...', template: '%s | ทันฝุ่น ทันไฟ' },
  description: '...',
  keywords: ['PM2.5', 'ฝุ่นควัน', 'ไฟป่า', 'เชียงใหม่', ...],
  openGraph: { type: 'website', locale: 'th_TH', images: ['/api/og'] },
  twitter: { card: 'summary_large_image', creator: '@ThaiPBS' },
  robots: { index: true, follow: true },
};
```

### 10.2 Per-Page Metadata
แต่ละหน้ามี metadata export เฉพาะ (title, description, canonical):
- Dashboard: "แดชบอร์ดฝุ่นไฟ"
- Forecast: "พยากรณ์คุณภาพอากาศ"
- Contents: "คลังสื่อสารและความรู้"
- Contact: "ติดต่อเรา"
- Login: "เข้าสู่ระบบ"
- Data Portal: "คลังข้อมูลเปิด"

### 10.3 Structured Data (JsonLd)
Component `JsonLd.tsx` ใน Root Layout ส่ง `application/ld+json`:
- `@type: WebSite` + `potentialAction: SearchAction`

### 10.4 robots.ts + sitemap.ts
- `robots.ts` — Allow all, link to sitemap
- `sitemap.ts` — Generate sitemap with all public routes

---

## 11. Deployment

### 11.1 Firebase App Hosting
- Config: `apphosting.yaml`
- Project: `tftf-bfbc9`
- Build: Next.js automatic

### 11.2 Image Domains (next.config.ts)
Allowed external image domains:
- `files-locals.thaipbs.or.th` — Thai PBS images
- `dw1.s81c.com` — Partner logos
- `picsum.photos` — Placeholder images
- `i.ytimg.com` — YouTube thumbnails
- `lh3.googleusercontent.com` — Google user avatars

### 11.3 Build & Deploy
```bash
npm install          # Install dependencies
npm run build        # Build Next.js production
npm run start        # Start production server (local)
firebase deploy      # Deploy to Firebase App Hosting
```

---

## 12. แผนพัฒนาในอนาคต

### 12.1 ฟีเจอร์ที่ยังไม่สมบูรณ์
| รายการ | สถานะปัจจุบัน | สิ่งที่ต้องทำ |
|:-------|:-------------|:-------------|
| Admin Panel (`/admin/*`) | UI Mockup, ข้อมูล Hardcoded | เชื่อมต่อ Firestore, CRUD จริง |
| Article Page (`/article/[id]`) | เนื้อหา Hardcoded | สร้าง CMS / ดึงจาก Database |
| Contact Form | แสดง Alert เท่านั้น | เชื่อมต่อ Email Service หรือ Backend |
| Admin Auth Guard | ไม่มี | เพิ่ม Middleware หรือ Client-side guard |

### 12.2 ฟีเจอร์ที่แนะนำเพิ่ม
- **Push Notifications** — แจ้งเตือนเมื่อ PM2.5 เกินเกณฑ์
- **Historical Data** — กราฟข้อมูลย้อนหลังหลายเดือน/ปี
- **User Bookmarks** — บันทึกจังหวัดที่สนใจ
- **Data Export** — Export ข้อมูลเป็น CSV/PDF จาก Dashboard
- **Multi-language** — รองรับภาษาอังกฤษ
- **Real-time Updates** — WebSocket/SSE สำหรับข้อมูล PM2.5 live
