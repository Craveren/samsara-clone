@echo off
REM Woodpecker Lifebook - Startup Script (Windows Batch)
echo ========================================
echo Woodpecker Lifebook - Startup Script
echo ========================================
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please make sure you're in the project root directory.
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [OK] package.json found

REM Check if node_modules exists
if not exist "node_modules" (
    echo.
    echo [WARN] node_modules not found. Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed
) else (
    echo [OK] node_modules found
)

echo.
echo ========================================
echo Starting the app...
echo ========================================
echo.
echo The app will open at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

REM Start the app
call npm start

