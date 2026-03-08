#!/bin/bash

# EduBoost AI - Quick Setup Script
# This script helps set up the project for first-time use

echo "🚀 EduBoost AI - Project Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚙️  Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "📝 IMPORTANT: Please update .env.local with your Gemini API Key"
    echo "   1. Visit: https://aistudio.google.com/apikey"
    echo "   2. Create an API Key"
    echo "   3. Add it to .env.local: VITE_GEMINI_API_KEY=<your-key>"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env.local with your Gemini API Key"
echo "  2. Run: npm run dev (for local development)"
echo "  3. Run: npm run build (to build for production)"
echo ""
echo "For deployment info, see DEPLOYMENT.md"
