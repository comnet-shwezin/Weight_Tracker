# Deploy Weight Tracker to GitHub & Vercel

## 📋 Prerequisites
- GitHub account (free at https://github.com)
- Vercel account (free at https://vercel.com)

---

## PART 1: Upload to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `weight-tracker` (or your preferred name)
   - **Description**: Weight Tracker App with Supabase
   - **Public** or **Private** (your choice)
3. Click **"Create repository"**
4. You'll see instructions - follow them below

### Step 2: Initialize Git in Your Project

Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: Weight Tracker with Supabase"
```

### Step 3: Add Remote and Push

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub details:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/john123/weight-tracker.git
git push -u origin main
```

### Step 4: Verify on GitHub

- Go to https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
- You should see all your files uploaded ✅

---

## PART 2: Deploy on Vercel

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → Use GitHub account
3. Authorize Vercel to access GitHub
4. Click **"Continue"**

### Step 2: Import Your Project

1. Click **"New Project"**
2. Find your `weight-tracker` repository
3. Click **"Import"**

### Step 3: Configure Environment Variables

⚠️ **IMPORTANT:** Add your Supabase credentials:

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add these variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Make sure to add them for **Production** and **Preview**

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. You'll get a live URL like: `https://weight-tracker-xyz.vercel.app`

### Step 5: Verify Deployment

- Click the URL to test your app
- Sign up, add weight data
- Verify data saves to Supabase ✅

---

## 🔒 IMPORTANT: Protect Your Secrets

⚠️ **DO NOT** commit `.env.local` to GitHub:

Check your `.gitignore` file has this line:
```
.env.local
```

If not, add it! This keeps your Supabase keys private.

---

## 🚀 Your App is Live!

Your Weight Tracker is now:
- ✅ On GitHub (code backup)
- ✅ On Vercel (live website)
- ✅ Connected to Supabase (database)
- ✅ Auto-deploys on push to main branch

**Share your live URL:** `https://weight-tracker-xyz.vercel.app`

---

## 📝 Verification Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] App deployed successfully
- [ ] Can sign up and add weight
- [ ] Data saves to Supabase
- [ ] `.env.local` is in `.gitignore`

---

## 🔄 Future Updates

When you make changes:

```bash
# 1. Make changes to code
# 2. Save changes
# 3. Push to GitHub
git add .
git commit -m "Updated login form colors"
git push

# 4. Vercel auto-deploys! (no action needed)
# Watch deployment progress at https://vercel.com/dashboard
```

---

## ❓ Troubleshooting

### Build fails on Vercel
- Check all environment variables are added
- Verify `.env.local` is in `.gitignore`
- Check for TypeScript errors: `npm run lint`

### App shows blank page
- Check browser console (F12) for errors
- Verify Supabase credentials are correct
- Check network tab for API calls

### Can't sign up
- Verify Supabase is accessible from Vercel
- Check RLS policies are correct
- Verify environment variables loaded

---

**Congratulations! Your Weight Tracker is now live on the internet! 🎉**
