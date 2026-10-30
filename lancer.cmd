@echo off
title KOMMEL - serveur local
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nest pas installe. Installe la version LTS depuis https://nodejs.org puis relance ce fichier.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installation des dependances, premiere fois seulement...
  call npm install
  if errorlevel 1 ( pause & exit /b 1 )
)
echo.
echo Le site demarre sur http://localhost:3000
echo Ferme cette fenetre pour arreter le serveur.
echo.
call npm run dev
pause
