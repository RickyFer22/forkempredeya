@echo off
setlocal
title Emprende Ya - Servidor Web
color 0D
cd /d "%~dp0"

echo ======================================================
echo           EMPRENDE YA - APLICACION WEB
echo             (React + Vite + Supabase)
echo ======================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 goto :NO_NODE

if not exist "%~dp0node_modules\" goto :INSTALL_DEPS

:START_SERVER
echo [INFO] Iniciando el servidor web en http://localhost:3000
echo [INFO] Presiona Ctrl + C en esta ventana para detener el servidor.
echo.

call npm run dev
goto :END

:INSTALL_DEPS
echo [INFO] Instalando dependencias necesarias...
call npm install
if %errorlevel% neq 0 goto :INSTALL_ERROR
goto :START_SERVER

:NO_NODE
color 0C
echo.
echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
echo Por favor, instala Node.js desde https://nodejs.org/
echo.
pause
exit /b 1

:INSTALL_ERROR
color 0C
echo.
echo [ERROR] Hubo un problema al instalar las dependencias con npm install.
echo.
pause
exit /b 1

:END
echo.
echo El servidor se ha detenido.
pause
