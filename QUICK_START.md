# 🚀 QUICK REFERENCE - Gentle Ads + GitHub Deployment

## 📋 One-Page Quick Guide

### ✅ What's Configured

```
GENTLE ADS
└─ Max 3 ads/page
└─ 300px spacing
└─ No auto-refresh
└─ Mobile optimized
└─ Privacy-friendly

GITHUB READY
└─ .gitignore configured
└─ netlify.toml set up
└─ ads.ts function ready
└─ .env.example provided

GAME FIXES
└─ TrueScholar answers verified
└─ Timeline: 1→3 missions
└─ All correct answers
```

---

## 🎯 4-Step Deployment

### STEP 1: Test Locally
```bash
npm install
npm run dev
# Visit http://localhost:3000
# F12 → Console → No red errors? ✅
```

### STEP 2: Pre-Deploy Check
```bash
# Windows:
pre-deploy-check.bat

# Mac/Linux:
bash pre-deploy-check.sh

# All ✅? Continue. Any ❌? Fix first.
```

### STEP 3: Push to GitHub
```bash
git add .
git commit -m "feat: gentle ads + github deployment"
git push -u origin main
```

### STEP 4: Deploy to Netlify
1. Visit https://app.netlify.com
2. Click "Add new site"
3. Choose GitHub → EduBoost
4. Auto-configured from netlify.toml
5. Click "Deploy site"
6. Wait ~2-3 minutes
7. ✅ Done! Your site is live

---

## 💰 Enable Monetization

```
1. Go to: https://adsense.google.com
2. Navigate to: Ads → Ad units
3. Toggle: "Enable Auto ads" → ON
4. Toggle: "Auto-optimize" → ON
5. Click: "Save"
6. Wait: 24-48 hours for ads
```

---

## 📊 Key Settings

| Setting | Value | Why |
|---------|-------|-----|
| Max Ads | 3 | Google recommended |
| Spacing | 300px | No cramping |
| Auto-Refresh | OFF | Gentle placement |
| Responsive | ON | Mobile friendly |
| Auto Ads | ON | Better revenue |

---

## 🔗 Your Links (After Deployment)

```
GitHub:     https://github.com/YOUR_USERNAME/EduBoost
Netlify:    https://your-site.netlify.app
AdSense:    https://adsense.google.com
```

---

## ❓ Common Questions

**Q: When will ads appear?**
A: 24-48 hours after enabling Auto Ads

**Q: How much will I earn?**
A: $0.50-5 per 1000 views (depends on traffic quality)

**Q: Do I need slot IDs?**
A: No, Auto Ads handles everything

**Q: Can I modify ads.txt?**
A: Yes, edit `/public/ads.txt` and redeploy

**Q: Is my .env exposed?**
A: No, it's in .gitignore and never deployed

---

## 🧪 Test Commands

```bash
# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Test build
npm run preview

# Pre-deploy check
pre-deploy-check.bat  # Windows

# Git push
git push -u origin main
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `index.html` | Auto Ads script |
| `config/adsenseConfig.ts` | Gentle ad settings |
| `components/AdSense.tsx` | Ad component |
| `netlify.toml` | Deployment config |
| `netlify/functions/ads.ts` | Error handling |
| `public/ads.txt` | Ad networks list |
| `.gitignore` | Security (.env) |

---

## ⚠️ Don't Forget

- [ ] Replace `YOUR_USERNAME` in GitHub URL
- [ ] Don't commit `.env` file (in .gitignore)
- [ ] Wait 24-48 hours for ads
- [ ] Check AdSense dashboard for status
- [ ] Enable Auto Ads toggle

---

## 🎉 You're Ready!

Your site has:
✅ Gentle, non-intrusive ads
✅ GitHub integration
✅ Netlify deployment
✅ Auto Ads enabled
✅ Error handling
✅ Security configured

**Deploy now and start earning!** 🚀

---

## 📞 Quick Help

**Ads not showing?**
→ Check Auto Ads is ON in AdSense
→ Wait 48 hours (Google is indexing)

**Build failing?**
→ Run `npm run build` locally
→ Fix any errors before pushing

**ads.txt 404?**
→ Verify it exists at `/public/ads.txt`
→ Check netlify.toml redirect is set

**GitHub branch issue?**
→ Run `git branch -M main`
→ Then `git push -u origin main`

---

**Last Updated:** March 16, 2026
**Status:** ✅ READY TO DEPLOY
