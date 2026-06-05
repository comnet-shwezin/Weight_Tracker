# Weight Tracker + Supabase Integration - Complete Setup Guide

## 🎯 Overview
You now have:
- ✅ Supabase utilities (client, database, auth)
- ✅ Login & Signup components
- ✅ Updated App.tsx with full authentication
- ⏳ Need to: Set up Supabase account and credentials

---

## STEP-BY-STEP SETUP

### ✅ PART 1: Install Dependencies (Already Done)

Run this command:
```bash
npm install @supabase/supabase-js
```

---

### 📋 PART 2: Create Supabase Account

**Step 1: Go to Supabase**
- Open https://supabase.com
- Click **"Start Your Project"** or **"Sign Up"**

**Step 2: Sign Up**
- Use email or GitHub
- Verify your email
- You'll land on the dashboard

**Step 3: Create a New Project**
- Click **"New Project"** (blue button)
- Fill in the form:
  - **Project Name**: `weight-tracker`
  - **Database Password**: Create a strong password (SAVE THIS!)
  - **Region**: Choose your location
- Click **"Create new project"**
- ⏳ Wait 2-3 minutes (progress bar will show)

---

### 🔑 PART 3: Get Your Credentials

Once project is created:

1. Click **Settings** → **API** (left sidebar)
2. You'll see:
   - **Project URL** (copy this)
   - **Anon Public Key** (copy this)
3. Save both values safely

---

### ⚙️ PART 4: Create `.env.local` File

In your project root (same folder as package.json), create a file called `.env.local`:

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Replace with your actual values from Part 3**

Example:
```
VITE_SUPABASE_URL=https://xyzabc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 📊 PART 5: Create Database Tables

In Supabase Dashboard:

1. Go to **SQL Editor** (left sidebar)
2. Click **"New Query"** (blue button)
3. Delete any existing text
4. **Paste this entire SQL code**:

```sql
-- Create users profile table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create weight_records table
CREATE TABLE weight_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(3) NOT NULL CHECK (unit IN ('kg', 'lbs')),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create weight_goals table
CREATE TABLE weight_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  target_weight DECIMAL(10, 2),
  start_weight DECIMAL(10, 2),
  unit VARCHAR(3) NOT NULL CHECK (unit IN ('kg', 'lbs')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weight_records
CREATE POLICY "Users can view their own records" ON weight_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own records" ON weight_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own records" ON weight_records
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own records" ON weight_records
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for weight_goals
CREATE POLICY "Users can view their own goal" ON weight_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goal" ON weight_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goal" ON weight_goals
  FOR UPDATE USING (auth.uid() = user_id);
```

5. Click **"Run"** button
6. ✅ You should see success messages

---

### 🚀 PART 6: Test Your App

1. Open terminal in project folder
2. Run:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000
4. You'll see the **Signup** page
5. Create a test account:
   - Email: `test@example.com`
   - Password: (any 6+ characters)
6. After signup, you'll be logged in!
7. Try adding a weight record
8. Refresh the page - your data persists (it's in Supabase!)

---

## 📁 File Structure

Your new files:
```
src/
├── components/
│   ├── Login.tsx          ✨ NEW
│   └── Signup.tsx         ✨ NEW
├── utils/
│   ├── supabase.ts        ✨ NEW
│   ├── auth.ts            ✨ NEW
│   ├── database.ts        ✨ NEW
│   └── translations.ts
└── App.tsx                📝 UPDATED
```

---

## 🔐 Features Included

✅ **User Authentication**
- Sign up with email
- Sign in 
- Sign out
- Automatic session persistence

✅ **Database Operations**
- Add weight records
- Delete records
- Update goals
- All data synced to Supabase

✅ **Security**
- Row Level Security (RLS) - users can only see their own data
- Password hashing
- Secure token storage

✅ **Multi-language Support**
- Keep existing language selector
- Works with new auth system

---

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
npm install @supabase/supabase-js
```

### "VITE_SUPABASE_URL is not defined"
**Solution:**
- Make sure `.env.local` file exists in project root
- Check values are correct (no quotes)
- Restart dev server (`npm run dev`)

### "User creation failed"
**Possible issues:**
- Email already exists (use different email)
- Password too short (use 6+ characters)
- Check browser console for error details

### Data not saving
**Check:**
1. Are you logged in?
2. Is `.env.local` configured?
3. Check browser DevTools → Network tab for API errors
4. Check Supabase Dashboard for table creation

---

## 📚 Next Steps (Optional)

- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Import old data from localStorage
- [ ] Add multi-device sync indicator
- [ ] Add profile settings page
- [ ] Add export data as CSV

---

## 🆘 Need Help?

1. **Check .env.local** - most issues stem from missing credentials
2. **Check browser console** - click F12, look for error messages
3. **Check Supabase Dashboard** - verify tables created correctly
4. **Restart dev server** - sometimes env changes need reload

---

**Congratulations! You now have a full-stack weight tracker with cloud database! 🎉**
