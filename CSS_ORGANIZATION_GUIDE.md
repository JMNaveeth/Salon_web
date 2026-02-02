# CSS File Organization Guide - Kinniya Salon

## Current Structure Overview

Your `style.css` file is now organized into the following page-wise sections:

---

## 📋 TABLE OF CONTENTS

### 1. **BASE & RESET STYLES** (Lines ~1-160)
- CSS Reset
- Root Variables (Colors, Fonts, Shadows)
- Body Styles
- Dark Mode Styles
- Custom Cursor (Disabled)
- Theme Toggle Button
- Container Styles

### 2. **GLOBAL COMPONENTS** (Lines ~160-1460)
#### Navigation (Lines ~160-270)
- `.navbar` - Main navigation bar
- `.nav-container` - Navigation wrapper
- `.nav-logo` - Logo styles
- `.nav-menu` - Menu items
- `.nav-link` - Navigation links
- `.hamburger` - Mobile menu icon

#### Buttons (Lines ~270-350)
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary button
- `.btn-ghost` - Transparent button

#### Footer (Lines ~1350-1460)
- `.footer` - Footer section
- `.footer-wave` - Wave decoration
- `.footer-content` - Footer grid
- `.social-links` - Social media icons

---

### 3. **HOME PAGE STYLES** (Lines ~350-1230)

#### Hero Section (Lines ~350-650)
- `.hero` - Hero container
- `.hero-3d-container` - 3D background
- `.floating-orb` - Animated orbs
- `.hero-container` - Content grid
- `.hero-content` - Text content
- `.hero-badge` - Badge element
- `.hero-title` - Main heading
- `.highlight` - Highlighted text
- `.hero-description` - Subtitle
- `.hero-buttons` - CTA buttons
- `.hero-stats` - Statistics cards
- `.hero-visual-container` - Visual elements
- `.hero-photo` - Shop owner photo

#### Section Headers (Lines ~650-710)
- `.section-header` - Section wrapper
- `.section-tag` - Section badge
- `.section-title` - Section heading
- `.section-subtitle` - Section description

#### Salon Directory (Lines ~710-890)
- `.salon-directory` - Directory section
- `.salon-grid` - Cards grid
- `.salon-card` - Individual salon card
- `.salon-meta` - Metadata
- `.badge` - Status badges
- `.salon-stats` - Statistics display

#### How It Works (Lines ~890-1000)
- `.how-it-works` - Section container
- `.how-grid` - Steps grid
- `.how-card` - Step card
- `.how-icon-wrapper` - Icon container
- `.how-step-number` - Step number badge

#### Slots Section (Lines ~1000-1110)
- `.slots` - Slots container
- `.slot-grid` - Time slots grid
- `.slot-card` - Slot card
- `.slot-time` - Time button

#### Contact Section (Lines ~1110-1230)
- `.contact-preview` - Contact section
- `.contact-grid` - Content grid
- `.contact-info` - Contact information
- `.contact-form` - Contact form
- `.form-group` - Form fields

#### Admin Modal (Lines ~1230-1350)
- `.admin-gate` - Modal overlay
- `.admin-gate__dialog` - Modal content
- `.admin-gate__form` - Login form

---

### 4. **SERVICES PAGE STYLES** (Lines ~1630-2390)

#### Services Hero (Lines ~1630-1665)
- `.services-hero-section` - Hero section
- `.services-hero-section .hero-placeholder` - Placeholder icon
- `.services-hero-section .hero-photo` - Owner photo

#### Services Main Section (Lines ~1665-1685)
- `.services-main-section` - Main container
- `.services-page-header` - Page header

#### Filter Bar (Lines ~1685-1780)
- `.services-filter-bar` - Filter container
- `.filter-controls` - Control buttons
- `.filter-tabs` - Category tabs
- `.filter-tab` - Individual tab
- `.services-search` - Search box
- `.price-filter select` - Price dropdown
- `.sort-options select` - Sort dropdown

#### Service Categories (Lines ~1780-1860)
- `.service-category-section` - Category container
- `.category-header` - Category title
- `.category-icon` - Category icon
- `.services-list` - Services grid

#### Service Items (Lines ~1860-2120)
- `.service-item` - Service card
- `.service-item-icon` - Service icon
- `.service-item-content` - Card content
- `.service-item-header` - Card header
- `.service-item-price` - Price display
- `.service-description` - Description text
- `.service-features` - Feature tags
- `.feature-tag` - Individual feature
- `.service-item-footer` - Card footer
- `.service-rating` - Rating stars
- `.btn-book` - Booking button

#### Package Services (Lines ~2120-2150)
- `.package-services` - Package list
- `.package-price` - Package pricing
- `.old-price` - Original price
- `.new-price` - Discounted price

---

### 5. **GALLERY PAGE STYLES** (Lines ~2400-2740)

#### Gallery Hero (Lines ~2400-2540)
- `.gallery-hero` - Hero section
- `.gallery-hero-bg` - Background shapes
- `.hero-shape` - Animated shapes
- `.gallery-hero-content` - Hero content
- `.hero-stats` - Statistics cards

#### Gallery Section (Lines ~2540-2600)
- `.gallery-section` - Main gallery
- `.gallery-filter` - Filter buttons
- `.filter-btn` - Filter button
- `.gallery-showcase` - Gallery grid

#### Gallery Items (Lines ~2600-2720)
- `.gallery-item` - Gallery item
- `.gallery-card` - Card container
- `.gallery-placeholder` - Placeholder icon
- `.gallery-overlay` - Hover overlay
- `.gallery-info` - Card info
- `.gallery-btn` - Action button
- `.customer-work-badge` - Customer work badge

#### Gallery CTA (Lines ~2720-2740)
- `.gallery-cta` - CTA section
- `.cta-content` - CTA content
- `.cta-buttons` - CTA buttons

---

### 6. **BOOKING PAGE STYLES** (Lines ~2740-2900)
*Note: Booking styles are integrated with other sections*
- Uses global form styles
- Uses global button styles
- Custom booking calendar styles (if added)

---

### 7. **ADMIN PANEL STYLES** (Lines ~2900-3600)

#### Admin Layout (Lines ~2900-3000)
- `.admin-layout` - Main layout
- `.admin-sidebar` - Sidebar navigation
- `.admin-main` - Main content area
- `.admin-content` - Content sections

#### Admin Components (Lines ~3000-3200)
- `.stat-card` - Statistics card
- `.activity-item` - Activity feed item
- `.admin-table` - Data table
- `.service-admin-card` - Service card
- `.staff-admin-card` - Staff card

#### Admin Forms (Lines ~3200-3400)
- `.settings-form` - Settings form
- `.form-section` - Form section
- `.form-group` - Form field
- `.form-actions` - Form buttons

#### Admin Actions (Lines ~3400-3600)
- `.btn-icon` - Icon button
- `.actions-cell` - Action buttons cell
- `.recent-activity` - Activity feed

---

### 8. **RESPONSIVE & MEDIA QUERIES** (Lines ~1460-1630, 2150-2400)

#### Desktop (max-width: 1024px)
- Adjusted hero layout
- Modified grid columns
- Reduced font sizes

#### Tablet (max-width: 768px)
- Single column layouts
- Mobile navigation
- Hamburger menu
- Adjusted spacing

#### Mobile (max-width: 480px)
- Minimum padding
- Smaller text
- Stacked buttons
- Compact forms

---

## 🎨 Color Variables Reference

```css
--primary: #D4AF37         /* Gold */
--primary-dark: #B8941F    /* Dark Gold */
--primary-light: #E8D090   /* Light Gold */
--secondary: #2C3E50       /* Dark Blue */
--accent: #E74C3C          /* Red */
--dark: #1A1A1A           /* Almost Black */
--text: #333333           /* Dark Gray */
--text-light: #666666     /* Light Gray */
--bg: #FFFFFF             /* White */
--bg-light: #F8F9FA       /* Light Gray */
```

---

## 📁 Quick Navigation by Page

| Page | Section in CSS | Line Range |
|------|---------------|------------|
| **Home** | Hero, Salons, How It Works, Slots | 350-1230 |
| **Services** | Filter, Categories, Service Cards | 1630-2390 |
| **Gallery** | Hero, Filter, Gallery Grid, CTA | 2400-2740 |
| **Booking** | Forms, Calendar (integrated) | 2740-2900 |
| **Admin** | Layout, Sidebar, Dashboard, Forms | 2900-3600 |
| **Global** | Base, Navigation, Buttons, Footer | 1-350, 1350-1460 |
| **Responsive** | Media Queries | 1460-1630, 2150-2400 |

---

## 🔧 How to Find Styles

### By Component:
1. **Navigation** → Lines 160-270
2. **Buttons** → Lines 270-350
3. **Forms** → Lines 1185-1230, 3200-3400
4. **Cards** → Multiple sections (Salon: 730-880, Service: 1860-2120, Gallery: 2600-2720)
5. **Modal** → Lines 1230-1350

### By Page:
1. Open `style.css`
2. Use **Ctrl+F** to search for page name (e.g., "SERVICES PAGE", "GALLERY PAGE")
3. Navigate to the section

---

## ✅ Best Practices

1. **Keep sections organized** - Don't mix page-specific styles
2. **Use clear comments** - Add descriptive section headers
3. **Group related styles** - Keep component styles together
4. **Maintain alphabetical order** - Within sections when possible
5. **Document custom colors** - Use CSS variables for consistency

---

**Last Updated:** February 2, 2026
**Total Lines:** ~3,600
**File Size:** ~120KB
