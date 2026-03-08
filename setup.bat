@echo off
REM EduBoost AI - Quick Setup Script (Windows)
REM This script helps set up the project for first-time use

echo.
echo 🚀 EduBoost AI - Project Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ⚙️  Creating .env.local from .env.example...
    copy .env.example .env.local
    echo ✅ Created .env.local
    echo.
    echo 📝 IMPORTANT: Please update .env.local with your Gemini API Key
    echo    1. Visit: https://aistudio.google.com/apikey
    echo    2. Create an API Key
    echo    3. Add it to .env.local: VITE_GEMINI_API_KEY=^<your-key^>
) else (
    echo ✅ .env.local already exists
)

echo.
echo ================================
echo ✅ Setup complete!
echo.
echo Next steps:
echo   1. Update .env.local with your Gemini API Key
echo   2. Run: npm run dev (for local development)
echo   3. Run: npm run build (to build for production)
echo.
echo For deployment info, see DEPLOYMENT.md
echo.
pause
