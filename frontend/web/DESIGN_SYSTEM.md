# FutureSkillsSyntax Design System

A comprehensive design system for building consistent, accessible, and beautiful user interfaces.

---

## Color Palette

### Primary Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `primary` | `#6366f1` | `#818cf8` | Main brand color, CTAs, links |
| `primary-50` | `#eef2ff` | - | Backgrounds, hover states |
| `primary-100` | `#e0e7ff` | - | Subtle backgrounds |
| `primary-500` | `#6366f1` | - | Default primary |
| `primary-600` | `#4f46e5` | - | Hover state |
| `primary-700` | `#4338ca` | - | Active state |

### Secondary Colors
| Token | Value | Usage |
|-------|-------|-------|
| `purple-500` | `#a855f7` | Gamification, achievements |
| `pink-500` | `#ec4899` | Highlights, celebrations |
| `indigo-500` | `#6366f1` | Alternate primary |

### Semantic Colors
| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#22c55e` | Success states, positive feedback |
| `warning` | `#f59e0b` | Warnings, caution states |
| `error` | `#ef4444` | Errors, destructive actions |
| `info` | `#3b82f6` | Informational messages |

### Neutral Colors
| Token | Light | Dark |
|-------|-------|------|
| `gray-50` | `#f9fafb` | `#111827` |
| `gray-100` | `#f3f4f6` | `#1f2937` |
| `gray-200` | `#e5e7eb` | `#374151` |
| `gray-300` | `#d1d5db` | `#4b5563` |
| `gray-400` | `#9ca3af` | `#6b7280` |
| `gray-500` | `#6b7280` | `#9ca3af` |
| `gray-600` | `#4b5563` | `#d1d5db` |
| `gray-700` | `#374151` | `#e5e7eb` |
| `gray-800` | `#1f2937` | `#f3f4f6` |
| `gray-900` | `#111827` | `#f9fafb` |

---

## Typography

### Font Family
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Font Sizes
| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 16px | Captions, labels |
| `text-sm` | 14px | 20px | Secondary text, metadata |
| `text-base` | 16px | 24px | Body text |
| `text-lg` | 18px | 28px | Large body, subheadings |
| `text-xl` | 20px | 28px | Section titles |
| `text-2xl` | 24px | 32px | Page subheadings |
| `text-3xl` | 30px | 36px | Page titles |
| `text-4xl` | 36px | 40px | Hero titles |
| `text-5xl` | 48px | 48px | Display text |

### Font Weights
| Token | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, buttons |
| `font-semibold` | 600 | Subheadings, emphasis |
| `font-bold` | 700 | Headings, strong emphasis |

---

## Spacing

Based on 4px grid system:

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-0` | 0px | - |
| `spacing-1` | 4px | Tight spacing |
| `spacing-2` | 8px | Icon gaps, inline spacing |
| `spacing-3` | 12px | Form field gaps |
| `spacing-4` | 16px | Card padding, section gaps |
| `spacing-5` | 20px | - |
| `spacing-6` | 24px | Component spacing |
| `spacing-8` | 32px | Section padding |
| `spacing-10` | 40px | - |
| `spacing-12` | 48px | Large sections |
| `spacing-16` | 64px | Page sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0px | No rounding |
| `rounded-sm` | 2px | Subtle rounding |
| `rounded` | 4px | Default |
| `rounded-md` | 6px | Inputs, cards |
| `rounded-lg` | 8px | Cards, modals |
| `rounded-xl` | 12px | Large cards |
| `rounded-2xl` | 16px | Prominent cards |
| `rounded-3xl` | 24px | Hero sections |
| `rounded-full` | 9999px | Avatars, pills |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1)` | Default cards |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Dropdowns |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Large modals |
| `shadow-2xl` | `0 25px 50px rgba(0,0,0,0.25)` | Hero elements |

---

## Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Wide screens |

---

## Animation

### Duration
| Token | Value | Usage |
|-------|-------|-------|
| `duration-75` | 75ms | Micro-interactions |
| `duration-100` | 100ms | Fast hover |
| `duration-150` | 150ms | Default hover |
| `duration-200` | 200ms | Moderate transitions |
| `duration-300` | 300ms | Larger transitions |
| `duration-500` | 500ms | Page transitions |
| `duration-700` | 700ms | Complex animations |
| `duration-1000` | 1000ms | Slow reveal |

### Easing
| Token | Value | Usage |
|-------|-------|-------|
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric transitions |
| `spring` | `type: "spring", stiffness: 300, damping: 25` | Natural motion |

---

## Touch Targets

Minimum sizes for accessibility:

| Platform | Minimum Size |
|----------|--------------|
| Mobile | 44px × 44px |
| Desktop | 32px × 32px |

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `z-0` | 0 | Base layer |
| `z-10` | 10 | Raised content |
| `z-20` | 20 | Dropdowns |
| `z-30` | 30 | Sticky headers |
| `z-40` | 40 | Popovers |
| `z-50` | 50 | Modals |
| `z-60` | 60 | Notifications |
| `z-70` | 70 | Tooltips |
| `z-9999` | 9999 | Maximum overlay |

---

## Icon Sizes

| Token | Size | Usage |
|-------|------|-------|
| `icon-xs` | 12px | Inline icons |
| `icon-sm` | 16px | Small buttons |
| `icon-md` | 20px | Default |
| `icon-lg` | 24px | Navigation |
| `icon-xl` | 32px | Feature icons |
| `icon-2xl` | 48px | Illustrations |
