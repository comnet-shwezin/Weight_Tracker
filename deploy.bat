@echo off
REM Weight Tracker - Build & Deploy Script (Windows)
REM Usage: deploy.bat

echo.
echo 🔨 Building Weight Tracker for production...
echo.

call npm run build

if %errorlevel% equ 0 (
  echo.
  echo ✅ Build successful!
  echo.
  echo 📁 Build output in: ./dist/
  echo 📦 Ready to deploy to:
  echo    * Vercel: vercel
  echo    * Netlify: netlify deploy --prod --dir=dist
  echo    * GitHub Pages: push dist/ to gh-pages branch
  echo.
  echo 🧪 To test locally:
  echo    npm run preview
  echo.
  echo 📱 To deploy to Vercel (recommended):
  echo    1. npm install -g vercel
  echo    2. vercel --prod
  echo.
) else (
  echo.
  echo ❌ Build failed. Check errors above.
  exit /b 1
)

pause
