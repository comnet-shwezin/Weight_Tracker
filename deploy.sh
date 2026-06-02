#!/bin/bash

# Weight Tracker - Build & Deploy Script
# Usage: ./deploy.sh

echo "🔨 Building Weight Tracker for production..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo ""
  echo "📁 Build output in: ./dist/"
  echo "📦 Ready to deploy to:"
  echo "   • Vercel: vercel"
  echo "   • Netlify: netlify deploy --prod --dir=dist"
  echo "   • GitHub Pages: git add dist && git commit && git push"
  echo ""
  echo "🧪 To test locally:"
  echo "   npm run preview"
  echo ""
  echo "📱 To deploy to Vercel (recommended):"
  echo "   1. npm install -g vercel"
  echo "   2. vercel --prod"
else
  echo "❌ Build failed. Check errors above."
  exit 1
fi
