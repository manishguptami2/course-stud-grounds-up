# AWS Amplify Environment Variables Setup Guide

## Step-by-Step Instructions

### 1. Access Environment Variables in AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app
3. Click on **"Environment variables"** in the left sidebar (under "App settings")
4. Click **"Manage variables"** button

### 2. Required Environment Variables

Add the following environment variables one by one:

---

## 🔐 NEXTAUTH_SECRET

**What it is:** A secret key used to encrypt JWT tokens and session data. Must be a random, secure string.

**How to generate:**
```bash
# Option 1: Using Node.js (if you have it installed)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 2: Using OpenSSL
openssl rand -base64 32

# Option 3: Using PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**In Amplify:**
- **Variable name:** `NEXTAUTH_SECRET`
- **Value:** Paste the generated secret (it will be a long base64 string)
- **⚠️ Important:** Keep this secret secure and never commit it to Git

**Example value:**
```
kX9pL2mN5qR8sT1vW4yZ7aB0cD3eF6gH9jK2mN5qR8sT1vW4yZ7aB0cD3eF6gH9jK2mN5qR8=
```

---

## 🌐 NEXTAUTH_URL

**What it is:** The canonical URL of your application. This is used by NextAuth.js to generate callback URLs.

**How to find your Amplify URL:**
1. In AWS Amplify Console, go to your app
2. Look at the **"App domain"** section
3. Your URL will be something like: `https://main.xxxxxxxxxxxx.amplifyapp.com`
   - Or if you have a custom domain: `https://yourdomain.com`

**In Amplify:**
- **Variable name:** `NEXTAUTH_URL`
- **Value:** Your full Amplify app URL (with `https://`)

**Examples:**
```
https://main.d1234567890abc.amplifyapp.com
```
or if using custom domain:
```
https://lms.yourdomain.com
```

**⚠️ Important Notes:**
- Must include `https://` protocol
- Must NOT have a trailing slash (`/`)
- If you have multiple branches (main, dev, staging), set this for each branch or use the branch-specific URL

---

## 📋 Complete Environment Variables Checklist

Add ALL of these to AWS Amplify:

### Authentication
- [ ] `NEXTAUTH_SECRET` - Generated secret (see above)
- [ ] `NEXTAUTH_URL` - Your Amplify app URL

### Database
- [ ] `DATABASE_URL` - Your PostgreSQL connection string
  ```
  postgresql://username:password@your-rds-endpoint:5432/dbname?sslmode=require
  ```

### AWS S3 (for file uploads)
- [ ] `REGION` - Your AWS region (e.g., `eu-north-1`, `us-east-1`)
- [ ] `ACCESS_KEY_ID` - Your AWS access key
- [ ] `SECRET_ACCESS_KEY` - Your AWS secret key
- [ ] `S3_BUCKET_NAME` - Your S3 bucket name

### Node Environment
- [ ] `NODE_ENV` - Set to `production`

---

## 🎯 Quick Setup Steps

1. **Generate NEXTAUTH_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Copy the output

2. **Find your Amplify URL:**
   - Go to Amplify Console → Your App → App domain
   - Copy the full URL (e.g., `https://main.xxxxx.amplifyapp.com`)

3. **Add to Amplify:**
   - App settings → Environment variables → Manage variables
   - Click "Add variable"
   - Add each variable one by one

4. **Redeploy:**
   - After adding variables, Amplify will automatically trigger a new deployment
   - Or manually trigger: Actions → Redeploy this version

---

## 🔍 Verification

After deployment, verify the environment variables are working:

1. Check Amplify build logs to ensure no errors
2. Try logging in to your app
3. Check browser console for any NextAuth errors
4. Verify file uploads work (if using S3)

---

## ⚠️ Common Issues

### Issue: "NEXTAUTH_URL is not set"
- **Solution:** Make sure you added `NEXTAUTH_URL` with the full URL including `https://`

### Issue: "Invalid NEXTAUTH_SECRET"
- **Solution:** Generate a new secret using the command above and update it in Amplify

### Issue: Authentication redirects to wrong URL
- **Solution:** Ensure `NEXTAUTH_URL` matches your actual app domain exactly

### Issue: Session not persisting
- **Solution:** Check that `NEXTAUTH_SECRET` is set and is the same across all instances (if using multiple branches)

---

## 📝 Example: Complete Environment Variables

Here's what your Amplify environment variables should look like:

```
NEXTAUTH_SECRET=kX9pL2mN5qR8sT1vW4yZ7aB0cD3eF6gH9jK2mN5qR8sT1vW4yZ7aB0cD3eF6gH9jK2mN5qR8=
NEXTAUTH_URL=https://main.d1234567890abc.amplifyapp.com
DATABASE_URL=postgresql://postgres:password@your-rds-endpoint:5432/dbname?sslmode=require
REGION=eu-north-1
ACCESS_KEY_ID=AKIA...
SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=your-bucket-name
NODE_ENV=production
```

---

## 🔐 Security Best Practices

1. ✅ Never commit secrets to Git (your `.env` is already in `.gitignore`)
2. ✅ Use different `NEXTAUTH_SECRET` for each environment (dev, staging, prod)
3. ✅ Rotate secrets periodically
4. ✅ Use AWS Secrets Manager for production (advanced)
5. ✅ Restrict IAM permissions for S3 access keys

---

## 📞 Need Help?

If you encounter issues:
1. Check Amplify build logs for errors
2. Verify all environment variables are set correctly
3. Ensure your RDS database is accessible from Amplify
4. Check S3 bucket permissions

