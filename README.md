# GalaxyKiro - Progressive Engagement Website

A Next.js 14 progressive web application designed to nurture leads through curiosity-driven conversion using interactive tools and assessments.

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Deployment**: Netlify with serverless functions
- **State Management**: Zustand with persistence
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **PWA**: Progressive Web App capabilities (configured for future implementation)

## 🎨 Design System

### Ethiopian-Inspired Color Palette
- **Ethiopian Colors**: Gold (#FFD700), Green (#078930), Red (#DA121A)
- **Growth**: Primary green (#10B981) with full palette
- **Knowledge**: Primary blue (#3B82F6) with full palette
- **Transformation**: Primary purple (#8B5CF6) with full palette
- **Energy**: Primary orange (#F59E0B) with full palette

### Typography
- **Headings**: Plus Jakarta Sans
- **Body**: Inter
- **Ethiopic**: Noto Sans Ethiopic (for Amharic support)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend services)
- Netlify account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Firal19/galaxykiro.git
cd progressive-engagement-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
progressive-engagement-website/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── lib/                 # Utility libraries
│   │   ├── store.ts         # Zustand state management
│   │   ├── utils.ts         # Utility functions
│   │   └── validations.ts   # Zod validation schemas
│   └── components/          # React components (to be created)
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── netlify/
│   └── functions/          # Netlify serverless functions
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── netlify.toml           # Netlify deployment configuration
└── next.config.ts         # Next.js configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables in Netlify dashboard
5. Deploy!

The `netlify.toml` file includes:
- Build configuration
- Redirects for SPA routing
- Security headers
- PWA support
- API route handling

## 🗄️ Database Schema

The application uses Supabase PostgreSQL with the following main tables:
- `users` - User profiles and progressive capture data
- `interactions` - User journey tracking
- `tool_usage` - Assessment results and tool interactions
- `content_engagement` - Content consumption analytics
- `lead_scores` - Lead scoring and tier classification

## 🎯 Key Features (Planned)

- Progressive information capture (3 levels)
- Interactive assessment tools (15+ tools)
- Curiosity cascade landing page
- Ethiopian cultural design elements
- Multilingual support (English/Amharic)
- PWA capabilities
- Real-time analytics
- Email automation integration
- Office visit booking system

## 🔒 Security

- Input validation with Zod schemas
- CORS configuration
- Rate limiting (configured in Netlify)
- Environment variable protection
- Secure headers configuration

## 📱 Progressive Web App

PWA configuration is prepared but currently disabled for development. To enable:
1. Uncomment PWA configuration in `next.config.ts`
2. Ensure proper icon files are in place
3. Test service worker functionality

## 🤝 Contributing

1. Follow the established code style
2. Use TypeScript for all new code
3. Validate forms with Zod schemas
4. Test responsive design on mobile devices
5. Ensure accessibility compliance

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit, integration, e2e, accessibility, performance)
- [ ] Code quality checks (linting, TypeScript, no console.log, no TODOs)
- [ ] Security checks (dependency scan, API security, auth flows, env vars)
- [ ] Performance optimization (images, bundle size, lazy loading, SSR)
- [ ] SEO and accessibility (meta tags, alt text, semantic HTML, WCAG contrast)

### Deployment Process
- [ ] Update Netlify environment variables
- [ ] Database migrations tested and backed up
- [ ] Staging environment validation
- [ ] Production deployment with rollback plan

## 📊 Monitoring & Observability

### Error Tracking (Sentry)
- JavaScript errors and API failures
- Performance issues and user experience problems
- Dashboard: https://sentry.io/organizations/your-org/
- Alerts via email and Slack (#website-alerts)

### Performance Metrics (Core Web Vitals)
- **LCP (Largest Contentful Paint)**: ≤ 2.5s (Good)
- **FID (First Input Delay)**: ≤ 100ms (Good)
- **CLS (Cumulative Layout Shift)**: ≤ 0.1 (Good)
- **TTFB (Time to First Byte)**: ≤ 800ms (Good)

## 📄 License

This project is proprietary to GalaxyDreamTeam.

---

Built with ❤️ for personal development and growth in Ethiopia.
