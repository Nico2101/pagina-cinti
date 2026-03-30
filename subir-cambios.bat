@echo off
echo ========================================
echo   SUBIENDO CAMBIOS A LA WEB...
echo ========================================
echo.

cd /d "%~dp0"

"C:\Program Files\Git\cmd\git.exe" add --all
"C:\Program Files\Git\cmd\git.exe" commit -m "Actualización desde Admin Panel %date% %time%"
"C:\Program Files\Git\cmd\git.exe" push origin main

echo.
echo ========================================
echo   LISTO! Los cambios ya estan en la web.
echo   Espera 1-2 minutos para verlos online.
echo ========================================
pause
