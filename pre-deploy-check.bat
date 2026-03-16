@echo off
REM EduBoost AI - Pre-Deployment Checklist (Windows)
REM Run this before pushing to GitHub to ensure everything is ready!

echo.
echo 🚀 EduBoost AI - Pre-Deployment Checklist
echo ==========================================
echo.

setlocal enabledelayedexpansion

REM Function to check if file exists
:check_file_exists
if exist "%~1" (
    echo ✅ %~1
    goto :eof
) else (
    echo ❌ %~1 (MISSING)
    goto :eof
)

REM Check Essential Files
echo 📋 Checking Essential Files...
echo ---

if exist "package.json" (echo ✅ package.json) else (echo ❌ package.json)
if exist "netlify.toml" (echo ✅ netlify.toml) else (echo ❌ netlify.toml)
if exist "index.html" (echo ✅ index.html) else (echo ❌ index.html)
if exist "public\ads.txt" (echo ✅ public/ads.txt) else (echo ❌ public/ads.txt)
if exist "config\adsenseConfig.ts" (echo ✅ config/adsenseConfig.ts) else (echo ❌ config/adsenseConfig.ts)
if exist "components\AdSense.tsx" (echo ✅ components/AdSense.tsx) else (echo ❌ components/AdSense.tsx)
if exist ".gitignore" (echo ✅ .gitignore) else (echo ❌ .gitignore)
if exist ".env.example" (echo ✅ .env.example) else (echo ❌ .env.example)

echo.
echo 📁 Checking Directories...
echo ---

if exist "components\" (echo ✅ components/) else (echo ❌ components/)
if exist "config\" (echo ✅ config/) else (echo ❌ config/)
if exist "netlify\functions\" (echo ✅ netlify/functions/) else (echo ❌ netlify/functions/)
if exist "public\" (echo ✅ public/) else (echo ❌ public/)
if exist "pages\" (echo ✅ pages/) else (echo ❌ pages/)
if exist "hooks\" (echo ✅ hooks/) else (echo ❌ hooks/)

echo.
echo 🔒 Checking Security...
echo ---

REM Check if .env exists
if exist ".env" (
    echo ⚠️  .env file exists (make sure it's in .gitignore)
) else (
    echo ✅ .env file not present (good!)
)

echo.
echo 🏗️ Checking Build Configuration...
echo ---

REM Check netlify.toml
findstr /M "npm run build" netlify.toml >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo ✅ Build command configured
) else (
    echo ❌ Build command not found in netlify.toml
)

findstr /M "publish = \"dist\"" netlify.toml >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo ✅ Publish directory configured
) else (
    echo ❌ Publish directory not configured
)

echo.
echo 📦 Checking Dependencies...
echo ---

if exist "node_modules\" (
    echo ✅ Dependencies installed
) else (
    echo ⚠️  Run 'npm install' to install dependencies
)

echo.
echo 🎯 Checking Gentle Ads Configuration...
echo ---

findstr /M "maxAdsPerPage: 3" config\adsenseConfig.ts >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo ✅ Max 3 ads per page configured
) else (
    echo ❌ Max ads setting not found
)

findstr /M "minDistanceBetweenAds: 300" config\adsenseConfig.ts >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo ✅ 300px minimum spacing configured
) else (
    echo ❌ Spacing setting not found
)

findstr /M "autoRefresh: false" config\adsenseConfig.ts >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo ✅ No auto-refresh (gentle placement)
) else (
    echo ⚠️  Auto-refresh setting not found
)

echo.
echo 🔗 Checking GitHub Configuration...
echo ---

if exist ".git\" (
    echo ✅ Git repository initialized

    REM Check for remote
    git remote | findstr "origin" >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo ✅ GitHub remote configured
    ) else (
        echo ⚠️  GitHub remote not set
        echo    Run: git remote add origin https://github.com/YOUR_USERNAME/EduBoost.git
    )
) else (
    echo ⚠️  Git not initialized
    echo    Run: git init
)

echo.
echo 🏁 Building Project...
echo ---

REM Try to build
npm run build >nul 2>&1
if !ERRORLEVEL! EQU 0 (
    echo ✅ Project builds successfully
) else (
    echo ❌ Build failed - run 'npm run build' to see errors
)

echo.
echo ==========================================
echo 📋 Pre-Deployment Summary
echo ==========================================
echo.
echo Before deploying:
echo 1. Fix any ❌ items above
echo 2. Run: git add .
echo 3. Run: git commit -m "feat: gentle ads + github deployment"
echo 4. Run: git push -u origin main
echo 5. Go to https://app.netlify.com
echo 6. Click "Add new site" and import from GitHub
echo 7. Enable Auto Ads in Google AdSense
echo 8. Wait 24-48 hours for ads to appear
echo.
echo 📚 Documentation:
echo    - ADSENSE_GENTLE_ADS_POLICY.md
echo    - GITHUB_DEPLOYMENT_GUIDE.md
echo    - ADSENSE_AUTO_ADS_GUIDE.md
echo.
echo ✅ Ready to deploy? Push to GitHub when all checks pass!
echo.

endlocal
