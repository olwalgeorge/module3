#!/usr/bin/env pwsh

# CSE310 Module 3 - Inventory Management System Deployment Script
# This script helps deploy your project to Vercel

Write-Host "🚀 CSE310 Module 3 - Vercel Deployment Script" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Project directory confirmed" -ForegroundColor Green

# Build the project
Write-Host "`n📦 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please fix build errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Check if Vercel CLI is available
Write-Host "`n🔧 Checking Vercel CLI..." -ForegroundColor Yellow
$vercelVersion = vercel --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    $vercelVersion = vercel --version
}

Write-Host "✅ Vercel CLI available: $vercelVersion" -ForegroundColor Green

# Display deployment options
Write-Host "`n🌐 Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Manual Dashboard Deployment (Recommended for first-time)" -ForegroundColor White
Write-Host "2. CLI Deployment (May require browser login)" -ForegroundColor White
Write-Host "3. GitHub Integration (Automatic)" -ForegroundColor White

$choice = Read-Host "`nSelect deployment method (1-3)"

switch ($choice) {
    "1" {
        Write-Host "`n📋 Manual Dashboard Deployment Steps:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor White
        Write-Host "2. Click 'New Project'" -ForegroundColor White
        Write-Host "3. Import your GitHub repository or drag/drop the 'dist' folder" -ForegroundColor White
        Write-Host "4. Set Framework Preset to 'Vite'" -ForegroundColor White
        Write-Host "5. Add Environment Variables:" -ForegroundColor White
        Write-Host "   - VITE_SUPABASE_URL = https://xxgpfxkokhuqoooqakkd.supabase.co" -ForegroundColor Cyan
        Write-Host "   - VITE_SUPABASE_ANON_KEY = [your key from .env file]" -ForegroundColor Cyan
        Write-Host "6. Click Deploy!" -ForegroundColor White
        
        # Open browser
        Start-Process "https://vercel.com/dashboard"
        Write-Host "`n🌐 Browser opened to Vercel Dashboard" -ForegroundColor Green
    }
    
    "2" {
        Write-Host "`n🔑 Attempting CLI Deployment..." -ForegroundColor Yellow
        Write-Host "This may open a browser for authentication..." -ForegroundColor White
        
        # Check if logged in
        $whoami = vercel whoami 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "🔐 Login required. Opening browser..." -ForegroundColor Yellow
            vercel login
        }
        
        # Deploy
        Write-Host "🚀 Deploying to production..." -ForegroundColor Yellow
        vercel --prod
    }
    
    "3" {
        Write-Host "`n📚 GitHub Integration Setup:" -ForegroundColor Yellow
        Write-Host "1. Push your code to GitHub" -ForegroundColor White
        Write-Host "2. Go to Vercel Dashboard and connect your GitHub repository" -ForegroundColor White
        Write-Host "3. Enable automatic deployments" -ForegroundColor White
        Write-Host "4. Every push to master/main will auto-deploy" -ForegroundColor White
        
        $pushChoice = Read-Host "`nDo you want to push to GitHub now? (y/n)"
        if ($pushChoice -eq "y" -or $pushChoice -eq "Y") {
            git push origin master
            Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
        }
    }
    
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n📝 Important Notes:" -ForegroundColor Cyan
Write-Host "• Make sure to set environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "• Your project ID: prj_L0K5MznWIAw1gnkhVxozSDpMa63r" -ForegroundColor White
Write-Host "• Check the VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor White

Write-Host "`n🎉 Deployment script completed!" -ForegroundColor Green
