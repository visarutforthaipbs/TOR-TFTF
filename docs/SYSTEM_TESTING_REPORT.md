# รายงานผลการทดสอบระบบ (System Testing Report)
**โครงการ:** ทันฝุ่น ทันไฟ (TunFoon TunFai)  
**เว็บไซต์:** https://funfai.thaipbs.or.th  
**วันที่ทดสอบ:** 26 กุมภาพันธ์ 2569  
**ผู้จัดทำ:** ทีมพัฒนาโครงการ

---

## 1. วัตถุประสงค์ (Objective)
เอกสารฉบับนี้จัดทำขึ้นเพื่อรายงานผลการทดสอบระบบ (System Testing) ของแพลตฟอร์ม "ทันฝุ่น ทันไฟ" ครอบคลุมทุกหน้าและ API Route ที่มีอยู่ในระบบจริง

## 2. ขอบเขตการทดสอบ (Scope of Testing)

### 2.1 หน้าที่ทดสอบ (Pages Tested)
| Route | ชื่อหน้า | ประเภท |
|:------|:---------|:-------|
| `/` | หน้าแรก (Landing Page) | Public |
| `/dashboard` | แดชบอร์ด PM2.5 แผนที่รายจังหวัด | Public |
| `/forecast` | พยากรณ์คุณภาพอากาศรายชั่วโมง | Public |
| `/contents` | คลังสื่อสารและความรู้ | Public |
| `/contact` | ติดต่อเรา (แบบฟอร์ม) | Public |
| `/article/[id]` | หน้าบทความรายตัว (Long-form) | Public |
| `/login` | เข้าสู่ระบบ (Google OAuth) | Public |
| `/data-portal` | คลังข้อมูลเปิด (Data Portal) | ต้อง Login |
| `/data-portal/manage-users` | จัดการสิทธิ์ผู้ใช้ | Admin เท่านั้น |
| `/admin` | ภาพรวมระบบหลังบ้าน | Admin Panel |
| `/admin/articles` | จัดการบทความ | Admin Panel |
| `/admin/reports` | จัดการรายงาน C-Site | Admin Panel |

### 2.2 API Routes ที่ทดสอบ
| Route | การทำงาน |
|:------|:---------|
| `GET /api/hotspots` | Proxy ดึงจุดความร้อน VIIRS จาก NASA FIRMS (SNPP + NOAA-20) bounding box ประเทศไทย 2 วัน, Deduplicate แล้วส่ง JSON, revalidate 1 ชม. |
| `GET /api/forecast?pv_idn=XX` | Proxy ดึงพยากรณ์ PM2.5 รายจังหวัดจาก GISTDA (pred API), In-memory cache TTL 1 ชม. |
| `GET /api/forecast` (no param) | ส่งคืนรายชื่อ 77 จังหวัดพร้อมรหัส |
| `GET /api/og` | สร้าง Open Graph Image สำหรับ Social Sharing |

## 3. สภาพแวดล้อมการทดสอบ (Test Environment)
| รายการ | รายละเอียด |
|:-------|:-----------|
| Framework | Next.js 15 (App Router), React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4 |
| Database | Firebase Firestore (named instance: `funfai-data-portal`) |
| Authentication | Firebase Auth — Google Sign-In via Popup |
| Maps | React-Leaflet + Leaflet.js, TileLayer: CARTO Light (no labels + labels overlay) |
| Charts | Recharts (LineChart) |
| Icons | Lucide React |
| Hosting | Firebase App Hosting |
| Browsers ทดสอบ | Chrome (latest), Safari, Firefox, Edge |
| Devices ทดสอบ | Desktop 1920×1080, iPad, iPhone, Android |

---

## 4. ผลการทดสอบ (Test Results)

### 4.1 หน้าแรก (Landing Page — `/`)
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | Header & Navigation | เมนู Desktop 4 รายการ (แดชบอร์ด, พยากรณ์, คลังความรู้, ติดต่อเรา) + ปุ่ม "รายงานสถานการณ์" → ลิงก์ไป `legacy.csitereport.com` (external) + ปุ่ม "เข้าสู่ระบบ" → `/login` | ✅ ผ่าน |
| 2 | Header: User Logged In | แสดง Avatar, ชื่อ, Dropdown มี "คลังข้อมูล" → `/data-portal` และ "ออกจากระบบ", แสดง Badge "ผู้ดูแลระบบ" ถ้า role=admin | ✅ ผ่าน |
| 3 | Mobile Hamburger Menu | ปุ่ม Menu/X toggle, Slide-down panel แสดงเมนูทั้งหมด + Login/User info | ✅ ผ่าน |
| 4 | Hero Section | Background image จาก `files-locals.thaipbs.or.th`, Gradient overlay สีส้ม, Headline "รับมือวิกฤตฝุ่นควัน ด้วยพลังพลเมืองตื่นรู้", CTA "ดูสถานการณ์ฝุ่นวันนี้" → `/dashboard` | ✅ ผ่าน |
| 5 | Feature Cards (3 ใบ) | "ฝุ่นไฟใกล้ฉัน" → `/dashboard`, "พยากรณ์ฝุ่นไฟ" → `/forecast`, "พลเมืองจัดการฝุ่นไฟ" → `legacy.csitereport.com` (external, new tab) | ✅ ผ่าน |
| 6 | Latest Content | Fetch + Parse `/datas/news-thaipbs.csv` แสดง 3 รายการแรก, คลิก → เปิดลิงก์ Thai PBS (new tab), ปุ่ม "ดูทั้งหมด" → `/contents` | ✅ ผ่าน |
| 7 | Footer | โลโก้พาร์ทเนอร์ 8 รายการ (SVG), ลิงก์ "ติดต่อเรา" → `/contact`, © 2026 Public intelligence | ✅ ผ่าน |

### 4.2 แดชบอร์ด PM2.5 (`/dashboard`)
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | GeoJSON Map | โหลด GeoJSON จังหวัดจาก GitHub (chingchai/OpenGISData-Thailand), ระบายสี Choropleth ตามค่า PM2.5 จริง 5 ระดับ: ≤25 เขียว, ≤37.5 เหลือง, ≤75 ส้ม, ≤100 แดง, >100 ม่วง | ✅ ผ่าน |
| 2 | PM2.5 Data — GISTDA API | Server-side fetch จาก `pm25.gistda.or.th/rest/getPm25byProvince`, ISR revalidate 1 ชม., ส่งลง Client เป็น initialData | ✅ ผ่าน |
| 3 | Tooltip (Hover จังหวัด) | ชื่อไทย/อังกฤษ, ค่า PM2.5 (µg/m³), Badge สีระดับ, เปลี่ยนแปลง +/-, ค่าเฉลี่ย 24 ชม. — sticky tooltip | ✅ ผ่าน |
| 4 | Sidebar (รายจังหวัด) | 77 จังหวัดเรียงค่า PM2.5 สูง→ต่ำ, จุดสีระดับ, Legend pills 5 ระดับ, จำนวนจุดความร้อนวันนี้, วันเวลาอัปเดต | ✅ ผ่าน |
| 5 | คลิกเลือกจังหวัด | คลิก Sidebar หรือบนแผนที่ → Highlight (border หนา, opacity สูง), Detail Card แสดง PM2.5 + ระดับ + Trend (TrendingUp/TrendingDown + diff) | ✅ ผ่าน |
| 6 | จุดความร้อน VIIRS | `/api/hotspots` ดึงจาก NASA FIRMS (VIIRS_SNPP_NRT + VIIRS_NOAA20_NRT), Fire icon ขนาดตาม FRP (14-28px), สีตาม FRP (เหลือง/ส้ม/แดง), Opacity ตาม Confidence (สูง/ปานกลาง/ต่ำ) | ✅ ผ่าน |
| 7 | Hotspot Tooltip | FRP (MW), ระดับความเชื่อมั่น (Badge สี), วันที่, กลางวัน☀️/กลางคืน🌙 | ✅ ผ่าน |
| 8 | Layer Toggle | Checkbox เปิด/ปิด "PM2.5 รายจังหวัด" และ "จุดความร้อน VIIRS" + Legend ย่อยของแต่ละ Layer | ✅ ผ่าน |
| 9 | PM2.5 Impact Panel | Slide panel แสดงจำนวนวันฝุ่นเกิน 37.5 µg/m³ ปี 2567-2568 (จาก CSV), กราฟแท่งเปรียบเทียบ 2 ปี, ค้นหาจังหวัด, กรองตามระดับ (Critical/Severe/Moderate/Safe), ขยายดูรายละเอียดผลกระทบ | ✅ ผ่าน |
| 10 | Mobile Responsive | ปุ่ม "รายจังหวัด" เปิด Sidebar แบบ Full-screen overlay, Backdrop `bg-black/40`, ปิดโดยคลิก Backdrop/X/เลือกจังหวัด | ✅ ผ่าน |

### 4.3 พยากรณ์คุณภาพอากาศ (`/forecast`)
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | Province Selector | 77 จังหวัด, Tab ภูมิภาค 7 Tab (ทั้งหมด/เหนือ/อีสาน/กลาง/ตะวันออก/ตะวันตก/ใต้), ค้นหาไทย/อังกฤษ, Grid layout responsive | ✅ ผ่าน |
| 2 | Forecast API | Client เรียก `/api/forecast?pv_idn=XX` → Server proxy ไปยัง `pm25.gistda.or.th/rest/pred/getPM25byProvince`, In-memory cache TTL 1 ชม. | ✅ ผ่าน |
| 3 | Line Chart (Recharts) | PM2.5 รายชั่วโมง, Reference Lines (25/37.5/75/100), สี Band พื้นหลัง 5 ระดับ, Animated Dot จุดปัจจุบัน (pulse) | ✅ ผ่าน |
| 4 | Custom Tooltip | เวลา ICT (HH:MM น.), ค่า PM2.5, Badge สีระดับ, ระบุ "(ปัจจุบัน)" ถ้าเป็นจุดปัจจุบัน | ✅ ผ่าน |
| 5 | Current Value Card | แสดงค่า PM2.5 ปัจจุบัน + Badge ระดับ + วันเวลาอัปเดตจาก GISTDA | ✅ ผ่าน |
| 6 | Forecast Pills | Pills รายชั่วโมง (เวลา + ค่า) สีตามระดับ, จุดปัจจุบันมี ring highlight, scrollable | ✅ ผ่าน |
| 7 | Error + Empty State | API ล้มเหลว → "ไม่สามารถโหลดข้อมูลพยากรณ์ได้", ไม่มีข้อมูล → "ไม่มีข้อมูลการพยากรณ์สำหรับจังหวัดนี้ในขณะนี้" | ✅ ผ่าน |
| 8 | Default Province | เริ่มต้นที่เชียงใหม่ (pvIdn=50, ภาคเหนือ) | ✅ ผ่าน |

### 4.4 คลังสื่อสารและความรู้ (`/contents`)
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | CSV Data Loading | Fetch + Parse `/datas/news-thaipbs.csv`, Custom parser รองรับ Multiline quoted fields, URL boundary detection | ✅ ผ่าน |
| 2 | Media Type Tabs | ทั้งหมด, สารคดี, วีดีโอสั้น, รายการทีวี, บทความ, สำรวจความเห็น — มี Lucide icon ประกอบ | ✅ ผ่าน |
| 3 | Category Filter | แสดง 5 หมวดแรก + ปุ่ม "+N หมวดหมู่" toggle ขยาย/ย่อ | ✅ ผ่าน |
| 4 | Search | ค้นหาจาก title, category, mediaType (case-insensitive) | ✅ ผ่าน |
| 5 | Article Cards | Grid 1/2/3 คอลัมน์ (responsive), รูปภาพ + Fallback (YouTube maxresdefault → hqdefault → placeholder), Badge ประเภทสื่อ, ExternalLink icon on hover | ✅ ผ่าน |
| 6 | External Links | คลิก → เปิดลิงก์ภายนอก (Thai PBS) ใน Tab ใหม่ | ✅ ผ่าน |
| 7 | Results Count | "แสดง X จาก Y ชิ้นงาน" + จำนวนชิ้นงานทั้งหมดใน Header | ✅ ผ่าน |
| 8 | Empty State | กรณีไม่พบผลลัพธ์ → "ไม่พบเนื้อหาที่ค้นหา" + icon + คำแนะนำ | ✅ ผ่าน |

### 4.5 เข้าสู่ระบบ (`/login`)
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | Google Sign-In | Click → Firebase `signInWithPopup` + `GoogleAuthProvider` → เลือก Google Account | ✅ ผ่าน |
| 2 | Auto-redirect | ถ้า user มีอยู่แล้ว → `router.replace('/data-portal')` | ✅ ผ่าน |
| 3 | First User = Admin | ตรวจ Firestore `users` collection ด้วย `where('role','==','admin')` limit 1 — ถ้าไม่มี → assign `admin`, มีแล้ว → assign `user` | ✅ ผ่าน |
| 4 | User Document Creation | บันทึก `{email, displayName, photoURL, role, createdAt}` ลง Firestore `users/{uid}` | ✅ ผ่าน |
| 5 | Error Handling | Popup closed → ไม่แสดง Error, อื่นๆ → "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" | ✅ ผ่าน |
| 6 | UI: Value Proposition | Desktop: แสดง 3 Feature cards (คลังข้อมูลเปิด, ดาวน์โหลดได้ทันที, สำหรับทุกคน), Mobile: แสดงเป็น Grid 3 คอลัมน์ย่อ | ✅ ผ่าน |

### 4.6 คลังข้อมูลเปิด (`/data-portal`)
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | Auth Guard | ไม่มี user → `router.replace('/login')` | ✅ ผ่าน |
| 2 | Firestore CRUD | Fetch/Create/Update/Delete จาก `datasets` collection, ใช้ `serverTimestamp()`, `createdBy` = uid | ✅ ผ่าน |
| 3 | Dataset Categories | แบ่ง 2 กลุ่ม: `local` (ข้อมูลโครงการ, มีปุ่มดาวน์โหลด) และ `external` (แหล่งภายนอก, ลิงก์ใหม่) | ✅ ผ่าน |
| 4 | Admin Toolbar | Admin เห็น: ปุ่ม "เพิ่มชุดข้อมูล", "จัดการผู้ใช้" → `/data-portal/manage-users`, "รีเฟรช" | ✅ ผ่าน |
| 5 | CRUD Modal | Form fields: ชื่อ, คำอธิบาย, แหล่งข้อมูล, รูปแบบ, URL, ไอคอน (8 ตัวเลือก), ประเภท (local/external) | ✅ ผ่าน |
| 6 | Admin Edit/Delete on Cards | Hover → แสดงปุ่ม Pencil/Trash2, Delete มี Confirmation modal | ✅ ผ่าน |
| 7 | Seed Default Datasets | กรณี Empty → Admin กดปุ่มเพิ่มชุดข้อมูลเริ่มต้น 8 รายการ (news-thaipbs CSV, PM2.5 impact CSV, GISTDA API, NASA FIRMS, Open-Meteo, กรมควบคุมมลพิษ, กรมอุทยานฯ, ม.เชียงใหม่ CCDC) | ✅ ผ่าน |
| 8 | Stats Section | 4 Cards: ชุดข้อมูลทั้งหมด, ดาวน์โหลดได้ทันที, แหล่งข้อมูลภายนอก, จำนวนรูปแบบข้อมูล | ✅ ผ่าน |

### 4.7 จัดการผู้ใช้ (`/data-portal/manage-users`)
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | Admin Gate | ไม่ใช่ Admin → Redirect ไป `/data-portal` | ✅ ผ่าน |
| 2 | User List | ดึงจาก Firestore `users` collection (orderBy createdAt desc), แสดง Avatar/ชื่อ/อีเมล/Role/วันที่สมัคร | ✅ ผ่าน |
| 3 | Toggle Role | ปุ่มสลับ admin↔user ด้วย `updateDoc`, **ไม่สามารถ Demote ตัวเอง** (ปุ่มถูก Disable) | ✅ ผ่าน |
| 4 | Search | ค้นหาจาก displayName หรือ email | ✅ ผ่าน |
| 5 | Stats | แสดง: ผู้ใช้ทั้งหมด, ผู้ดูแลระบบ, ผู้ใช้ทั่วไป | ✅ ผ่าน |

### 4.8 Admin Panel (`/admin/*`)
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | Sidebar Layout | Dark sidebar ซ้าย (w-64), 5 เมนู: ภาพรวม, จัดการบทความ, รายงาน C-Site, จัดการผู้ใช้, ตั้งค่าระบบ + ปุ่มออกจากระบบ | ✅ ผ่าน |
| 2 | Mobile Sidebar | Hamburger button, Slide-in + Backdrop | ✅ ผ่าน |
| 3 | Dashboard `/admin` | 4 Stat Cards + กิจกรรมล่าสุด (3 รายการ) — **⚠️ Static Mockup** | ✅ ผ่าน (UI) |
| 4 | Articles `/admin/articles` | ตาราง + ค้นหา + กรองหมวดหมู่ + ปุ่ม Create/Edit/Delete — **⚠️ Static Mockup** | ✅ ผ่าน (UI) |
| 5 | Reports `/admin/reports` | ตาราง + Tab (รอดำเนินการ/อนุมัติ/ปฏิเสธ) + ปุ่ม ดู/อนุมัติ/ปฏิเสธ — **⚠️ Static Mockup** | ✅ ผ่าน (UI) |

### 4.9 SEO & Metadata
| # | รายการทดสอบ | รายละเอียดที่ตรวจสอบ | สถานะ |
|:--|:-----------|:---------------------|:------|
| 1 | Metadata per Page | ทุกหน้ามี title, description, canonical, og tags | ✅ ผ่าน |
| 2 | Open Graph Image | Dynamic OG image จาก `/api/og` | ✅ ผ่าน |
| 3 | Twitter Cards | `summary_large_image`, creator: `@ThaiPBS` | ✅ ผ่าน |
| 4 | JsonLd + robots + sitemap | Component JsonLd อยู่ใน Root Layout, มีไฟล์ `robots.ts` และ `sitemap.ts` | ✅ ผ่าน |
| 5 | Keywords | PM2.5, ฝุ่นควัน, ไฟป่า, เชียงใหม่, ภาคเหนือ, จุดความร้อน, Thai PBS ฯลฯ | ✅ ผ่าน |

---

## 5. การแก้ไขข้อผิดพลาด (Bug Fixes)

### 5.1 Critical Bugs
| Bug | รายละเอียด | วิธีแก้ไข |
|:----|:-----------|:----------|
| **Leaflet SSR Error** | `window is not defined` เมื่อ Server render Leaflet | ใช้ `next/dynamic` + `ssr: false` ใน `PM25MapWrapper.tsx` |
| **Hotspot CORS** | NASA FIRMS API ไม่อนุญาต Client-side calls | สร้าง API Route `/api/hotspots` เป็น Server-side proxy |
| **Forecast CORS** | GISTDA pred API ไม่อนุญาต Client-side calls | สร้าง API Route `/api/forecast` + In-memory cache 1 ชม. |
| **First User No Admin** | User คนแรกไม่มีสิทธิ์จัดการระบบ | AuthContext ตรวจ Firestore: ถ้าไม่มี admin → assign admin ให้คนแรก |

### 5.2 Minor Bugs
| Bug | รายละเอียด | วิธีแก้ไข |
|:----|:-----------|:----------|
| **YouTube 404** | `maxresdefault.jpg` ไม่มีสำหรับบางวิดีโอ | `onError` → fallback เป็น `hqdefault`, ถ้ายังไม่ได้ → ซ่อน img แสดง placeholder |
| **Legend Click-through** | คลิก/ซูมบน Legend panel ทำให้แผนที่ขยับ | `stopPropagation` สำหรับ dblclick, mousedown, touchstart, wheel |
| **CSV Parse Failure** | บทความที่มี comma/newline ใน title พัง | Custom CSV parser รองรับ quoted fields + URL boundary detection |
| **Mobile Sidebar Scroll** | Map ด้านหลัง Sidebar ยังเลื่อนได้ | เพิ่ม Backdrop overlay `bg-black/40` + click to close |

---

## 6. ข้อจำกัดที่ทราบ (Known Limitations)
| # | รายการ | รายละเอียด |
|:--|:-------|:-----------|
| 1 | Admin Panel (`/admin/*`) เป็น UI Mockup | หน้า Dashboard, Articles, Reports แสดงข้อมูล Hardcoded ยังไม่เชื่อมต่อ Firestore |
| 2 | Article Page เป็น Static Content | `/article/[id]` แสดงเนื้อหา Hardcoded ไม่ได้ดึงจาก Database |
| 3 | Contact Form ไม่ส่ง Email จริง | แสดง `alert()` เมื่อ Submit, ไม่ส่งข้อมูลไป Backend |
| 4 | C-Site Report ลิงก์เว็บภายนอก | ปุ่ม "รายงานสถานการณ์" → `https://legacy.csitereport.com/pm25noclus` ไม่ได้อยู่ในระบบ |
| 5 | Admin Panel ไม่มี Auth Guard | Route `/admin/*` ยังไม่มีการตรวจสอบสิทธิ์ (ใครก็เข้าถึง URL ได้) |

## 7. สรุปผล (Conclusion)
ระบบ "ทันฝุ่น ทันไฟ" ผ่านการทดสอบในส่วนที่ทำงานจริงทั้งหมด ได้แก่:
- **Dashboard PM2.5** — ข้อมูลจริงจาก GISTDA + จุดความร้อนจาก NASA FIRMS
- **พยากรณ์ฝุ่นไฟ** — ข้อมูลจริงจาก GISTDA ครบ 77 จังหวัด
- **คลังความรู้** — ข้อมูลจริงจาก CSV (67 ชิ้นงาน Thai PBS)
- **Authentication** — Google OAuth + Role management บน Firestore
- **Data Portal** — CRUD สมบูรณ์บน Firestore + User management

ระบบพร้อมสำหรับ Production Deployment
