@echo off
echo Starting HeatWave AI Development Server...
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Installing dependencies first...
    npm install
    echo.
)

REM Install dependencies if needed
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

echo 🚀 Starting development server...
echo 📍 Server will be available at: http://localhost:5173
echo 🌐 Network access: http://localhost:5173
echo.
echo ⚠️  If server fails to start, use simple.html for immediate access
echo.

REM Try different port if 5173 is busy
echo Attempting to start server...
npm run dev 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Port 5173 busy, trying port 3000...
    npx vite --port 3000 --host 2>nul
    if %errorlevel% neq 0 (
        echo ⚠️  Port 3000 busy, trying port 8080...
        npx vite --port 8080 --host 2>nul
        if %errorlevel% neq 0 (
            echo ❌ All ports busy. Opening simple.html instead...
            start "" "simple.html"
            goto :end
        )
    )
)

:end
echo.
echo  If the server doesn't work, double-click start-heatwave.bat for instant access
pause