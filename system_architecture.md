# System Architecture

This document describes the technical architecture of the "ทันฝุ่น ทันไฟ" platform.

## 1. Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **UI Library:** React 19
*   **Styling:** Tailwind CSS v4
*   **Icons:** Lucide React
*   **Data Visualization (Charts):** Recharts
*   **Mapping:** React-Leaflet (Leaflet.js)
*   **Language:** TypeScript

## 2. Directory Structure

```text
/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin Panel routes (Layout, Dashboard, Articles, Reports)
│   ├── article/[id]/       # Dynamic route for Long-form journalism
│   ├── login/              # User authentication page
│   ├── report/             # C-Site citizen reporting form
│   ├── globals.css         # Global styles and Tailwind theme config
│   ├── layout.tsx          # Root layout (Font setup, HTML structure)
│   └── page.tsx            # Main landing page (Assembles components)
├── components/             # Reusable React Components
│   ├── AdminSidebar.tsx    # Sidebar navigation for Admin panel
│   ├── ContentHub.tsx      # Article grid, search, and category tabs
│   ├── DashboardSection.tsx# PM 2.5 Data visualization (Chart, Table, Map wrapper)
│   ├── FeatureCards.tsx    # 3 Main entry point cards
│   ├── Footer.tsx          # Global footer
│   ├── Header.tsx          # Global navigation bar
│   ├── Hero.tsx            # Main hero section
│   └── Map.tsx             # Leaflet map component (Dynamically imported)
├── public/                 # Static assets
└── project config files    # package.json, next.config.ts, tailwind/postcss configs
```

## 3. Data Flow & State Management

### 3.1 Current State (Alpha/Frontend Phase)
*   **Real-time Data:** The `DashboardSection` fetches live PM 2.5 data from the **Open-Meteo Air Quality API** (`https://air-quality-api.open-meteo.com/v1/air-quality`). It retrieves the last 24 hours of data for Chiang Mai.
*   **Fallback Data:** If the API fails, the system automatically generates a randomized 24-hour mockup dataset to ensure the UI remains functional.
*   **Content Data:** Articles, reports, and knowledge hub items are currently hardcoded as JSON arrays within the components (`ContentHub.tsx`, `admin/articles/page.tsx`).

### 3.2 Client vs. Server Components
*   Most UI components that require interactivity (`useState`, `useEffect`, Leaflet maps, Recharts) are marked with `'use client'`.
*   Leaflet maps (`Map.tsx`) are imported dynamically using `next/dynamic` with `ssr: false` to prevent window/document undefined errors during Server-Side Rendering.
*   Pages like `/article/[id]/page.tsx` utilize Server Components to parse URL parameters before rendering the client UI.

## 4. Future Backend Integration (Phase 2 Roadmap)

To fully realize the TOR, the following architecture should be implemented in the next phase:

1.  **Database:** PostgreSQL (via Prisma or Drizzle ORM) or a NoSQL solution like Firebase/Firestore to store:
    *   Users & Roles (Admin, Citizen, Journalist)
    *   Articles (Long-form, Media, Knowledge)
    *   C-Site Reports (Location, Description, Image URLs, Status)
2.  **Authentication:** NextAuth.js (Auth.js) or Firebase Authentication for secure login and role-based access control (RBAC) for the `/admin` routes.
3.  **Storage:** AWS S3, Google Cloud Storage, or Firebase Storage to handle image uploads from the `/report` page.
4.  **Custom API Routes:** Next.js Route Handlers (`/app/api/...`) to serve data from the database to the frontend securely.
