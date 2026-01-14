# AWS Amplify Runtime Error Troubleshooting

## Error: "Application error: a server-side exception has occurred"

This error typically occurs due to:

### 1. Missing Environment Variables

**Check in AWS Amplify Console:**
- Go to App settings → Environment variables
- Verify ALL of these are set:

#### Required Variables:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://main.dp6fochd7k0aw.amplifyapp.com
REGION=eu-north-1
ACCESS_KEY_ID=your-access-key
SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
NODE_ENV=production
```

### 2. Database Connection Issues

**Common problems:**
- RDS security group doesn't allow connections from Amplify
- DATABASE_URL format is incorrect
- Database doesn't exist or credentials are wrong

**Fix:**
1. Check RDS security group:
   - Go to RDS Console → Your database → Connectivity & security
   - Edit security group inbound rules
   - Add rule: Type=PostgreSQL, Source=0.0.0.0/0 (or Amplify IP range)

2. Verify DATABASE_URL format:
   ```
   postgresql://username:password@host:5432/database?sslmode=require
   ```

### 3. Prisma Client Not Generated

**Fix:**
- The `amplify.yml` includes `npx prisma generate` in preBuild
- If this fails, check build logs for Prisma errors

### 4. NextAuth Configuration Issues

**Check:**
- `NEXTAUTH_SECRET` must be set (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` must match your Amplify domain exactly
- No trailing slash in `NEXTAUTH_URL`

### 5. Check Server Logs

**In AWS Amplify Console:**
1. Go to your app
2. Click "Monitoring" tab
3. Check CloudWatch logs for detailed error messages
4. Look for specific error messages that indicate the problem

### Quick Diagnostic Steps

1. **Verify Environment Variables:**
   - All variables are set in Amplify Console
   - No typos in variable names
   - Values are correct (especially DATABASE_URL and NEXTAUTH_URL)

2. **Test Database Connection:**
   - Try connecting to your RDS database from your local machine
   - Use the same DATABASE_URL format

3. **Check Build Logs:**
   - Look for any warnings or errors during build
   - Verify Prisma client was generated successfully

4. **Check Runtime Logs:**
   - Go to CloudWatch Logs
   - Filter by your app name
   - Look for error messages around the time you accessed the URL

### Most Common Issue

**Missing or incorrect `DATABASE_URL`** - This causes Prisma to fail when trying to connect, which triggers the server-side error.

### Next Steps

1. Check CloudWatch logs for the specific error message
2. Verify all environment variables are set correctly
3. Test database connectivity
4. Share the specific error from CloudWatch logs for more targeted help

