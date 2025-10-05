@echo off
echo CSE310 Image Download Script
echo ============================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org
    pause
    exit /b 1
)

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting image download process...
echo.

REM Run the download script
python download_images.py

echo.
echo Script completed!
pause
