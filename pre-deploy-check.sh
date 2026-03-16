#!/bin/bash

# EduBoost AI - Pre-Deployment Checklist
# Run this before pushing to GitHub to ensure everything is ready!

echo "🚀 EduBoost AI - Pre-Deployment Checklist"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 (MISSING)"
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/ (MISSING)"
        return 1
    fi
}

echo "📋 Checking Essential Files..."
echo "---"

# Check critical files
check_file "package.json"
check_file "netlify.toml"
check_file "index.html"
check_file "public/ads.txt"
check_file "config/adsenseConfig.ts"
check_file "components/AdSense.tsx"
check_file ".gitignore"
check_file ".env.example"

echo ""
echo "📁 Checking Directories..."
echo "---"

# Check critical directories
check_dir "components"
check_dir "config"
check_dir "netlify/functions"
check_dir "public"
check_dir "pages"
check_dir "hooks"

echo ""
echo "🔒 Checking Security..."
echo "---"

# Check .gitignore has .env
if grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✅${NC} .env is in .gitignore (secure)"
else
    echo -e "${YELLOW}⚠️${NC}  .env might not be in .gitignore"
fi

# Check .env file is NOT tracked
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️${NC}  .env file exists (make sure it's in .gitignore)"
fi

echo ""
echo "🏗️ Checking Build Configuration..."
echo "---"

# Check netlify.toml for build command
if grep -q "command = \"npm run build\"" netlify.toml; then
    echo -e "${GREEN}✅${NC} Build command configured"
else
    echo -e "${RED}❌${NC} Build command not found in netlify.toml"
fi

# Check netlify.toml for publish directory
if grep -q "publish = \"dist\"" netlify.toml; then
    echo -e "${GREEN}✅${NC} Publish directory configured (dist)"
else
    echo -e "${RED}❌${NC} Publish directory not configured"
fi

# Check netlify.toml for functions
if grep -q "functions = \"netlify/functions\"" netlify.toml; then
    echo -e "${GREEN}✅${NC} Netlify functions configured"
else
    echo -e "${YELLOW}⚠️${NC}  Netlify functions not configured"
fi

echo ""
echo "📦 Checking Dependencies..."
echo "---"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} Dependencies installed (node_modules/)"
else
    echo -e "${YELLOW}⚠️${NC}  Run 'npm install' to install dependencies"
fi

echo ""
echo "🎯 Checking Gentle Ads Configuration..."
echo "---"

# Check adsenseConfig has proper settings
if grep -q "maxAdsPerPage: 3" config/adsenseConfig.ts; then
    echo -e "${GREEN}✅${NC} Max 3 ads per page configured"
else
    echo -e "${RED}❌${NC} Max ads setting not found"
fi

if grep -q "minDistanceBetweenAds: 300" config/adsenseConfig.ts; then
    echo -e "${GREEN}✅${NC} 300px minimum spacing configured"
else
    echo -e "${RED}❌${NC} Spacing setting not found"
fi

if grep -q "autoRefresh: false" config/adsenseConfig.ts; then
    echo -e "${GREEN}✅${NC} No auto-refresh (gentle placement)"
else
    echo -e "${YELLOW}⚠️${NC}  Auto-refresh setting not found"
fi

echo ""
echo "🔗 Checking GitHub Configuration..."
echo "---"

# Check if git is initialized
if [ -d ".git" ]; then
    echo -e "${GREEN}✅${NC} Git repository initialized"

    # Check for remote
    if git remote | grep -q "origin"; then
        echo -e "${GREEN}✅${NC} GitHub remote configured"
    else
        echo -e "${YELLOW}⚠️${NC}  GitHub remote not set (run: git remote add origin https://github.com/YOUR_USERNAME/EduBoost.git)"
    fi
else
    echo -e "${YELLOW}⚠️${NC}  Git not initialized (run: git init)"
fi

echo ""
echo "🏁 Final Checks..."
echo "---"

# Try to build
echo "Building project..."
if npm run build &> /dev/null; then
    echo -e "${GREEN}✅${NC} Project builds successfully"
else
    echo -e "${RED}❌${NC} Build failed - check errors above"
fi

echo ""
echo "=========================================="
echo "📋 Pre-Deployment Summary"
echo "=========================================="
echo ""
echo "Before deploying:"
echo "1. Fix any ❌ items above"
echo "2. Run: git add . && git commit -m 'feat: gentle ads + github deployment'"
echo "3. Run: git push -u origin main"
echo "4. Go to https://app.netlify.com"
echo "5. Click 'Add new site' and import from GitHub"
echo "6. Enable Auto Ads in Google AdSense"
echo "7. Wait 24-48 hours for ads to appear"
echo ""
echo "📚 Documentation:"
echo "   - ADSENSE_GENTLE_ADS_POLICY.md"
echo "   - GITHUB_DEPLOYMENT_GUIDE.md"
echo "   - ADSENSE_AUTO_ADS_GUIDE.md"
echo ""
echo "✅ Ready to deploy? Push to GitHub when all checks pass!"
echo ""
