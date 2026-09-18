# Product Requirements Document (PRD)
## SquadGear Frontend Redesign - Inspired by Awkwardx Store

**Reference**: Awkwardx Store (awkwardxstore.com)  
**Date**: September 19, 2026  
**Project**: SquadGear Web E-commerce Platform  
**Objective**: Redesign frontend with Awkwardx-inspired streetwear aesthetic while maintaining backend compatibility

---

## 1. Executive Summary

Redesign the SquadGear Web frontend to adopt a premium streetwear aesthetic inspired by Awkwardx Store, featuring clean minimalism, urban/pop-culture influences, and enhanced user experience. The redesign will maintain full compatibility with the existing FastAPI backend while implementing modern UI/UX patterns observed in Awkwardx's implementation.

---

## 2. Design Language & Visual System

### 2.1 Overall Aesthetic
- **Style**: Clean, minimalist streetwear with urban and pop-culture/anime influences
- **Layout Philosophy**: Generous whitespace, clear visual hierarchy, grid-based layouts
- **Imagery Style**: High-contrast product photography with consistent styling
- **Brand Expression**: Prominent brand messaging sections integrated throughout

### 2.2 Color System
- **Primary**: Adapt SquadGear's existing brand colors (to be verified from current implementation)
- **Neutrals**: Clean whites, dark charcoals for text, light greys for backgrounds
- **Accents**: Use for sale badges, promotional elements, interactive states
- **Implementation**: Maintain existing Tailwind color configuration from current SquadGear frontend

### 2.3 Typography
- **Headings**: Bold, impactful sans-serif for brand messaging and section titles
- **Body**: Highly readable sans-serif for product details and descriptions
- **Utility**: Text transform (uppercase) for buttons, badges, and promotional elements
- **Implementation**: 
  - Add Google Fonts: Bebas Neue (for display/impact) and Montserrat (for UI/text)
  - Retain Anybody for Admin Dashboard compatibility
  - Create Tailwind font families: `display` (Bebas Neue), `ui` (Montserrat), preserve existing `label-*`, `headline-*`, `body-*` for Admin

### 2.4 Spacing & Layout
- **Base Unit**: 8px spacing system
- **Key Tokens**:
  - `section-y`: 96px (desktop vertical padding)
  - `section-y-mobile`: 56px (mobile vertical padding)
  - `gutter`: 24px (horizontal spacing between elements)
  - `margin-desktop`: 48px
  - `margin-mobile`: 16px
  - `max-width`: 1280px
- **Implementation**: Extend existing Tailwind spacing configuration

### 2.5 Component Styling Patterns
- **Buttons**: 
  - Three variants: primary (solid), secondary (outline), tertiary (text/link)
  - Consistent padding, radius, typography (uppercase, letter spacing)
  - Hover/active states with subtle transitions
  - Disabled states with reduced opacity
  
- **Product Cards**:
  - Image container with aspect ratio preservation
  - Product name (link to detail page)
  - Price display: sale price prominent, regular price strikethrough when applicable
  - Discount badge: "Save Rs. X.XX" or percentage-based
  - Status badges: "New", "Sale", "Sold Out"
  - Action buttons: "View" and "Choose options" (for variants)
  - Hover effects: image swap or zoom, subtle elevation

- **Sections**:
  - Clear heading hierarchy (H2 for section titles)
  - Consistent vertical padding
  - Grid-based content layout (products, links, etc.)
  - Promotional banners with brand messaging

- **Badges/Labels**:
  - Consistent pill-shaped design
  - Variants: sale (prominent color), new (secondary), sold-out (muted)
  - Text transform: uppercase, letter spacing
  - Small text size with adequate padding

---

## 3. Page Structure & Components

### 3.1 Header (Persistent)
- **Elements**:
  - Logo (top-left)
  - Search bar (prominent, centered)
  - Navigation menu (desktop: horizontal dropdown; mobile: hamburger → drawer)
  - Cart indicator (icon + item count)
  - User account/login link
  - Social media icons (secondary)
- **Behavior**:
  - Sticky on scroll (optional, based on performance)
  - Mobile menu: off-canvas drawer from left/right
  - Dropdown menus: hover on desktop, tap to expand on mobile
  - Search: opens dedicated search page or inline results

### 3.2 Footer
- **Elements**:
  - Brand mission/value statements (3-4 columns)
  - Quick links: About, Contact, FAQ, Shipping, Returns
  - Social media links
  - Newsletter signup (optional)
  - Legal: Terms, Privacy, Copyright
  - Payment method icons
- **Layout**: Column-based on desktop, stacked on mobile

### 3.3 Homepage
- **Sections** (in order):
  1. **Promotional Banner**: Clearance/New arrivals promotions
  2. **Free Shipping Threshold**: Prominent display of current threshold
  3. **Brand Messaging**: 2-3 rotating impact statements (Awkwardx-style)
  4. **Product Categories**: Special Price, Summer Tops, Winter Tops, Bottoms, Women, Value Sets (with dropdowns in nav)
  5. **Featured Collections**: Grid layout with collection images and "Shop Now" buttons
  6. **Bestsellers/New Arrivals**: Product grid with cards
  7. **Additional Brand Sections**: Lifestyle imagery with minimal text overlays
  8. **Instagram Feed** (optional, if API available)
  9. **Footer**

### 3.4 Product Listing/Collection Page
- **Layout**:
  - Filter sidebar (optional, based on backend capabilities)
  - Sort dropdown (featured, price low-high, price high-low, newest)
  - Product grid (3-4 columns desktop, 2 columns tablet, 1 column mobile)
  - Pagination or infinite scroll
- **Product Card** (same as homepage):
  - Image (with hover swap for alternate view if available)
  - Name
  - Price: sale + strikethrough regular + "Save X" badge
  - Status badges (top-left corner)
  - Action buttons: "View" (always), "Choose options" (if variants exist)
  - Sold-out overlay and disabled state

### 3.5 Product Detail Page
- **Layout**:
  - Left: Image gallery (main thumbnail + slider for alternate images)
  - Right: Product information column
    - Product name
    - Price (same format as cards)
    - Variant selectors (size, color, etc.) - if applicable
    - Quantity selector
    - Add to Cart button (primary)
    - Buy Now button (secondary, links to checkout)
    - Short description
    - Detailed description tab (expandable/collapsible)
    - Shipping & returns info
    - Related products section (bottom)
- **Special Features**:
  - Image zoom on hover/click
  - Variant-based price/image updates
  - Stock status indication
  - SKU display (small, bottom)

### 3.6 Cart Page ("Your Locker" - maintaining SquadGear terminology)
- **Layout**:
  - Cart items list (each with remove/edit options)
  - Item: thumbnail, name, variants, quantity, price, total
  - Subtotal section
  - Discount code field
  - Shipping estimate
  - Order total
  - Proceed to Checkout button (primary)
  - Continue Shopping button (secondary)
- **Special Features**:
  - Real-time quantity updates
  - Item removal with undo option
  - Save for later functionality (optional)
  - Shipping calculator (enter postal code)

### 3.7 Checkout Process
- **Steps** (accordion or stepper):
  1. Contact Information (email, phone)
  2. Shipping Address
  3. Payment Method
  4. Review & Place Order
- **Design**: Clean, focused, minimal distractions
- **Security**: SSL indicators, trusted payment badges
- **Implementation**: Maintain existing `/api/checkout` and `/api/payfast/itn` endpoints

### 3.8 Authentication Pages (Login, Signup, Portal)
- **Layout**: Centered form on simple background
- **Fields**: Email, password, name (for signup), etc.
- **Features**:
  - Social login options (if implemented in backend)
  - Password strength indicator (signup)
  - "Forgot password" link
  - Clear validation and error states
- **Maintain**: Existing OTP email verification flow

### 3.9 Admin Dashboard (Preserve Existing)
- **Note**: Per original constraints, Admin Dashboard (`/admin`) should retain its current neumorphic appearance and functionality
- **Implementation**: Ensure new global styles (fonts, etc.) don't override Admin-specific styles
- **Approach**: Use careful CSS scoping or !important where necessary for Admin components

---

## 4. Key Functional Requirements

### 4.1 Product Discovery
- **Grid/List Views**: Toggle between grid (default) and list views for product listings
- **Filtering**: By category, price range, availability (if supported by backend)
- **Sorting**: Featured, price (low-high, high-low), newest, alphabetical
- **Search**: Real-time suggestions, typo tolerance, recent searches
- **Quick View**: Optional modal for product details without leaving listing page

### 4.2 Product Interaction
- **Image Gallery**: Main image with thumbnail navigation, zoom capability
- **Variant Selection**: Size, color, etc. with visual feedback
- **Stock Status**: Clear indication of availability, low stock warnings
- **Wishlist**: Save products for later (requires backend extension)
- **Recently Viewed**: Track and display recently viewed products

### 4.3 Cart & Checkout
- **Ajax Cart Updates**: No page reload on add/remove/update
- **Cart Persistence**: Persist cart across sessions (localStorage or backend)
- **Free Shipping Progress**: Dynamic indicator showing amount needed for free shipping
- **Cart Drawer**: Slide-out mini-cart (accessible via header icon)
- **Multiple Addresses**: Support for shipping to different addresses
- **Order Notes**: Field for special instructions during checkout

### 4.4 User Experience
- **Mobile First**: All designs work perfectly on mobile (320px+) and scale up
- **Accessibility**: WCAG 2.1 AA compliance (color contrast, keyboard navigation, ARIA labels)
- **Performance**: Optimized images, lazy loading, minimal JS bundle
- **Feedback**: Loading states, success/error messages, form validation
- **Trust Signals**: Security badges, shipping info, return policy links visible throughout

---

## 5. Technical Implementation Guidelines

### 5.1 Technology Stack
- **Framework**: React 19 (maintain current)
- **Build Tool**: Vite (maintain current)
- **Language**: TypeScript (maintain current)
- **Styling**: Tailwind CSS (extend current configuration)
- **State Management**: React Context (maintain AuthContext, extend CartContext)
- **Routing**: React Router DOM (maintain current)
- **Icons**: Lucide React (maintain current)

### 5.2 Component Architecture
- **Atomic Design Approach**:
  - **Atoms**: Buttons, inputs, labels, badges, icons
  - **Molecules**: Product cards, search bar, navbar items
  - **Organisms**: Header, footer, product grid, cart drawer
  - **Templates**: Page layouts (home, product listing, product detail, etc.)
  - **Pages**: Specific page implementations
- **Reusability**: Create highly reusable, props-driven components
- **Consistency**: Use design tokens (colors, spacing, typography) exclusively

### 5.3 State Management
- **AuthContext**: Extend to store user preferences if needed
- **CartContext**: 
  - Maintain current item-based state
  - Add: drawer open/close state, cart persistence logic
  - Consider: migrating to Zustand or Redux Toolkit if complexity increases (but Context should suffice for cart)
- **Product State**: Consider React Query or SWR for data fetching/cache if product catalog grows large

### 5.4 API Integration
- **Maintain Contracts**: All existing backend endpoints (`/api/*`) must continue to work
- **New Endpoints**: Only add if absolutely necessary (prefer extending existing)
- **Data Mapping**: Transform backend DTOs to frontend UI models as needed
- **Error Handling**: Consistent error states, retry mechanisms, user-friendly messages
- **Loading States**: Skeletons or spinners for all async operations

### 5.5 Performance Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: 
  - Use next-gen formats (WebP) where possible
  - Implement lazy loading with Intersection Observer
  - Use responsive images (`srcset`) for different screen sizes
- **CSS Optimization**: Purge unused Tailwind classes in production
- **JS Minification**: Ensure production build is minified
- **Critical CSS**: Consider inlining above-the-fold styles

### 5.6 Testing & Quality Assurance
- **Type Safety**: Strict TypeScript usage (no `any` unless absolutely necessary)
- **Component Testing**: Unit tests for complex logic (if test framework added)
- **E2E Testing**: Consider Cypress or Playwright for critical paths (auth, cart, checkout)
- **Manual Testing**: Comprehensive device/browser testing matrix
- **Performance Budgets**: Set Lighthouse performance targets

---

## 6. Implementation Plan (Phased Approach)

### Phase 1: Foundation & Core Components (Weeks 1-2)
- [ ] Extend Tailwind config with new tokens (fonts, sizes, spacing)
- [ ] Add Google Fonts to index.html
- [ ] Create `.text-shout` utility class
- [ ] Build atomic components: Button, Badge, Typography
- [ ] Create molecular components: ProductCard, SectionHeading, PromoBar
- [ ] Implement basic layout components: Header, Footer, Layout wrapper
- [ ] Type-check and lint all new components

### Phase 2: Page Templates & Navigation (Weeks 3-4)
- [ ] Create page templates: Home, ProductListing, ProductDetail, Cart, Checkout
- [ ] Implement navigation system: desktop dropdown, mobile drawer
- [ ] Build search functionality (backend-connected)
- [ ] Create authentication pages (Login, Signup, Portal) - maintain existing flow
- [ ] Implement CartContext enhancements (drawer state, persistence)
- [ ] Verify Admin Dashboard still works correctly

### Phase 3: Product Features & Interactions (Weeks 5-6)
- [ ] Implement product detail page with image gallery
- [ ] Add variant selection logic (size, color, etc.)
- [ ] Create wishlist and recently viewed features (if backend supports)
- [ ] Implement ajax cart updates
- [ ] Add free shipping progress indicator
- [ ] Implement product listing filters and sorts
- [ ] Add hover effects, image zoom, and interactive states

### Phase 4: Checkout & Optimization (Weeks 7-8)
- [ ] Implement/checkout flow steps (address, payment, review)
- [ ] Integrate with existing `/api/checkout` and payfast webhook
- [ ] Add order confirmation page
- [ ] Performance optimization: lazy loading, code splitting
- [ ] Accessibility audit and fixes
- [ ] Cross-browser and device testing
- [ ] SEO optimization: meta tags, structured data

### Phase 5: Polish & Launch (Week 9)
- [ ] Final QA against Awkwardx inspiration points
- [ ] Brand customization: replace placeholder content with SquadGear specifics
- [ ] Load testing and performance tuning
- [ ] Documentation update for new components
- [ ] User acceptance testing
- [ ] Production deployment

---

## 7. Success Metrics

### 7.1 Quantitative
- **Page Load Time**: < 2s on 3G, < 1s on broadband (LCP metric)
- **Conversion Rate**: Maintain or improve baseline
- **Cart Abandonment**: Reduce by 10%+ compared to baseline
- **Mobile Usability**: > 90% success rate in mobile task completion
- **Accessibility Score**: WCAG 2.1 AA compliance (> 90% on axe audit)

### 7.2 Qualitative
- **Design Consistency**: 95%+ component reuse rate
- **User Feedback**: Positive reception in usability testing
- **Brand Perception**: Enhanced premium/streetwear perception
- **Admin Compatibility**: Zero regressions in Admin Dashboard functionality
- **Developer Experience**: Clear component documentation and patterns

---

## 8. Risks & Mitigations

### 8.1 Design Risks
- **Risk**: New aesthetic conflicts with established brand identity
  - **Mitigation**: SquadGear team reviews and approves moodboard before implementation
- **Risk**: Over-customization hurts usability
  - **Mitigation**: Follow established e-commerce patterns; test with real users

### 8.2 Technical Risks
- **Risk**: Backend API changes required
  - **Mitigation**: Frontend team consults backend team early; prefer extending over changing endpoints
- **Risk**: Performance degradation from new features
  - **Mitigation**: Performance budgets in place; optimize as we go
- **Risk**: Admin Dashboard styling conflicts
  - **Mitigation**: Use CSS scoping (e.g., `:not(.admin-dashboard) .new-class`) or namespace Admin styles

### 8.3 Schedule Risks
- **Risk**: Underestimation of component complexity
  - **Mitigation**: Buffer time in phases; daily standups to identify blockers
- **Risk**: Dependency delays (fonts, assets, etc.)
  - **Mitigation**: Parallel workstreams; use placeholders initially

---

## 9. Appendices

### 9.1 Style Guide Reference (from Awkwardx Analysis)
- **Button Variants**: 
  - Primary: `btn btn--primary` (solid background)
  - Secondary: `btn btn--secondary` (outline)
  - Tertiary: `btn btn--tertiary` (text/link)
- **Product Card Structure**:
  - Container: `product-card`
  - Image: `product-card__image`
  - Info: `product-card__info`
  - Price: `product-card__price` (with sale/regular strikethrough)
  - Badges: `badge badge--sale`, `badge badge--new`, etc.
- **Navigation**:
  - Desktop: `site-nav` with `dropdown`, `dropdown-toggle`, `dropdown-menu`
  - Mobile: `mobile-nav` toggled by `menu-toggle`, contained in `drawer`
- **Layout**:
  - Sections: `section` with `section__title`, `section__items`
  - Grid: `grid` with `grid__item`
  - Wrapper: `wrapper` for content constraint

### 9.2 SquadGear Specific Adaptations
- **Terminology**: Retain "Your Locker" for cart, "Squad" for user community concepts
- **Brand Voice**: Integrate SquadGear's messaging in placeholder/brand sections
- **Product Attributes**: Adapt to SquadGear's specific product types (shirts, trousers, etc.)
- **Cultural Considerations**: Ensure designs are appropriate for target markets

### 9.3 Open Questions (Requiring Clarification)
1. Does SquadGear want to retain the "Your Locker" cart terminology or adopt more standard "Cart"?
2. Are there specific brand colors/typography already established beyond what's in current code?
3. Should we implement wishlist/compare features, or focus on core cart/checkout?
4. What level of product customization (variants) does SquadGear actually need?
5. Are there any third-party integrations (beyond Payfast) that need consideration?
6. What are the performance targets for different connection speeds/devices?

--- 

*This PRD provides a comprehensive framework for redesigning the SquadGear frontend with Awkwardx Store inspiration. The implementation should balance aesthetic innovation with functional fidelity to create a premium streetwear e-commerce experience that drives engagement and conversion.*