@echo off
echo ====================================================
echo   ANKARA UNIVERSITESI RANDEVU SISTEMI BASLATILIYOR
echo ====================================================

:: 1. Backend'i yeni bir pencerede baslat
echo [1/2] Backend (Django) hazirlaniyor...
cd backend

:: Activate virtual environment
call .venv\Scripts\activate

:: Run migrations
echo Migrations uygulaniyor...
python manage.py migrate
if errorlevel 1 (
    echo HATA: Migration basarisiz!
    pause
    exit /b 1
)

:: Seed database
echo Veritabani dolduruluyor...
python manage.py seed_db
if errorlevel 1 (
    echo HATA: Seed islemi basarisiz!
    pause
    exit /b 1
)

:: Start server in new window
echo Backend sunucusu baslatiliyor...
start cmd /k "cd /d %CD% && .venv\Scripts\activate && python manage.py runserver"

:: Go back to root
cd ..

:: 2. Frontend'i yeni bir pencerede baslat
echo [2/2] Frontend (Vite) arayuzu aciliyor...
start cmd /k "cd frontend && npm run dev"

echo.
echo Her iki sunucu da ayri pencerelerde calisiyor.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
pause