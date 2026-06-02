# 💪 Weight Tracker - Offline PWA

A lightweight, 100% offline Progressive Web App for tracking daily weight changes, calculating BMI, and monitoring fitness goals. Works completely on your device—no internet, no servers, no data sent anywhere.

**Supported Languages:** Burmese (မြန်မာ) · English · Japanese (日本語)

---

## ✨ Features

- 📱 **Works on Phone** - Install as a native app on iOS/Android
- 🔌 **100% Offline** - All data stored locally in your browser
- 📊 **Trend Analytics** - Beautiful charts showing weight progress
- 🎯 **Goal Tracking** - Set targets and track progress
- 🏥 **BMI Calculator** - Health insights with personalized tips
- 🌍 **Multi-Language** - Myanmar, English, Japanese
- 🎨 **Beautiful UI** - Dark mode support, responsive design
- ⚡ **Lightning Fast** - ~150KB total, loads instantly

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Visit `http://localhost:3000`

### Build for Production

```bash
# Single command build
npm run build

# Or use the deploy script
./deploy.bat        # Windows
./deploy.sh         # macOS/Linux
```

Output in `dist/` folder - ready to deploy!

---

## 📲 Install on Phone

### Same WiFi Network (Quickest)

1. **Get your computer IP:**
   - Windows: Open Command Prompt → `ipconfig` → look for IPv4 Address
   - macOS/Linux: Terminal → `ifconfig` → look for inet

2. **Start dev server:**
   ```bash
   npm run dev
   ```

3. **On phone browser:**
   - Visit: `http://192.168.X.X:3000` (replace X with your IP)
   - Tap **Add to Home Screen** / **Install App**

4. **Done!** 🎉
   - App icon appears on home screen
   - Works completely offline
   - All data stored locally

### Cloud Deployment (Permanent URL)

#### Option A: Vercel (Easiest)
```bash
npm install -g vercel
vercel --prod
```
Get a permanent URL like `weight-tracker-abc.vercel.app`

#### Option B: Netlify
1. Push to GitHub
2. Connect at [netlify.com](https://netlify.com)
3. Auto-deploys on every push

#### Option C: GitHub Pages
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

---

## 🏗️ Build Details

```
Weight_Tracker/
├── src/                          # React source
│   ├── App.tsx                   # Main component
│   ├── components/               # UI components
│   │   ├── WeightForm.tsx        # Input form
│   │   ├── WeightChart.tsx       # Trend graph
│   │   ├── GoalCard.tsx          # Goal tracking
│   │   ├── BmiCalculator.tsx     # BMI calculator
│   │   ├── HistoryLogs.tsx       # Record list
│   │   └── LanguageSelector.tsx  # Language picker
│   ├── utils/translations.ts     # Multi-language support
│   ├── types.ts                  # TypeScript definitions
│   └── main.tsx                  # Entry point
├── public/
│   ├── manifest.json             # PWA configuration
│   ├── service-worker.js         # Offline cache
│   └── app-icon.png              # App icon
├── package.json
├── tsconfig.json
├── vite.config.ts                # Build config
└── index.html
```

---

## 🗂️ Storage & Backups

All data stored in browser localStorage:
- `weight_tracker_records` - Weight history
- `weight_tracker_goal` - Target goals
- `weight_tracker_lang` - Language preference

### Export Data (Backup)
```javascript
// DevTools Console (F12)
const backup = {
  records: JSON.parse(localStorage.getItem('weight_tracker_records')),
  goal: JSON.parse(localStorage.getItem('weight_tracker_goal')),
  lang: localStorage.getItem('weight_tracker_lang')
};
console.log(JSON.stringify(backup, null, 2));
// Copy output to file
```

### Restore Data
```javascript
const data = { /* your backup JSON */ };
Object.entries(data).forEach(([key, value]) => {
  localStorage.setItem('weight_tracker_' + key, 
    typeof value === 'string' ? value : JSON.stringify(value));
});
location.reload();
```

---

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Fast build tool
- **Recharts** - Beautiful charts
- **PWA** - Native app experience

---

## 📚 Documentation

For detailed setup and troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🙏 Privacy & Security

✅ **100% Private** - All data stays on your device  
✅ **No Tracking** - No analytics, no ads  
✅ **No Servers** - Works completely offline  
✅ **No Account** - Just install and use  

---

## 📝 Scripts

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Create production build
npm run preview   # Test production build locally
npm run lint      # TypeScript type check
npm run clean     # Clean build artifacts
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| App won't install on phone | Use Chrome/Safari on recent versions, ensure HTTP localhost or HTTPS URL |
| Offline mode not working | Hard refresh (Ctrl+Shift+R), clear browser cache |
| Data lost after restart | Always backup important data (see Export Data section) |
| Service Worker not updating | Clear cache + hard refresh |

---

## 📞 Support

Check console (F12) for error messages and logs.

---

## 📄 License

Apache 2.0

---

**Made with ❤️ for fitness tracking without internet**

