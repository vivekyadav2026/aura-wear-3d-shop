@echo off
cd /d "%~dp0"
echo Installing AURA WEAR dependencies...
npm install
if errorlevel 1 goto failed
echo Starting development server...
npm run dev
goto end
:failed
echo Dependency installation failed. Check your internet connection and Node.js/npm installation.
:end
pause
