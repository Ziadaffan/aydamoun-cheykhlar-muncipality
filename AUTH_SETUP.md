# NextAuth.js Authentication Setup

This project now includes NextAuth.js for authentication. Here's what has been set up:

## Features

- ✅ User registration and login
- ✅ Password hashing with bcryptjs
- ✅ Session management
- ✅ Protected routes with middleware
- ✅ User profile page
- ✅ Logout functionality
- ✅ Prisma integration for user storage

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Generating a Secret

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

## Database Setup

1. Run the Prisma migration to create the new tables:
```bash
yarn migration:run
```

2. Generate the Prisma client:
```bash
yarn prisma:generate
```

## API Routes

- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js routes
- `POST /api/auth/logout` - Logout endpoint

## Protected Routes

The following routes require authentication:
- `/services/forms/*` - Service form pages
- `/profile` - User profile page
- `/admin/*` - Admin pages (future)

## Components

- `UserMenu` - User menu in navigation
- `SessionProvider` - NextAuth session provider
- Updated login and signup pages

## Usage

1. Users can register at `/auth/signup`
2. Users can login at `/auth/login`
3. Authenticated users see a user menu in the navigation
4. Users can access their profile at `/profile`
5. Users can logout from the user menu

## Next Steps

1. Add email verification
2. Add password reset functionality
3. Add social login providers (Google, Facebook, etc.)
4. Add admin dashboard
5. Add user management features 