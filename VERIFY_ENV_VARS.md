# How to Verify Environment Variables in AWS Amplify

## The Error
```
Error: NEXTAUTH_SECRET environment variable is not set
```

This means the environment variable is **NOT** being passed to your application at runtime.

## Step-by-Step Fix

### 1. Go to AWS Amplify Console
- Navigate to: https://console.aws.amazon.com/amplify/
- Select your app: `course-stud-grounds-up` (or your app name)

### 2. Check Environment Variables
1. Click **"App settings"** in the left sidebar
2. Click **"Environment variables"** 
3. Click **"Manage variables"** button

### 3. Verify NEXTAUTH_SECRET Exists
Look for a variable named exactly: `NEXTAUTH_SECRET`

**If it's NOT there:**
1. Click **"Add variable"**
2. Variable name: `NEXTAUTH_SECRET` (exact case, no spaces)
3. Variable value: `DYhOhsZ9d7PA+C56ckU2+/MA05epQzgWj8DdWevGkYQ=`
   - Or generate a new one using: `openssl rand -base64 32`
4. Click **"Save"**

**If it IS there:**
- Check the variable name is exactly `NEXTAUTH_SECRET` (case-sensitive)
- Check there are no extra spaces
- Check the value is not empty

### 4. Verify NEXTAUTH_URL Exists
Look for a variable named exactly: `NEXTAUTH_URL`

**Value should be:**
```
https://main.dp6fochd7k0aw.amplifyapp.com
```

**Common mistakes:**
- ❌ `https://main.dp6fochd7k0aw.amplifyapp.com/` (trailing slash)
- ❌ `main.dp6fochd7k0aw.amplifyapp.com` (missing https://)
- ✅ `https://main.dp6fochd7k0aw.amplifyapp.com` (correct)

### 5. Complete Environment Variables Checklist

Make sure ALL of these are set:

```
✅ NEXTAUTH_SECRET=DYhOhsZ9d7PA+C56ckU2+/MA05epQzgWj8DdWevGkYQ=
✅ NEXTAUTH_URL=https://main.dp6fochd7k0aw.amplifyapp.com
✅ DATABASE_URL=postgresql://...
✅ REGION=eu-north-1
✅ ACCESS_KEY_ID=...
✅ SECRET_ACCESS_KEY=...
✅ S3_BUCKET_NAME=...
✅ NODE_ENV=production
```

### 6. After Adding/Updating Variables

**IMPORTANT:** Environment variables require a **new deployment** to take effect!

1. Go to **"Deployments"** tab
2. Click **"Redeploy this version"** button
3. Wait for deployment to complete (5-10 minutes)
4. Test the app again

### 7. Verify Variables Are Loaded

After redeploying, check CloudWatch logs:
- Go to **Monitoring** → **View logs in CloudWatch**
- Look for log entries that show:
  - `✅ NEXTAUTH_SECRET: Set` (if variable is loaded)
  - `❌ NEXTAUTH_SECRET: Missing` (if variable is NOT loaded)

## Troubleshooting

### Issue: Variable exists but still shows as missing

**Possible causes:**
1. **Variable name typo** - Check for extra spaces or wrong case
2. **Not redeployed** - Variables only apply after redeployment
3. **Wrong branch** - Make sure you're setting variables for the correct branch (usually `main`)

### Issue: How to check which branch variables apply to

In Amplify Console:
- Environment variables can be set per branch
- Make sure you're setting them for the `main` branch (or your active branch)

### Issue: Variables set but app still fails

1. **Double-check variable names** - They must be exact:
   - `NEXTAUTH_SECRET` (not `NextAuth_Secret` or `NEXTAUTH_SECRET ` with space)
   - `NEXTAUTH_URL` (not `NextAuth_URL`)

2. **Check for hidden characters** - Copy-paste the variable name exactly

3. **Verify in CloudWatch logs** - The logs will show if variables are loaded

## Quick Test

After setting variables and redeploying, the CloudWatch logs should show:
```
✅ NEXTAUTH_SECRET: Set
✅ NEXTAUTH_URL: Set (https://main.dp6fochd7k0aw.amplifyapp.com)
```

If you see `❌ Missing`, the variable is not set correctly in Amplify.

