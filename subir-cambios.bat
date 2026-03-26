@echo off
chcp 65001 >nul
echo =======================================================
echo          SUBIENDO CAMBIOS DE LA PAGINA WEB
echo =======================================================
echo.
echo 1. Buscando los archivos que modificaste...
"C:\Program Files\Git\cmd\git.exe" add .

echo.
echo 2. Empaquetando la actualizacion...
"C:\Program Files\Git\cmd\git.exe" commit -m "Actualizacion rapida de la pagina web"

echo.
echo 3. Subiendo a GitHub y a Netlify...
"C:\Program Files\Git\cmd\git.exe" push origin main

echo.
echo =======================================================
echo    Exito! Los cambios ya estan subidos a internet.
echo  Netlify tardara unos 15 segundos en actualizar tu web.
echo =======================================================
echo.
pause
