@echo off
echo ====================================================
echo   ANKARA UNIVERSITESI RANDEVU SISTEMI BASLATILIYOR
echo ====================================================

:: 1. Backend'i yeni bir pencerede baslat
echo [1/2] Backend (Django) sunucusu aciliyor...
start cmd /k "cd backend && .venv\Scripts\activate && python manage.py runserver"

:: 2. Frontend'i yeni bir pencerede baslat
echo [2/2] Frontend (Vite) arayuzu aciliyor...
start cmd /k "cd frontend && npm run dev"

echo.
echo Her iki sunucu da ayri pencerelerde calisiyor.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
pause