# ExtensionPro SaaS Foundation

A complete SaaS foundation for creating and monetizing Chrome extensions, built with React, TypeScript, Supabase, and Stripe.

## Features

- 🔐 **Authentication** - Secure user authentication with Supabase Auth
- 💳 **Subscription Management** - Stripe integration for payments and billing
- 🎨 **Modern UI** - Clean, professional design with Tailwind CSS
- 🌙 **Dark Mode** - Animated theme toggle with sun/moon icons
- 📱 **Responsive Design** - Mobile-first responsive layout
- 🔒 **Protected Routes** - Route-level authentication protection
- ⚡ **Fast Development** - Vite for lightning-fast development

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Routing**: React Router DOM
- **Icons**: Lucide React (no emojis)
- **State Management**: React Context + hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd extensionpro-saas
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

   # App Configuration
   VITE_APP_URL=http://localhost:5173
   ```

3. **Set up Supabase database**
   - Create a new Supabase project
   - Run the SQL schema in `supabase/schema.sql` in your Supabase SQL editor
   - This will create all necessary tables, policies, and triggers

4. **Configure Stripe**
   - Create products in Stripe dashboard:
     - Pro Plan: $29/month
     - Team Plan: $99/month
   - Set up webhook endpoints for subscription management

5. **Start development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
extensionpro-saas/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   └── layout/       # Layout components
│   ├── pages/
│   │   ├── Home.tsx      # Landing page
│   │   ├── Dashboard.tsx # User dashboard
│   │   ├── Settings.tsx  # Account settings
│   │   └── Auth.tsx      # Login/signup
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── lib/              # Third-party configurations
├── public/               # Static assets
└── supabase/            # Database schemas and functions
```

## Design System

### Colors
- **Primary**: Indigo (#4F46E5)
- **Accent**: Purple (#7C3AED)
- **Gray Scale**: Tailwind gray palette
- **Status Colors**: Green (success), Yellow (warning), Red (danger)

### Typography
- **Font**: System font stack (-apple-system, BlinkMacSystemFont, etc.)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Components
- **No Emojis**: Uses Lucide React icons throughout
- **Theme Toggle**: Animated sun/moon icon transition
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Primary, secondary, and danger variants
- **Forms**: Consistent styling with focus states

## Database Schema

### Tables
- **profiles**: User profile information
- **subscriptions**: Stripe subscription data
- **extensions**: Chrome extension metadata

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic profile and subscription creation on signup

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Supabase)
- Database and authentication are handled by Supabase
- No additional backend deployment needed

## Development Guidelines

### Code Style
- Use TypeScript strictly throughout
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for async operations

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### Performance
- Lazy load components where appropriate
- Optimize images and assets
- Use React.memo for expensive components
- Implement proper caching strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact [your-email@example.com] or create an issue in the repository.
