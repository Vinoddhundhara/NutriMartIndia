# NutriDelight Design Guidelines

## Design Approach
**Reference-Based E-commerce Design** drawing inspiration from Shopify's clean product showcases, Etsy's warm approachability, and premium food e-commerce aesthetics. Focus on visual appeal that makes products look fresh, premium, and desirable.

## Typography System
- **Primary Font:** Inter or DM Sans (Google Fonts) - clean, modern readability
- **Accent Font:** Playfair Display or Crimson Text for premium product names and hero headlines
- **Hierarchy:**
  - Hero Headlines: 3xl to 6xl, accent font, medium weight
  - Section Headers: 2xl to 4xl, primary font, semibold
  - Product Names: lg to xl, primary font, medium
  - Body Text: base, primary font, regular
  - Price Display: xl to 2xl, primary font, bold
  - CTAs: base to lg, primary font, semibold

## Layout System
**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-6 to p-8
- Section padding: py-16 to py-24 (desktop), py-12 (mobile)
- Card spacing: gap-6 to gap-8
- Container max-width: max-w-7xl for content areas

## Core Components

### Navigation Bar
- Fixed/sticky header with backdrop blur effect
- Logo left, navigation center, cart icon with badge right
- Mobile: Hamburger menu with slide-in drawer
- Height: h-16 to h-20
- Add subtle bottom border for definition

### Hero Section
- Full-width, 70vh minimum height on desktop
- Large, high-quality hero image of premium fox nuts in elegant bowls/packaging
- Overlay with semi-transparent gradient for text readability
- Centered content: Bold headline, subheadline, dual CTAs (Shop Now + Learn More)
- CTAs with blurred backgrounds, no hover states needed
- Mobile: Reduce to 50vh, stack CTAs vertically

### Product Grid (Shop Page)
- 4 columns desktop (grid-cols-4), 2 columns tablet (md:grid-cols-2), 1 column mobile
- Product cards with subtle elevation, rounded corners (rounded-lg)
- Card structure:
  - Square product image (aspect-square) with gentle hover scale
  - Product name (truncate if needed)
  - Weight/variant text (smaller, muted)
  - Price (prominent, bold)
  - Add to Cart button (full-width within card)
- Spacing: gap-6 between cards

### Search & Filters Bar
- Sticky below header when scrolling
- Search input with icon (w-full max-w-md)
- Sort dropdown (Price, Name, Popularity)
- Horizontal layout on desktop, stack on mobile
- Background with slight backdrop blur

### Cart Page
- Two-column layout: Cart items (2/3 width) + Order summary sidebar (1/3 width)
- Cart items as list cards with:
  - Thumbnail image left
  - Product details center (name, price, variant)
  - Quantity controls (- / number / +)
  - Remove button right
- Order summary sticky on scroll
- Summary includes: Subtotal, Shipping, Total with prominent Checkout button

### Checkout Page
- Single column form (max-w-2xl centered)
- Group fields logically: Contact Info, Shipping Address, Payment
- Two-column grid for Name fields, City/Pin code
- Large, prominent Place Order button at bottom
- Order summary sidebar on desktop (similar to cart)

### Contact Page
- Two-column split (50/50): Contact form left, Map + info right
- Form fields: Name, Email, Phone, Message (textarea)
- Map embedded with rounded corners, generous height (h-96)
- Contact details below map (address, phone, email with icons)

### Footer
- Three-column layout: Quick Links, Customer Service, Connect with Us
- Newsletter signup: Inline input with button
- Social media icons (large, touchable - h-10 w-10)
- Bottom bar with copyright and payment method icons
- Padding: py-12 to py-16

## Component Library

**Buttons:**
- Primary CTA: px-8 py-3, rounded-full, font-semibold
- Secondary: px-6 py-2.5, rounded-lg, outlined style
- Icon buttons: Square aspect, p-2 to p-3
- Cart buttons: Full-width on cards, rounded-lg

**Cards:**
- Product cards: rounded-lg, subtle shadow, hover elevation increase
- Info cards: rounded-xl, generous padding (p-6)
- Testimonial cards (if added): italic quote, author name/image

**Forms:**
- Input fields: px-4 py-3, rounded-lg, border with focus state
- Labels: mb-2, font-medium
- Error states: border change, small error text below

**Badges:**
- Cart count: Absolute positioned, rounded-full, small text
- Sale/discount tags: Absolute on product cards, top-right

## Images

**Required Images:**
1. **Hero Image:** Large lifestyle photo showing premium fox nuts in elegant white ceramic bowl on wooden surface, with dry fruits artfully arranged. Professional food photography style with natural lighting. Dimensions: 1920x1080 minimum
2. **Product Images:** High-quality square photos (800x800) for each product - fox nuts in clear packaging, almonds, cashews, raisins. Clean white or subtle neutral backgrounds
3. **About Page Image:** Origin story visual - lotus flowers/farms in India
4. **Category Banners:** Smaller hero-style images for each product category on shop page

**Image Treatment:**
- Rounded corners on all product images (rounded-lg)
- Hero image uses full-bleed with overlay
- Maintain consistent aspect ratios per component type

## Animations
Use sparingly and only where meaningful:
- Smooth page transitions (fade-in)
- Cart icon pulse when item added
- Product card subtle scale on hover (scale-105)
- Quantity buttons tactile feedback
Avoid: Scroll animations, parallax effects, complex transitions

## Responsive Breakpoints
- Mobile: < 768px (single column everything)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (full multi-column layouts)

**Mobile Optimizations:**
- Stack hero content, increase touch targets (min h-12)
- Collapsible filters on shop page
- Bottom-fixed cart bar for easy access
- Simplified footer (accordion sections)