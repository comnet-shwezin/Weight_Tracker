# 📱 Install Weight Tracker on Your Phone - Quick Guide

## Step 1️⃣: Find Your Computer's IP Address

### Windows:
1. Open **Command Prompt** (Win + R → type `cmd` → Enter)
2. Type: `ipconfig`
3. Look for **"IPv4 Address"** like `192.168.1.100` (or similar)
4. Remember this number!

### Mac/Linux:
1. Open **Terminal**
2. Type: `ifconfig`
3. Look for **inet** like `192.168.1.100`

---

## Step 2️⃣: Start the App on Your Computer

```bash
npm run dev
```

Wait until you see:
```
  VITE v6.2.3  ready in 123 ms

  ➜  Local:   http://localhost:3000
  ➜  Network: http://192.168.1.100:3000
```

**Remember:** `192.168.1.100:3000` (your IP will be different)

---

## Step 3️⃣: Open App on Your Phone

Make sure your phone is on **the same WiFi network** as your computer!

### iPhone 📲
1. Open **Safari** browser
2. In address bar, type: `http://192.168.1.100:3000`
3. Wait for app to load (first time takes ~10 seconds)
4. Tap **↗️ Share** button (bottom bar)
5. Scroll down → Tap **Add to Home Screen**
6. Type name: `Weight Tracker` (or keep default)
7. Tap **Add** (top right)

✅ **Done!** Icon now on your home screen!

### Android 📱
1. Open **Chrome** or **Firefox**
2. In address bar, type: `http://192.168.1.100:3000`
3. Wait for app to load
4. Tap **⋮ Menu** (three dots, top right)
5. Tap **Install app** or **Add to Home Screen**
6. Confirm when asked
7. Tap **Install**

✅ **Done!** Icon now on your home screen!

---

## Step 4️⃣: Test It Works Offline

1. Open the app from home screen (NOT from browser address bar)
2. Use it for a moment to make sure it loads
3. **Turn OFF WiFi** on your phone
4. Open the app again
5. ✅ It still works! (No internet needed)

---

## 🔄 To Update the App

1. On your computer: `npm run dev`
2. On your phone: Reopen the app
3. It auto-updates in background

---

## ⚠️ If Phone Can't Find Your Computer

### Common Issues:

❌ **"Cannot reach address"**
- ❌ Verify both on same WiFi network
- ❌ Check firewall isn't blocking port 3000
- ✅ Try typing computer name instead of IP

❌ **"Connection refused"**
- ❌ Dev server not running on computer
- ✅ Run `npm run dev` again

❌ **"ERR_INTERNET_DISCONNECTED"**
- ❌ WiFi disconnected on phone
- ✅ Reconnect to same WiFi as computer

---

## 📱 For Permanent URL (No IP Needed)

After testing, deploy to get a permanent link:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

Then share link like: `https://weight-tracker-abc.vercel.app`

Anyone can use it with this link, from anywhere, on any device!

---

## 💡 Pro Tips

- 📌 App icon on home screen = "installed" as app
- 🔌 Works offline = no WiFi needed after first load
- 💾 Data stored on phone = never sent to servers
- 🔄 Multiple phones = each has separate data (not synced)
- 🌐 Test on 4G/5G = after deploying to Vercel

---

## 🆘 Still Having Issues?

1. Open **DevTools** on computer (F12)
2. Check **Console** tab for error messages
3. Take screenshot of error
4. Share the error message for help

---

**Questions?** See full guide at [SETUP_GUIDE.md](./SETUP_GUIDE.md)
