# Overview

CompareIt is a comprehensive e-commerce price comparison platform that aggregates product listings across major Indian platforms including Amazon, Flipkart, Myntra, and Meesho. The application provides real-time price tracking, review analytics, shipping comparisons, and smart search functionality to help users make informed purchasing decisions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark modes)
- **State Management**: TanStack Query (React Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for products, listings, reviews, and categories
- **Middleware**: Custom logging middleware for API request tracking
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Connection Pooling**: Neon serverless connection pooling for optimal performance

## Database Schema Design
- **Products**: Core product information with categories and metadata
- **Product Listings**: Platform-specific listings with pricing, stock, and ratings
- **Reviews**: User reviews with sentiment analysis and helpfulness scores
- **Comparisons**: User-saved product comparisons for later reference
- **Categories**: Hierarchical product categorization system

## Authentication and Authorization
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple
- **User System**: Basic user registration and authentication (users table in schema)
- **Security**: Prepared for session-based authentication with proper cookie handling

## Development and Build Pipeline
- **Development**: Hot module replacement with Vite dev server
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **TypeScript**: Strict type checking across frontend, backend, and shared schemas
- **Path Aliases**: Organized imports with @ aliases for clean code structure

## UI/UX Design Patterns
- **Design System**: shadcn/ui with "new-york" style variant
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Architecture**: Reusable UI components with proper TypeScript interfaces
- **Theme System**: CSS variables-based theming with system preference detection

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Database Driver**: @neondatabase/serverless for optimal serverless performance

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Consistent icon system with tree-shaking support

## Development Tools
- **Vite**: Fast build tool with HMR and modern JavaScript features
- **TypeScript**: Static type checking for enhanced developer experience
- **Drizzle Kit**: Database schema management and migration tools

## Data Fetching and State
- **TanStack Query**: Server state management with caching and background updates
- **Zod**: Runtime type validation and schema definition

## Form and Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod schemas

## Utility Libraries
- **date-fns**: Modern date utility library for date formatting and manipulation
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Utility for constructing className strings conditionally

## Platform Integration (Planned)
- **E-commerce APIs**: Integration endpoints for Amazon, Flipkart, Myntra, and Meesho
- **Price Tracking**: Real-time price monitoring and alert systems
- **Review Aggregation**: Sentiment analysis and review summarization services