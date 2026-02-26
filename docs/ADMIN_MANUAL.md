# คู่มือการใช้งานสำหรับผู้ดูแลระบบ (Admin Manual)
**โครงการ:** ทันฝุ่น ทันไฟ (TunFoon TunFai)  
**เว็บไซต์:** https://funfai.thaipbs.or.th  
**เวอร์ชัน:** 1.0  

---

## สารบัญ
1. [ภาพรวมระบบสำหรับผู้ดูแล](#1-ภาพรวมระบบสำหรับผู้ดูแล)
2. [การเข้าสู่ระบบ](#2-การเข้าสู่ระบบ)
3. [ระบบสิทธิ์ผู้ใช้](#3-ระบบสิทธิ์ผู้ใช้)
4. [คลังข้อมูลเปิด (Data Portal)](#4-คลังข้อมูลเปิด-data-portal)
5. [การจัดการผู้ใช้](#5-การจัดการผู้ใช้)
6. [Admin Panel (UI Mockup)](#6-admin-panel-ui-mockup)
7. [โครงสร้างข้อมูล Firebase](#7-โครงสร้างข้อมูล-firebase)
8. [การ Deploy และ Hosting](#8-การ-deploy-และ-hosting)
9. [การแก้ปัญหาเบื้องต้น](#9-การแก้ปัญหาเบื้องต้น)

---

## 1. ภาพรวมระบบสำหรับผู้ดูแล

ผู้ดูแลระบบ (Admin) มีสิทธิ์เพิ่มเติมจากผู้ใช้ทั่วไปดังนี้:
- **จัดการชุดข้อมูล** — เพิ่ม/แก้ไข/ลบชุดข้อมูลใน Data Portal
- **จัดการผู้ใช้** — ดูรายชื่อผู้ใช้ทั้งหมด และเปลี่ยนสิทธิ์ (admin↔user)
- **Seed ข้อมูลเริ่มต้น** — เพิ่มชุดข้อมูลเริ่มต้น 8 รายการ

### ส่วนที่ Admin เข้าถึงได้
| เส้นทาง | ฟังก์ชัน | ต้องเป็น Admin? |
|:--------|:---------|:---------------|
| `/data-portal` | คลังข้อมูล + Admin Toolbar | Login เพื่อดู, Admin เพื่อจัดการ |
| `/data-portal/manage-users` | จัดการสิทธิ์ผู้ใช้ | ✅ Admin เท่านั้น |
| `/admin` | Dashboard (UI Mockup) | ❌ ไม่มี Auth Guard |
| `/admin/articles` | จัดการบทความ (UI Mockup) | ❌ ไม่มี Auth Guard |
| `/admin/reports` | จัดการรายงาน (UI Mockup) | ❌ ไม่มี Auth Guard |

> **หมายเหตุ**: หน้า `/admin/*` เป็น **UI Mockup** ที่แสดงข้อมูลตัวอย่าง (Hardcoded) ยังไม่เชื่อมต่อกับฐานข้อมูลจริง ส่วนที่ทำงานจริงคือ `/data-portal` และ `/data-portal/manage-users`

---

## 2. การเข้าสู่ระบบ

### 2.1 วิธีเข้าสู่ระบบ
1. ไปที่ `/login` หรือคลิกปุ่ม **"เข้าสู่ระบบ"** บน Header
2. คลิกปุ่ม **"เข้าสู่ระบบด้วย Google"**
3. เลือก Google Account ใน Popup
4. ระบบจะ Redirect ไปหน้า `/data-portal` อัตโนมัติ

### 2.2 การได้สิทธิ์ Admin
- **สิทธิ์ Admin คนแรก** — ผู้ใช้คนแรกที่ Login เข้าระบบจะได้รับสิทธิ์ `admin` โดยอัตโนมัติ (ระบบตรวจว่า Firestore collection `users` ยังไม่มี document ใดที่ `role == 'admin'`)
- **สิทธิ์ Admin เพิ่มเติม** — ผู้ใช้คนถัดไปจะได้สิทธิ์ `user` เสมอ Admin คนเดิมต้องไปเปลี่ยนสิทธิ์ให้ที่หน้า Manage Users

### 2.3 ตรวจสอบว่าตนเองเป็น Admin
- บน Header มุมขวาบน จะแสดง Badge สีน้ำเงิน **"ผู้ดูแลระบบ"** ข้างชื่อ
- Dropdown menu จะมีรายการ **"คลังข้อมูล"** → ไปหน้า `/data-portal`

### 2.4 ออกจากระบบ
- คลิก Avatar บน Header → เลือก **"ออกจากระบบ"**
- ระบบจะ Sign Out ผ่าน Firebase Auth และ Redirect กลับหน้าแรก

---

## 3. ระบบสิทธิ์ผู้ใช้

### 3.1 ระดับสิทธิ์
| Role | สิทธิ์ |
|:-----|:-------|
| `admin` | ดาวน์โหลดข้อมูล, เพิ่ม/แก้ไข/ลบชุดข้อมูล, Seed ข้อมูลเริ่มต้น, จัดการสิทธิ์ผู้ใช้ |
| `user` | ดาวน์โหลดข้อมูล, ดูชุดข้อมูลทั้งหมด |

### 3.2 วิธีกำหนดสิทธิ์
สิทธิ์ถูกเก็บใน Firestore document `users/{uid}` → field `role` (ค่า `"admin"` หรือ `"user"`)

ใน Code: `AuthContext.tsx` → `useAuth()` hook ให้ค่า `user`, `role`, `loading`

---

## 4. คลังข้อมูลเปิด (Data Portal)

### 4.1 เข้าถึง
เส้นทาง: `/data-portal` (ต้อง Login — ถ้ายังไม่ Login จะ Redirect ไป `/login`)

### 4.2 โครงสร้างหน้า
1. **Stats Row** — 4 Cards แสดง: ชุดข้อมูลทั้งหมด, ดาวน์โหลดได้ทันที, แหล่งข้อมูลภายนอก, จำนวนรูปแบบ
2. **Admin Toolbar** (Admin เท่านั้น): 
   - ปุ่ม **"เพิ่มชุดข้อมูล"** (สีเขียว)
   - ปุ่ม **"จัดการผู้ใช้"** → ไปหน้า `/data-portal/manage-users`
   - ปุ่ม **"รีเฟรช"** โหลดข้อมูลใหม่
3. **ข้อมูลโครงการ** (type=local) — Cards + ปุ่มดาวน์โหลด
4. **แหล่งข้อมูลภายนอก** (type=external) — Cards + ลิงก์เปิดใน Tab ใหม่

### 4.3 เพิ่มชุดข้อมูลใหม่
1. คลิก **"เพิ่มชุดข้อมูล"** → Modal ฟอร์มจะเปิด
2. กรอกข้อมูล:
   - **ชื่อชุดข้อมูล** (จำเป็น)
   - **คำอธิบาย** (จำเป็น)
   - **แหล่งข้อมูล** (จำเป็น)
   - **รูปแบบ** เช่น CSV, JSON, API
   - **URL** — ลิงก์ดาวน์โหลดหรือเว็บไซต์
   - **ไอคอน** — เลือกจาก 8 ตัวเลือก (Database, FileText, Globe, Map, BarChart3, Wind, Thermometer, Cloud)
   - **ประเภท** — `local` (ข้อมูลโครงการ) หรือ `external` (แหล่งภายนอก)
3. คลิก **"บันทึก"** → ข้อมูลจะถูกบันทึกลง Firestore collection `datasets`

### 4.4 แก้ไขชุดข้อมูล
1. Hover บน Card ของชุดข้อมูล → ปุ่มดินสอ (Pencil) จะปรากฏมุมบนขวา
2. คลิก → Modal ฟอร์มจะเปิดพร้อมข้อมูลเดิม
3. แก้ไขแล้วคลิก **"บันทึก"**

### 4.5 ลบชุดข้อมูล
1. Hover บน Card → ปุ่มถังขยะ (Trash) จะปรากฏ
2. คลิก → Confirmation modal "คุณแน่ใจหรือไม่ที่จะลบชุดข้อมูลนี้?"
3. คลิก **"ลบ"** → ข้อมูลจะถูกลบจาก Firestore

### 4.6 Seed ข้อมูลเริ่มต้น
กรณี Data Portal ว่างเปล่า (ไม่มีชุดข้อมูลเลย):
1. ระบบจะแสดง Empty State พร้อมปุ่ม **"เพิ่มชุดข้อมูลเริ่มต้น"**
2. คลิก → ระบบจะเพิ่ม 8 ชุดข้อมูลเริ่มต้น:

| # | ชื่อ | รูปแบบ | ประเภท |
|:--|:-----|:-------|:-------|
| 1 | ข้อมูลข่าว Thai PBS | CSV | local |
| 2 | ข้อมูลผลกระทบ PM2.5 รายจังหวัด | CSV | local |
| 3 | PM2.5 รายจังหวัด (GISTDA) | API | external |
| 4 | จุดความร้อน VIIRS (NASA FIRMS) | API | external |
| 5 | พยากรณ์อากาศ (Open-Meteo) | API | external |
| 6 | ข้อมูลคุณภาพอากาศ (กรมควบคุมมลพิษ) | Website | external |
| 7 | ข้อมูลไฟป่า (กรมอุทยานแห่งชาติฯ) | Website | external |
| 8 | ข้อมูลหมอกควัน (มช. CCDC) | Website | external |

---

## 5. การจัดการผู้ใช้

### 5.1 เข้าถึง
เส้นทาง: `/data-portal/manage-users` (Admin เท่านั้น — ถ้าสิทธิ์ไม่ใช่ admin จะ Redirect กลับไป `/data-portal`)

### 5.2 หน้าจอจัดการผู้ใช้
1. **Stats Row** — 3 Cards: ผู้ใช้ทั้งหมด, ผู้ดูแลระบบ, ผู้ใช้ทั่วไป
2. **Search Bar** — ค้นหาจากชื่อหรืออีเมล
3. **User List** — แสดงทุก User ที่ลงทะเบียน:
   - Avatar
   - ชื่อ
   - อีเมล
   - Badge สิทธิ์ (ส้ม = admin, เทา = user)
   - วันที่สมัคร
   - ปุ่มเปลี่ยนสิทธิ์

### 5.3 เปลี่ยนสิทธิ์ผู้ใช้
1. คลิกปุ่มที่แสดงสิทธิ์ปัจจุบัน ("เปลี่ยนเป็น admin" หรือ "เปลี่ยนเป็น user")
2. ระบบจะอัปเดต Firestore `users/{uid}` โดยทันที
3. สถานะจะเปลี่ยนแปลงบนหน้าจอทันที

### 5.4 ข้อจำกัด
- **ไม่สามารถลดสิทธิ์ตัวเอง** — ปุ่มเปลี่ยนสิทธิ์ของ Admin ที่กำลังใช้งานจะถูก Disable
- **ไม่มีฟังก์ชันลบ User** — สามารถเปลี่ยนสิทธิ์ได้เท่านั้น ไม่สามารถลบบัญชีผู้ใช้

---

## 6. Admin Panel (UI Mockup)

> ⚠️ **หมายเหตุสำคัญ**: หน้า Admin Panel (`/admin`, `/admin/articles`, `/admin/reports`) ทั้งหมดเป็น **UI Mockup** ที่แสดงข้อมูลตัวอย่าง (Hardcoded) อยู่เท่านั้น ปุ่มต่างๆ ยังไม่ทำงานจริง ไม่มีการเชื่อมต่อกับฐานข้อมูล

### 6.1 Admin Dashboard (`/admin`)
- แสดง 4 stat cards (124 บทความ, 12 รายงานรอ, 1,450 ผู้ใช้, 3,200 เข้าชม) — **ค่าคงตัว**
- กิจกรรมล่าสุด 3 รายการ — **ข้อมูลตัวอย่าง**

### 6.2 จัดการบทความ (`/admin/articles`)
- ตารางแสดง 3 บทความตัวอย่าง (Hardcoded)
- ปุ่ม "สร้างบทความ", "แก้ไข", "ลบ" — **ไม่ทำงานจริง**
- ค้นหาและกรองหมวดหมู่ — **ใช้กรองข้อมูล Hardcoded ได้**

### 6.3 จัดการรายงาน C-Site (`/admin/reports`)
- ตารางแสดง 3 รายงานตัวอย่าง (Hardcoded)
- Tab: รอดำเนินการ / อนุมัติแล้ว / ปฏิเสธ — **ใช้กรองข้อมูล Hardcoded ได้**
- ปุ่ม "ดู", "อนุมัติ", "ปฏิเสธ" — **ไม่ทำงานจริง**

---

## 7. โครงสร้างข้อมูล Firebase

### 7.1 Firebase Project
- Instance ชื่อ: `funfai-data-portal`
- Auth Provider: Google Sign-In

### 7.2 Firestore Collections

#### Collection: `users`
```
users/{uid}
├── email: string
├── displayName: string
├── photoURL: string
├── role: "admin" | "user"
└── createdAt: Timestamp
```

#### Collection: `datasets`
```
datasets/{auto-id}
├── name: string
├── description: string
├── source: string
├── format: string  (เช่น "CSV", "JSON", "API", "Website")
├── url: string
├── icon: string  (เช่น "Database", "FileText", "Globe")
├── type: "local" | "external"
├── createdBy: string  (uid)
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

---

## 8. การ Deploy และ Hosting

### 8.1 Firebase App Hosting
การ Deploy ผ่าน Firebase App Hosting:

```bash
# ติดตั้ง Dependencies
npm install

# Build (Next.js)
npm run build

# Deploy
firebase deploy
```

### 8.2 apphosting.yaml
ไฟล์กำหนดค่า Firebase App Hosting อยู่ที่ root directory

### 8.3 Environment Variables
ค่า Firebase Config ถูกกำหนดใน `lib/firebase.ts` (ในปัจจุบันค่าถูก Hardcode ในไฟล์)

---

## 9. การแก้ปัญหาเบื้องต้น

### 9.1 Login ไม่ได้
| ปัญหา | สาเหตุ | แก้ไข |
|:------|:-------|:------|
| Popup ถูกบล็อก | Browser block popup | เปิดอนุญาต Popup สำหรับเว็บไซต์นี้ |
| "เข้าสู่ระบบไม่สำเร็จ" | Firebase Auth Error | ตรวจ Firebase Console ว่า Google Sign-In เปิดใช้งาน |
| Login แล้วไม่มีสิทธิ์ Admin | ไม่ใช่คนแรกที่ Login | ให้ Admin คนเดิมเปลี่ยนสิทธิ์ที่ Manage Users |

### 9.2 Data Portal ว่าง
1. ตรวจว่า Login แล้ว
2. ตรวจสิทธิ์ว่าเป็น Admin
3. คลิก **"เพิ่มชุดข้อมูลเริ่มต้น"** เพื่อ Seed ข้อมูล 8 รายการ

### 9.3 ข้อมูล PM2.5 ไม่อัปเดต
- Dashboard ใช้ ISR (Incremental Static Regeneration) revalidate ทุก 3600 วินาที (1 ชม.)
- Forecast ใช้ In-memory cache TTL 1 ชม. ต่อจังหวัด
- **การ Redeploy** จะ Clear cache ทุกอัน

### 9.4 จุดความร้อนไม่แสดง
- API `/api/hotspots` ดึงจาก NASA FIRMS ต้องมี `MAP_KEY` ถูกต้อง
- ข้อมูลดึงย้อนหลัง 2 วัน (วันนี้และเมื่อวาน)
- ถ้า NASA server ล่ม → จุดความร้อนจะว่าง (API ส่ง Empty array)
