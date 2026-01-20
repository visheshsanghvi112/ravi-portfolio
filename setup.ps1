# Quick Setup Script for Ravi Portfolio
# Run this script to quickly set up your development environment

Write-Host "🎨 Ravi Maurya Portfolio - Quick Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "📦 Checking Node.js installation..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion is installed" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is available
Write-Host "📦 Checking npm..." -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion is available" -ForegroundColor Green
} else {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check for .env.local file
Write-Host ""
Write-Host "🔑 Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local file not found" -ForegroundColor Yellow
    Write-Host "📝 Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ .env.local created. Please edit it and add your GEMINI_API_KEY" -ForegroundColor Green
    Write-Host "   👉 Get your API key from: https://ai.google.dev/" -ForegroundColor Cyan
}

# Success message
Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local and add your VITE_GEMINI_API_KEY" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start development server" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "📖 For deployment instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 💻✨" -ForegroundColor Magenta
