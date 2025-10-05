@echo off
echo ========================================
echo INVENTORY MANAGEMENT DATABASE TESTING
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

:: Check if .env.local exists
if not exist ".env.local" (
    echo Warning: .env.local file not found
    echo Creating sample environment file...
    echo VITE_SUPABASE_URL=https://xxgpfxkokhuqoooqakkd.supabase.co > .env.local
    echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4Z3BmeGtva2h1cW9vb3Fha2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjczNTEsImV4cCI6MjA3NTI0MzM1MX0.T9AmS12oaTWimda83HmaxBEEQLpbHcTH4QeWAggA_iU >> .env.local
    echo Created .env.local with default values
    echo.
)

:: Run the database test
echo Running database tests...
echo.
node scripts\test-database.js

echo.
echo ========================================
echo TEST COMPLETE
echo ========================================
pause
