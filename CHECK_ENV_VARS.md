# Environment Variables Checklist for AWS Amplify

## ⚠️ CRITICAL: Check These in Amplify Console

Go to: **AWS Amplify Console → Your App → App settings → Environment variables**

### Required Variables (ALL must be set):

1. **DATABASE_URL**
   ```
   postgresql://postgres:postgres123@lms-grounds-up-db.c384siw0o6sj.eu-north-1.rds.amazonaws.com:5432/dbname?sslmode=require
   ```
   - ✅ Must include `?sslmode=require`
   - ✅ Check that database name is correct (might be `postgres` not `dbname`)

2. **NEXTAUTH_SECRET**
   ```
   DYhOhsZ9d7PA+C56ckU2+/MA05epQzgWj8DdWevGkYQ=
   ```
   - ✅ Must be a long random string
   - ✅ Generate new one if needed: `openssl rand -base64 32`

3. **NEXTAUTH_URL**
   ```
   https://main.dp6fochd7k0aw.amplifyapp.com
   ```
   - ✅ Must match your Amplify domain EXACTLY
   - ✅ Must include `https://`
   - ✅ NO trailing slash

4. **REGION**
   ```
   eu-north-1
   ```

5. **ACCESS_KEY_ID**
   ```
   Your AWS access key
   ```

6. **SECRET_ACCESS_KEY**
   ```
   Your AWS secret key
   ```

7. **S3_BUCKET_NAME**
   ```
   Your actual S3 bucket name (not "your-lms-uploads")
   ```

8. **NODE_ENV**
   ```
   production
   ```

## How to Check CloudWatch Logs

1. Go to AWS Amplify Console
2. Click on your app
3. Go to "Monitoring" tab
4. Click "View logs in CloudWatch"
5. Look for error messages around the time you accessed the URL
6. The error message will tell you exactly what's wrong

## Common Error Messages

### "DATABASE_URL environment variable is not set"
→ Add DATABASE_URL in Amplify environment variables

### "Can't reach database server"
→ Check RDS security group allows connections from Amplify

### "Invalid NEXTAUTH_SECRET"
→ Generate a new secret and update it

### "NEXTAUTH_URL is not set"
→ Add NEXTAUTH_URL with your exact Amplify domain

