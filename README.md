# LMS - Learning Management System

A comprehensive Learning Management System built with Next.js, Prisma, and NextAuth.js.

## Features

- User authentication with NextAuth.js
- Role-based access (STUDENT, INSTRUCTOR)
- Course management
- Module and lesson organization
- Quiz system with questions and attempts
- Enrollment tracking

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update:
- `DATABASE_URL` - SQLite database path (default: `file:./dev.db`)
- `NEXTAUTH_SECRET` - Generate a random secret for production

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push database schema:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

- Generate Prisma client: `npm run db:generate`
- Push schema changes: `npm run db:push`
- Create migration: `npm run db:migrate`
- Open Prisma Studio: `npm run db:studio`

## Project Structure

```
├── app/              # Next.js app directory
├── lib/              # Utility functions (Prisma client, auth config)
├── prisma/           # Prisma schema and migrations
├── types/            # TypeScript type definitions
└── components/       # React components (to be created)
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication
- **Lucide React** - Icons
- **SQLite** - Database (can be changed to PostgreSQL/MySQL)

http://localhost:3000/dashboard
admin123

student pwd: 1234

AWS
--------------
- postgres - pwd: postgres123

Endpoint, port: 
lms-grounds-up-db.c384siw0o6sj.eu-north-1.rds.amazonaws.com
5432