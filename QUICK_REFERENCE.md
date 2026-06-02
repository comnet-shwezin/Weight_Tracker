# 🚀 Weight Tracker - Quick Reference Card

## One-Line Commands

```bash
# Development
npm run dev          # Start at localhost:3000

# Production
npm run build        # Create optimized build in ./dist/
npm run preview      # Test production build locally

# Cleanup
npm run clean        # Remove dist/ and build files
npm run lint         # Check for TypeScript errors
```

---

## 📱 Install on Phone - 3 Steps

### Step 1: Start the App (Computer)
```bash
npm run dev
```

### Step 2: Find Your IP (Windows)
```cmd
ipconfig
```
Look for IPv4 Address like `192.168.1.100`

### Step 3: Phone Browser
Visit: `http://192.168.1.100:3000`

Then:
- **iPhone:** Share → Add to Home Screen
- **Android:** Menu (⋮) → Install App

---

## 🌐 Deploy to Cloud (Permanent URL)

```bash
npm install -g vercel
vercel --prod
```

Get URL like: `weight-tracker-abc.vercel.app`

Share with anyone!

---

## 🗂️ Folder Structure

```
src/
  ├── App.tsx              # Main component
  ├── components/          # UI parts
  │   ├── WeightForm.tsx
  │   ├── WeightChart.tsx
  │   ├── BmiCalculator.tsx
  │   ├── GoalCard.tsx
  │   ├── HistoryLogs.tsx
  │   └── LanguageSelector.tsx
  ├── utils/translations.ts # 3 languages
  └── types.ts             # Type definitions

public/
  ├── manifest.json        # PWA config
  ├── service-worker.js    # Offline cache
  └── app-icon.png         # Icon

dist/                       # Build output (after npm run build)
```

---

## 📊 Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| Offline | ✅ | 100% local storage |
| Multi-language | ✅ | Myanmar, English, Japanese |
| Mobile | ✅ | PWA install on phone |
| Charts | ✅ | Trend analytics |
| BMI | ✅ | Health calculator |
| Goals | ✅ | Target tracking |
| Dark Mode | ✅ | Automatic detection |

---

## 🔧 Troubleshooting 1-2-3

1. **Delete cache:**
   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   ```

2. **Hard refresh:**
   - Desktop: Ctrl+Shift+R (or Cmd+Shift+R Mac)
   - Phone: Close app + reopen

3. **Check console:**
   - Press F12 → Console tab
   - Look for red error messages

---

## 💾 Backup Your Data

### Export (Backup)
```javascript
// DevTools Console (F12)
copy(JSON.stringify({
  records: JSON.parse(localStorage.getItem('weight_tracker_records')),
  goal: JSON.parse(localStorage.getItem('weight_tracker_goal')),
  lang: localStorage.getItem('weight_tracker_lang')
}, null, 2))
// Paste into text file
```

### Import (Restore)
```javascript
// DevTools Console (F12)
const data = { /* paste your backup JSON */ };
localStorage.setItem('weight_tracker_records', JSON.stringify(data.records));
localStorage.setItem('weight_tracker_goal', JSON.stringify(data.goal));
localStorage.setItem('weight_tracker_lang', data.lang);
location.reload();
```

---

## 📚 Documentation Files

- **README.md** ← Main info
- **SETUP_GUIDE.md** ← Full tutorial
- **PHONE_INSTALL_GUIDE.md** ← Phone steps
- **SUMMARY.md** ← Complete overview
- **This file** ← Quick reference

---

## 🎯 Typical Workflow

```
1. Start dev server
   npm run dev

2. Test locally
   Visit localhost:3000

3. Add test data
   Enter a few weight entries

4. Test on phone
   Visit from phone on same WiFi

5. Build for production
   npm run build

6. Deploy to Vercel
   vercel --prod

7. Share the link!
   Everyone can now use it
```

---

## 🔗 Useful Links

- **Vercel:** https://vercel.com
- **React:** https://react.dev
- **Tailwind:** https://tailwindcss.com
- **Vite:** https://vitejs.dev
- **PWA Docs:** https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

---

## ✨ You're All Set!

- ✅ App built and tested
- ✅ Ready to install on phone
- ✅ Ready to deploy online
- ✅ Documentation complete

**Start with:** `npm run dev` 🚀

---

*Questions? See SETUP_GUIDE.md or check F12 console for errors*
