@echo off
REM Simple backup script using mongodump
setlocal enabledelayedexpansion

necho MongoDB Backup Script
necho.
necho Enter source MongoDB URI (e.g. mongodb://user:pass@host:27017/dbname):
set /p SRCURI=
if "%SRCURI%"=="" (
  echo No URI provided. Exiting.
  exit /b 1
)
set TIMESTAMP=%DATE:~-4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set OUTDIR=%CD%\backups\dump-%TIMESTAMP%
mkdir "%OUTDIR%"

mongodump --uri="%SRCURI%" --out="%OUTDIR%"
if %ERRORLEVEL% neq 0 (
  echo mongodump failed. Ensure MongoDB Database Tools are installed and in PATH.
  exit /b %ERRORLEVEL%
)
echo Backup completed to %OUTDIR%
