# 📱 Weight Tracker - Setup & PWA Deployment Guide

## Overview
Your Weight Tracker is a **Progressive Web App (PWA)** that works **100% offline**. It stores all data locally on your device using browser storage.

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
- Opens at `http://localhost:3000`
- Hot reload enabled
- Service worker active

### 3. Test the App Offline
1. Open DevTools (F12 → Application tab)
2. Check "Offline" mode
3. Refresh the page - app still works!

---

## 🏗️ Build & Export

### Build for Production
```bash
npm run build
```
Creates optimized files in `dist/` folder:
- Minified React code
- Optimized CSS/JS bundles
- Service worker ready
- **~150KB total** (loads instantly!)

### Preview Build Locally
```bash
npm run preview
```
Tests the production build at `http://localhost:4173`

---

## 📲 Install on Phone

### Option 1: iPhone (iOS)
1. Open Safari browser
2. Visit: `http://192.168.x.x:3000` (replace with your computer IP)
   - Find IP: Windows terminal → `ipconfig` → look for "IPv4 Address"
   - Or use local network address
3. Tap **Share** button (↗️ in bottom bar)
4. Select **Add to Home Screen**
5. Name it "Weight Tracker"
6. Tap **Add**
✅ Now appears as app on home screen!

### Option 2: Android Phone
1. Open Chrome/Firefox browser
2. Visit: `http://192.168.x.x:3000`
3. Tap **Menu** (⋮) → **Install app** or **Add to Home Screen**
4. Confirm installation
✅ Full app icon on home screen!

### Option 3: Deploy to Cloud (Free Options)

#### A. Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
- Visit your deployed app on any phone
- Auto-HTTPS (required for PWA)
- Instant installation

#### B. Deploy to GitHub Pages
```bash
# Update vite.config.ts base to '/weight-tracker/'
npm run build
# Then push dist/ to gh-pages branch
```

#### C. Deploy to Netlify
1. Push code to GitHub
2. Connect at netlify.com
3. Auto-deploys on every push

---

## 🔗 Connect to Network for Testing

### On Same WiFi Network

1. **Find Your Computer IP:**
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```
   Look for IPv4 Address like `192.168.1.100`

2. **Start Dev Server:**
   ```bash
   npm run dev
   ```

3. **On Phone - Open Browser:**
   - Visit: `http://192.168.1.100:3000` (use YOUR IP)
   - Wait for page to load
   - Now you can "Add to Home Screen"

4. **Disconnect WiFi:**
   - App works OFFLINE instantly
   - All data saved locally
   - No internet needed!

---

## 💾 Data Storage & Privacy

### Where Data Lives
- **Browser Storage:** 5-10MB available
- **Location:** Device only (never sent anywhere)
- **Access:** No servers involved

### Backup Your Data

#### Export Data (JSON)
```javascript
// Open DevTools Console (F12)
const data = {
  records: JSON.parse(localStorage.getItem('weight_tracker_records')),
  goal: JSON.parse(localStorage.getItem('weight_tracker_goal')),
  language: localStorage.getItem('weight_tracker_lang')
};
console.log(JSON.stringify(data, null, 2));
// Copy and save to file
```

#### Restore Data
```javascript
const data = { /* pasted JSON */ };
localStorage.setItem('weight_tracker_records', JSON.stringify(data.records));
localStorage.setItem('weight_tracker_goal', JSON.stringify(data.goal));
localStorage.setItem('weight_tracker_lang', data.language);
location.reload();
```

---

## 🌐 Language Support

App automatically detects browser language and shows:
- 🇲🇲 **Burmese (မြန်မာ)**
- 🇺🇸 **English (EN)**
- 🇯🇵 **Japanese (日本語)**

Or manually select from the top-right menu.

---

## 📊 Features

✅ Track daily weight changes  
✅ Calculate weight loss/gain  
✅ Beautiful trend charts  
✅ BMI calculator  
✅ Goal tracking  
✅ 100% offline  
✅ No account needed  
✅ No ads  
✅ Works on all devices  

---

## 🐛 Troubleshooting

### App Won't Install on Phone
- ❌ Check: Browser doesn't support PWA (use Chrome/Safari)
- ❌ Check: Not on HTTPS or localhost
- ✅ Solution: Deploy to Vercel or Netlify

### Data Lost After Restart
- App stores in browser cache - clearing cache deletes data
- **Solution:** Export data regularly (see Backup section)

### Service Worker Not Updating
- Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` Mac)
- Clear all caches: DevTools → Application → Clear storage

### Offline Mode Not Working
- ❌ Check: Service worker registered (F12 → Application → Service Workers)
- ✅ Solution: Reload page and wait 5 seconds for registration

---

## 📦 File Structure
```
Weight_Tracker/
├── src/
│   ├── App.tsx              # Main app component
│   ├── components/          # React components
│   ├── utils/translations.ts # Language support
│   ├── types.ts             # TypeScript types
│   └── main.tsx             # Entry point
├── public/
│   ├── manifest.json        # PWA config
│   ├── app-icon.png         # App icon
│   └── service-worker.js    # Offline cache
├── package.json             # Dependencies
├── vite.config.ts           # Build config
└── index.html               # HTML template
```

---

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Test on phone via WiFi network
4. ✅ Add to home screen
5. ✅ Test offline mode
6. ✅ Deploy to Vercel for permanent URL

---

## 📞 Support
Questions? Check browser console (F12) for error messages.
