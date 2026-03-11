@echo off
echo Starting HeatWave AI System...
echo.
echo Opening Heatwave Monitoring Dashboard...
timeout /t 2 /nobreak >nul

REM Open the HTML file in default browser
start "" "simple.html"

echo.
echo ✅ HeatWave AI Dashboard is now opening!
echo 📍 Features available:
echo    - Real-time temperature monitoring
echo    - Risk level assessment  
echo    - Active hotspot tracking
echo    - Team deployment status
echo.
echo 🌐 The dashboard will open in your default browser
echo 🔄 Data updates automatically every 5 seconds
echo.
echo Press any key to exit this window...
pause >nul
