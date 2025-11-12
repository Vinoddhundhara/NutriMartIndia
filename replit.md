# NutriDelight E-commerce Platform

## Overview

NutriDelight is a premium e-commerce platform specializing in fox nuts (makhana), lotus seeds, and dry fruits. The application provides a full-featured online shopping experience with product browsing, shopping cart management, checkout, and contact forms. Built with a modern tech stack focusing on clean design inspired by premium food e-commerce sites like Shopify and Etsy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (replacing React Router)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes via ThemeProvider
- Design system follows "New York" style variant from Shadcn
- Typography: Inter/DM Sans for body text, Playfair Display for accent headings
- Consistent spacing units (2, 4, 6, 8, 12, 16, 20, 24) for visual rhythm

**State Management**
- Local component state via React hooks (useState, useEffect)
- Shopping cart state persisted to localStorage for session continuity
- Form state managed by React Hook Form with Zod validation
- Server state cached and synchronized through TanStack Query

**Page Structure**
- Home: Hero section with featured products showcase
- Shop: Product grid with filtering and sorting capabilities
- Cart: Shopping cart review with quantity adjustments
- Checkout: Multi-field order form with validation
- Contact: Contact form submission
- About: Company information and values

### Backend Architecture

**Server Framework**
- Express.js running in Node.js environment
- RESTful API design pattern
- Custom middleware for request logging and JSON parsing with raw body preservation
- Vite integration in development for SSR-like capabilities

**API Endpoints**
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Retrieve single product by ID
- `POST /api/orders` - Create new order with validation
- `POST /api/contact` - Submit contact form

**Data Validation**
- Zod schemas for runtime type validation on API requests
- Drizzle-Zod integration to derive validation schemas from database schema
- Schema validation occurs at API route level before processing

### Data Storage

**Database Architecture**
- PostgreSQL as the primary relational database
- Neon serverless driver (@neondatabase/serverless) for database connectivity
- Drizzle ORM for type-safe database queries and migrations
- Schema-first approach with migrations generated from TypeScript schema definitions

**Database Schema**
- **products**: Product catalog with pricing, images, categories, ratings, stock status
- **orders**: Customer orders with full address details, items (JSON), totals, status tracking
- **contacts**: Contact form submissions with timestamp tracking

**Development Storage**
- In-memory storage implementation (MemStorage) for development/testing
- Interface-based storage abstraction (IStorage) allows swapping implementations
- Seeded product data for immediate development use

### External Dependencies

**Core Dependencies**
- **@neondatabase/serverless**: Serverless PostgreSQL driver optimized for edge deployments
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration toolkit for PostgreSQL
- **@tanstack/react-query**: Powerful async state management for React
- **react-hook-form & @hookform/resolvers**: Performant form validation with Zod integration
- **zod & drizzle-zod**: Runtime type validation and schema generation

**UI Component Libraries**
- **@radix-ui/react-***: Complete set of accessible, unstyled UI primitives (20+ components)
- **lucide-react**: Icon library for consistent iconography
- **tailwindcss**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Utility for conditional className handling

**Build & Development Tools**
- **vite & @vitejs/plugin-react**: Fast build tool with React support
- **typescript**: Type-safe development
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast bundler for production server build
- **@replit/vite-plugin-***: Replit-specific development tooling (error overlay, cartographer, dev banner)

**Utilities**
- **wouter**: Lightweight routing library (~1KB)
- **date-fns**: Modern date utility library
- **cmdk**: Command palette/search component
- **embla-carousel-react**: Carousel/slider functionality
- **vaul**: Drawer component library
- **nanoid**: Compact unique ID generation

**Session Management**
- **express-session**: Session handling middleware
- **connect-pg-simple**: PostgreSQL-backed session store for production persistence

### Asset Management

- Static assets served from `/attached_assets` directory (aliased as `@assets`)
- Generated product images stored in `/attached_assets/generated_images/`
- Favicon and other static resources served from public directory

### Type Safety & Validation

- Shared TypeScript types between client and server via `shared/` directory
- Database schema serves as single source of truth for data types
- Zod schemas auto-generated from Drizzle schema for consistent validation
- Path aliases configured for clean imports (@/, @shared/, @assets/)