# AI HR Interview Platform - Frontend

A modern, professional AI-powered HR interview and assessment management platform built with Next.js and a comprehensive tech stack.

## 🚀 Features

### Authentication
- ✅ Email/Password login
- ✅ SSO integration (Google Workspace & Microsoft Azure AD) - Mocked
- ✅ Remember me functionality
- ✅ Forgot password flow
- ✅ NextAuth integration

### Dashboard Overview
- ✅ Real-time metrics display
  - Total interviews
  - Weekly interview count
  - Pending candidates
  - Completed interviews
  - Average candidate score
  - Most active position
- ✅ Upcoming interviews (top 3 critical)
- ✅ Recent interview activity
- ✅ Interactive metric cards with icons

### Interview Management
- ✅ Complete interview list with TanStack Table
- ✅ Advanced filtering by:
  - Position
  - Status (Pending, Completed, Awaiting Response)
  - Date range
  - Search by name/email
- ✅ Create new interviews with:
  - Candidate information
  - Position selection
  - Interview type (Assessment, Video, Combo)
  - Date/time scheduling
  - Calendar sync options (Google/Outlook)
  - Question template selection
  - Notes and descriptions
- ✅ Detailed interview view with:
  - Video interview analysis (AI scores for communication, confidence, clarity, technical)
  - Assessment results with question breakdown
  - Transcript display
  - HR notes section
  - Downloadable reports

### Question Templates
- ✅ Template library with usage statistics
- ✅ Template actions (Duplicate, Edit, Delete, Add to favorites)
- ✅ Question categories (technical, culture, behavioral, leadership)
- ✅ Difficulty levels per question
- ✅ AI evaluation criteria per question
- ✅ Drag & drop question ordering

### Internationalization
- ✅ English and Turkish language support
- ✅ Real-time language switching
- ✅ Persistent language preference

### UI/UX
- ✅ Modern, professional corporate design
- ✅ Fully responsive layout
- ✅ Dark mode ready
- ✅ Sidebar navigation
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## 🛠 Tech Stack

### Core Technologies
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI component library

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **React Query (@tanstack/react-query)** - Server state management
- **Axios** - HTTP client

### Forms & Validation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation resolver

### Tables
- **TanStack Table** - Headless table library with sorting, filtering, pagination

### Authentication
- **NextAuth.js** - Authentication for Next.js
- Supports credentials and OAuth providers

### Internationalization
- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next
- **i18next-browser-languagedetector** - Language detection

### UI Components & Icons
- **Lucide React** - Beautiful, consistent icon set
- **date-fns** - Modern date utility library
- **sonner** - Toast notification library
- **Radix UI** - Unstyled, accessible components (via shadcn/ui)

### Development Tools
- **ESLint** - Linting utility
- **Prettier** - Code formatter
- **prettier-plugin-tailwindcss** - Tailwind class sorting

## 📁 Project Structure

```
/app
├── app/
│   ├── api/                          # API routes (Next.js backend)
│   │   ├── auth/[...nextauth]/      # NextAuth endpoints
│   │   ├── dashboard/               # Dashboard metrics
│   │   ├── interviews/              # Interview CRUD
│   │   ├── templates/               # Template CRUD
│   │   └── positions/               # Position list
│   ├── dashboard/                    # Dashboard page
│   ├── interviews/                   # Interview pages
│   │   ├── create/                  # Create interview form
│   │   └── [id]/                    # Interview detail
│   ├── templates/                    # Templates page
│   ├── settings/                     # Settings page
│   ├── login/                        # Login page
│   ├── layout.js                     # Root layout
│   ├── page.js                       # Home page (redirects)
│   └── globals.css                   # Global styles
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── providers.jsx                # App providers wrapper
│   ├── sidebar.jsx                  # Main navigation
│   ├── header.jsx                   # Top header bar
│   └── metric-card.jsx              # Dashboard metric card
├── lib/
│   ├── stores/                      # Zustand stores
│   │   ├── auth-store.js           # Auth state
│   │   ├── interview-store.js      # Interview state
│   │   └── ui-store.js             # UI state
│   ├── i18n.js                      # i18n configuration
│   ├── mock-data.js                 # Mock data for development
│   ├── schemas.js                   # Zod validation schemas
│   ├── api-client.js                # Axios instance
│   ├── query-client.js              # React Query config
│   └── utils.js                     # Utility functions
└── package.json                     # Dependencies

```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Environment setup:
The `.env.local` file is already configured with:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials
```
Email: hr@company.com
Password: password123
```

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home (redirects to login or dashboard) |
| `/login` | Login page with SSO options |
| `/dashboard` | Main dashboard with metrics |
| `/interviews` | Interview list with filters |
| `/interviews/create` | Create new interview |
| `/interviews/[id]` | Interview detail view |
| `/templates` | Question templates library |
| `/settings` | User settings |

## 🎨 Design System

### Colors
The application uses semantic color tokens:
- `bg-background` / `text-foreground` - Main background/text
- `bg-card` / `text-card-foreground` - Card components
- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-secondary` / `text-secondary-foreground` - Secondary elements
- `bg-muted` / `text-muted-foreground` - Subdued content
- `border-border` - Borders
- `ring-ring` - Focus rings

### Typography
- Font: Inter (Google Fonts)
- Responsive font sizes with Tailwind utilities

### Components
All UI components are built with shadcn/ui and customizable via:
- `/components/ui/` - Component files
- `/app/globals.css` - Theme variables
- `/tailwind.config.js` - Tailwind configuration

## 🔧 Configuration Files

### Key Configuration Files
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc.json` - Prettier formatting rules
- `components.json` - shadcn/ui configuration

## 📊 Mock Data

The application uses mock data for demonstration:
- **Users**: 2 HR team members
- **Candidates**: 5 sample candidates
- **Interviews**: 5 sample interviews (various statuses)
- **Templates**: 3 question templates
- **Positions**: 8 job positions

All mock data is defined in `/lib/mock-data.js`

## 🌍 Internationalization

Currently supports:
- **English (en)** - Default
- **Turkish (tr)**

Translation files are in `/lib/i18n.js`

To add a new language:
1. Add language resources to `i18n.js`
2. Add language to `resources` object
3. Language will be automatically available

## 🔐 Authentication Flow

1. User enters credentials or clicks SSO
2. NextAuth validates credentials
3. Session created and stored
4. User redirected to dashboard
5. Protected routes check session
6. Unauthorized users redirected to login

## 📝 Forms & Validation

All forms use:
- **React Hook Form** for form state
- **Zod** for schema validation
- **@hookform/resolvers** for integration

Example schema in `/lib/schemas.js`:
```javascript
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})
```

## 🎯 Key Features Implementation

### TanStack Table
- Sorting, filtering, pagination
- Global search
- Column visibility
- Custom cell renderers

### React Query
- Automatic caching
- Background refetching
- Optimistic updates
- Loading/error states

### Zustand
- Minimal boilerplate
- TypeScript support
- Middleware support (persist)
- DevTools integration

## 🚀 Production Deployment

1. Build the application:
```bash
yarn build
```

2. Start production server:
```bash
yarn start
```

3. Environment variables:
- Set `NEXTAUTH_SECRET` to a secure random string
- Update `NEXTAUTH_URL` to your production domain
- Configure real OAuth providers if using SSO

## 📦 Build Output

The production build includes:
- Optimized JavaScript bundles
- Static page generation where possible
- API routes
- CSS optimization

## 🤝 Contributing

This is a demonstration project. For real-world usage:
1. Replace mock data with real API calls
2. Implement actual OAuth providers
3. Add proper error boundaries
4. Implement real-time updates
5. Add comprehensive testing
6. Implement proper security measures

## 📄 License

This project is created for demonstration purposes.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- Vercel for hosting and deployment tools
- All open-source contributors

## 📞 Support

For questions or issues, please refer to the documentation or create an issue in the repository.

---

Built with ❤️ using Next.js and modern web technologies
