@echo off
echo.
echo =============================================
echo 🚀 INVENTORY SYSTEM - DATABASE SETUP GUIDE
echo =============================================
echo.
echo This script will guide you through setting up your database.
echo.
echo 📋 STEP 1: Execute Database Schema
echo ------------------------------------
echo 1. Open your browser to: https://supabase.com/dashboard/project/xxgpfxkokhuqoooqakkd
echo 2. Click "SQL Editor" in the left sidebar
echo 3. Open this file in VS Code: database\schema.sql
echo 4. Copy ALL the contents (Ctrl+A, Ctrl+C)
echo 5. Paste in Supabase SQL Editor and click "Run"
echo.
pause
echo.
echo 📊 STEP 2: Load Sample Data
echo ---------------------------
echo 1. In the same SQL Editor, create a new query
echo 2. Open this file in VS Code: database\seed.sql  
echo 3. Copy ALL the contents (Ctrl+A, Ctrl+C)
echo 4. Paste in Supabase SQL Editor and click "Run"
echo.
pause
echo.
echo 🧪 STEP 3: Test Your Setup
echo --------------------------
echo Running database validation...
echo.
node setup-database.js
echo.
echo 🎉 If you see success above, your database is ready!
echo.
echo 🚀 STEP 4: Start Your Application  
echo ----------------------------------
echo Now run: npm run dev
echo Then visit: http://localhost:5173
echo.
pause
