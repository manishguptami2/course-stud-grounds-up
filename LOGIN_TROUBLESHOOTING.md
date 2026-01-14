# Login Troubleshooting: "Invalid email or password"

## The Problem

You're getting "Invalid email or password" because **no users exist in the database yet**.

## Solution: Set Up Database and Create Initial User

### Step 1: Set Up Database Tables

The database tables need to be created. You have two options:

#### Option A: Automatic (During Build)
The `amplify.yml` has been updated to run `prisma db push` during build, which creates all tables.

**But you still need to create the initial user manually.**

#### Option B: Manual Setup (Recommended for First Time)

1. **Update your local `.env` file** with your production DATABASE_URL:
   ```
   DATABASE_URL="postgresql://postgres:postgres123@lms-grounds-up-db.c384siw0o6sj.eu-north-1.rds.amazonaws.com:5432/postgres?sslmode=require"
   ```
   ⚠️ **Important:** Replace `postgres` with your actual database name (check in RDS Console)

2. **Create database tables:**
   ```bash
   npx prisma db push
   ```

3. **Create the initial instructor user:**
   ```bash
   npm run db:seed
   ```

### Step 2: Verify Database Connection

Make sure your `DATABASE_URL` in Amplify matches your RDS database:
- Check RDS Console → Your database → Configuration
- Note the database name (might be `postgres`, not `dbname`)
- Update `DATABASE_URL` in Amplify if needed

### Step 3: Default Login Credentials

After seeding, use these credentials:
- **Email:** `manishgupta.sep10@gmail.com`
- **Password:** `admin123`

## Quick Setup Script

Run these commands locally (with production DATABASE_URL in `.env`):

```bash
# 1. Create tables
npx prisma db push

# 2. Create initial user
npm run db:seed
```

## Verify Setup

After running the seed script, you should see:
```
Created INSTRUCTOR user: manishgupta.sep10@gmail.com
```

## Common Issues

### Issue: "Can't reach database server"
- **Fix:** Check RDS security group allows connections from your IP
- Add inbound rule: PostgreSQL (port 5432) from your IP or 0.0.0.0/0

### Issue: "Database does not exist"
- **Fix:** Check the database name in DATABASE_URL
- Common names: `postgres`, `lms`, or the name you created

### Issue: "Authentication failed"
- **Fix:** Verify username and password in DATABASE_URL are correct
- Check RDS Console → Configuration → Master username

## After Setup

1. Try logging in with: `manishgupta.sep10@gmail.com` / `admin123`
2. You should be redirected to the instructor dashboard
3. You can then create students and courses

