#!/bin/bash

# ArFood Vendors Frontend - Quick Start Script

echo "🍽️  ArFood Vendors Frontend - Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✓ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "🚀 Starting development server..."
echo "   Opening at http://localhost:3000"
echo ""
echo "📝 Login credentials:"
echo "   Username: (vendor username from backend)"
echo "   Password: (vendor password from backend)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
