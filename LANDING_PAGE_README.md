# Rabbiits Capital Landing Page

A modern, responsive landing page for Rabbiits Capital with customizable content and image carousel functionality.

## Features Implemented

### ✅ Landing Page
- **Modern Design**: Beautiful gradient background with professional styling
- **Responsive Layout**: Automatically adapts to mobile and desktop devices
- **Customizable Branding**: Company name, welcome text, and description via environment variables

### ✅ Login System
- **Email/Password Login**: Traditional credential-based authentication
- **Google OAuth**: Seamless sign-in with Google accounts
- **Form Validation**: Client-side validation with error handling
- **Modern UI**: Glass-morphism design with smooth transitions

### ✅ Image Carousel
- **Auto-advancing Carousel**: Displays company photos with 4-second intervals
- **Manual Navigation**: Previous/next arrows and dot indicators
- **Fallback System**: Beautiful gradient backgrounds with emojis when images fail to load
- **Responsive Design**: Adjusts height on mobile devices

### ✅ Admin Interface
- **Carousel Management**: Add, remove, and configure carousel images
- **Site Configuration**: Customize company branding, colors, and contact information
- **User-friendly Interface**: Intuitive forms with visual feedback

### ✅ Environment Configuration
All content is customizable through environment variables:

```env
NEXT_PUBLIC_COMPANY_NAME="Rabbiits Capital"
NEXT_PUBLIC_WELCOME_TEXT="Bienvenido a la plataforma líder en inversiones inmobiliarias"
NEXT_PUBLIC_DESCRIPTION_TEXT="Conectamos inversionistas con las mejores oportunidades del mercado inmobiliario"
```

## Technical Implementation

### Architecture
- **Framework**: Next.js 14 with TypeScript
- **Authentication**: NextAuth.js with Prisma adapter
- **Styling**: Inline styles with responsive CSS classes
- **Components**: Modular React components with TypeScript interfaces

### Key Components
1. **`app/page.tsx`**: Main landing page with responsive grid layout
2. **`app/(components)/LoginForm.tsx`**: Login form with OAuth integration
3. **`app/(components)/ImageCarousel.tsx`**: Interactive image carousel with fallbacks
4. **`app/admin/carousel/page.tsx`**: Admin interface for carousel management
5. **`app/admin/configuracion/page.tsx`**: Site configuration panel

### Security Features
- **CSRF Protection**: Built-in NextAuth.js security
- **Input Validation**: Client-side and server-side validation
- **Environment Variables**: Sensitive data stored securely
- **Session Management**: JWT-based authentication

## Usage

### Development
```bash
npm install
npm run dev
```

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Configure Google OAuth credentials
3. Set up database connection
4. Customize branding variables

### Admin Access
- Navigate to `/admin` for administrative functions
- Manage carousel images at `/admin/carousel`
- Configure site settings at `/admin/configuracion`

## Responsive Design

### Desktop (1920x1080)
- Two-column layout with login form on left, carousel on right
- Large typography and spacious design
- Full-size carousel with smooth transitions

### Mobile (375x667)
- Single-column layout with stacked elements
- Optimized typography sizes
- Compact carousel with touch-friendly controls

## Customization Options

### Via Environment Variables
- Company name and branding text
- Welcome messages and descriptions
- OAuth provider credentials

### Via Admin Interface
- Carousel images and descriptions
- Color scheme and branding
- Contact information and social media links

### Via Code
- Custom gradients and animations
- Additional carousel features
- Extended admin functionality

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## Performance Optimizations
- Image lazy loading
- Component-level state management
- Optimized bundle size with Next.js
- Responsive image sizing

## Future Enhancements
- Image upload functionality for carousel
- Real-time preview of configuration changes
- Multi-language support
- Analytics integration
- SEO optimization