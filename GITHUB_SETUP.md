# GitHub Setup Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `course-stud-grounds-up` (or your preferred name)
   - **Description**: "Learning Management System built with Next.js, Prisma, and NextAuth"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## Step 2: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/course-stud-grounds-up.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH (and have SSH keys set up):

```bash
git remote add origin git@github.com:YOUR_USERNAME/course-stud-grounds-up.git
git branch -M main
git push -u origin main
```

## Important Notes

⚠️ **Security Reminders:**
- ✅ Your `.env` file is already in `.gitignore` - it won't be committed
- ⚠️ The `AWS migrate instructions.docx` file was committed - review it to ensure it doesn't contain sensitive credentials
- ✅ Database files (`prisma/dev.db`) are now excluded
- ✅ Uploaded files in `public/uploads/` are excluded

## Next Steps After Pushing

1. **Set up GitHub Secrets** (if using GitHub Actions):
   - Go to repository → Settings → Secrets and variables → Actions
   - Add your environment variables as secrets

2. **Connect to AWS Amplify** (for deployment):
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Configure build settings and environment variables

3. **Update README** (optional):
   - Remove any sensitive information from README.md
   - Add deployment instructions

