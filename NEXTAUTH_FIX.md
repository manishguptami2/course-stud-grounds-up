# NextAuth Configuration Error Fix

## Error: "There is a problem with the server configuration"

This error occurs when NextAuth.js cannot find required configuration.

## Required Environment Variables

### 1. NEXTAUTH_SECRET (CRITICAL)
- **Must be set** in AWS Amplify environment variables
- Generate a new one if needed:
  ```bash
  openssl rand -base64 32
  ```
- Example: `DYhOhsZ9d7PA+C56ckU2+/MA05epQzgWj8DdWevGkYQ=`

### 2. NEXTAUTH_URL (CRITICAL)
- **Must be set** in AWS Amplify environment variables
- Must match your Amplify domain EXACTLY
- Format: `https://main.dp6fochd7k0aw.amplifyapp.com`
- **NO trailing slash**
- **Must include https://**

## How to Fix in AWS Amplify

1. Go to **AWS Amplify Console** → Your App
2. Click **App settings** → **Environment variables**
3. Click **Manage variables**

### Add/Verify These Variables:

```
NEXTAUTH_SECRET=DYhOhsZ9d7PA+C56ckU2+/MA05epQzgWj8DdWevGkYQ=
NEXTAUTH_URL=https://main.dp6fochd7k0aw.amplifyapp.com
```

**Important:**
- Variable names are case-sensitive
- No spaces around the `=` sign
- No quotes needed in Amplify (it adds them automatically)

## After Adding Variables

1. **Redeploy** your app:
   - Go to Deployments tab
   - Click "Redeploy this version" or wait for auto-deploy

2. **Wait for deployment** to complete

3. **Test** the app again

## Verification

After redeploying, check CloudWatch logs:
- If you see "NEXTAUTH_SECRET is not set!" → Variable not set correctly
- If you see "NEXTAUTH_URL is not set!" → Variable not set correctly
- If no errors → Configuration is correct

## Common Mistakes

❌ `NEXTAUTH_URL=https://main.dp6fochd7k0aw.amplifyapp.com/` (trailing slash)
✅ `NEXTAUTH_URL=https://main.dp6fochd7k0aw.amplifyapp.com` (no trailing slash)

❌ `NEXTAUTH_URL=main.dp6fochd7k0aw.amplifyapp.com` (missing https://)
✅ `NEXTAUTH_URL=https://main.dp6fochd7k0aw.amplifyapp.com` (with https://)

❌ Variable name: `NextAuth_Secret` (wrong case)
✅ Variable name: `NEXTAUTH_SECRET` (exact case)

