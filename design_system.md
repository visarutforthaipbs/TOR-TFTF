# Design System & UI Guidelines

This document outlines the design system for the "ทันฝุ่น ทันไฟ" platform to ensure consistency when building new components.

## 1. Color Palette

The color palette is defined in `app/globals.css` using Tailwind CSS v4 `@theme`.

*   **Primary (สีส้มสด - Vibrant Orange):** `var(--color-primary)` / `#F26522`
    *   *Usage:* Hero section background, primary call-to-action (CTA) buttons, active states, critical alerts.
*   **Primary Dark:** `var(--color-primary-dark)` / `#d95516`
    *   *Usage:* Hover states for primary buttons.
*   **Secondary (สีพีช - Soft Peach):** `var(--color-secondary)` / `#F9E5E0`
    *   *Usage:* Highlight backgrounds, secondary card backgrounds, subtle accents.
*   **Text Main (สีเทาเข้ม):** `var(--color-text-main)` / `#1f2937` (Gray-800)
    *   *Usage:* Main headings (h1, h2, h3), primary body text for high readability.
*   **Text Muted (สีเทาอ่อน):** `var(--color-text-muted)` / `#4b5563` (Gray-600)
    *   *Usage:* Subtitles, descriptions, metadata (dates, authors), secondary text.
*   **Background Light:** `var(--color-bg-light)` / `#f9fafb` (Gray-50)
    *   *Usage:* Main application background, section backgrounds to separate content from white cards.

## 2. Typography

*   **Font Family:** `Kanit` (Google Font) - A modern, sans-serif Thai font.
*   **Weights:**
    *   Light (300)
    *   Regular (400) - Standard body text.
    *   Medium (500) - Subheadings, buttons.
    *   SemiBold (600) - Card titles.
    *   Bold (700) - Main section headers, Hero text.

## 3. UI Components & Styling Rules

### 3.1 Cards (Layout)
*   **Shape:** Use rounded corners (`rounded-2xl` or `rounded-xl`) for a friendly, modern look.
*   **Shadows:** Use subtle shadows (`shadow-sm` or `shadow-md`) to lift cards off the light gray background. Add `hover:shadow-lg` for interactive cards.
*   **Borders:** Use light borders (`border border-gray-100` or `border-gray-200`) for definition.

### 3.2 Buttons
*   **Primary Buttons:** `bg-primary text-white rounded-lg` (or `rounded-full` for hero/nav) with `hover:bg-primary-dark transition-colors`.
*   **Secondary/Outline Buttons:** `bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary`.

### 3.3 Icons
*   Always use `lucide-react` for icons.
*   Standard size: `w-5 h-5` or `w-6 h-6`.
*   Color: Usually `text-primary` for decorative icons, or `text-gray-500` for utility icons.

## 4. Layout & Responsiveness
*   **Mobile-First:** Write base Tailwind classes for mobile, then use `md:` (tablet) and `lg:` (desktop) prefixes.
*   **Container:** Use `container mx-auto max-w-6xl px-4` to constrain content width on large screens and provide padding on mobile.
*   **Spacing:** Use generous padding (`py-12` or `py-16`) between major sections to let the design breathe.
