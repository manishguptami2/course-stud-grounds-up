# Database Setup for AWS Amplify

## The Problem

You're getting "Invalid email or password" because:
1. The database tables haven't been created yet
2. No users exist in the database

## Solution: Set Up Database

### Option 1: Automatic Setup (Recommended)

The `amplify.yml` has been updated to automatically run `prisma db push` during build, which will:
- Create all database tables
- Set up the schema

**However, you still need to seed the initial user.**

### Option 2: Manual Database Setup

#### Step 1: Run Database Migrations

You need to connect to your RDS database and run Prisma migrations. You can do this:

**Option A: From Your Local Machine**

1. Make sure your `.env` has the correct `DATABASE_URL`:
   ```
   DATABASE_URL="postgresql://postgres:postgres123@lms-grounds-up-db.c384siw0o6sj.eu-north-1.rds.amazonaws.com:5432/dbname?sslmode=require"
   ```
   ⚠️ **Important:** Replace `dbname` with your actual database name (might be `postgres`)

2. Run migrations:
   ```bash
   npx prisma db push
   ```

3. Seed the database:
   ```bash
   npm run db:seed
   ```

**Option B: Using AWS Systems Manager (SSM) Session Manager**

1. Connect to an EC2 instance or use AWS CloudShell
2. Install Node.js and npm
3. Clone your repository
4. Set DATABASE_URL environment variable
5. Run `npx prisma db push` and `npm run db:seed`

### Option 3: Create User via SQL (Quick Fix)

If you have access to your RDS database, you can create a user directly:

1. Connect to your PostgreSQL database
2. Run this SQL (replace with actual hashed password):

```sql
-- First, create the tables (if they don't exist)
-- Run: npx prisma db push (from your local machine)

-- Then create a user with hashed password
-- The password 'admin123' hashed with bcrypt (10 rounds) is approximately:
-- You'll need to generate this properly, but for quick testing:

INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'temp-id-' || gen_random_uuid()::text,
  'Manish Gupta',
  'manishgupta.sep10@gmail.com',
  '$2a$10$YourHashedPasswordHere',  -- This needs to be generated properly
  'INSTRUCTOR',
  NOW(),
  NOW()
);
```

**Better approach:** Use the seed script which properly hashes the password.

## Default Login Credentials

After seeding, use:
- **Email:** `manishgupta.sep10@gmail.com`
- **Password:** `admin123`

## Quick Fix: Run Seed Script Locally

1. Update your local `.env` with the production DATABASE_URL:
   ```
   DATABASE_URL="postgresql://postgres:postgres123@lms-grounds-up-db.c384siw0o6sj.eu-north-1.rds.amazonaws.com:5432/dbname?sslmode=require"
   ```

2. Make sure the database name is correct (check in RDS Console)

3. Run:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

4. Try logging in again

## Verify Database Connection

Check if you can connect to your database:
```bash
# Test connection (if you have psql installed)
psql "postgresql://postgres:postgres123@lms-grounds-up-db.c384siw0o6sj.eu-north-1.rds.amazonaws.com:5432/dbname?sslmode=require"
```

## Check Database Name

The database name in your DATABASE_URL might be wrong. Common names:
- `postgres` (default PostgreSQL database)
- `lms`
- The name you specified when creating the RDS instance

Check in RDS Console → Your database → Configuration → DB name

## After Setting Up

Once you've run the migrations and seeded the database:
1. Try logging in with: `manishgupta.sep10@gmail.com` / `admin123`
2. You should be redirected to the instructor dashboard

