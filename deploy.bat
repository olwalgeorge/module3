@echo off
echo CSE310 Module 3 - Quick Deploy
echo ================================
echo.
echo Building project...
call npm run build
echo.
echo Opening Vercel Dashboard...
start https://vercel.com/dashboard
echo.
echo Manual Deployment Instructions:
echo 1. Drag and drop the 'dist' folder to Vercel
echo 2. Set Framework to 'Vite'  
echo 3. Add environment variables from .env.example
echo 4. Click Deploy!
echo.
pause
