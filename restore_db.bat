@echo off
REM Simple restore script using mongorestore
setlocal enabledelayedexpansion

echo MongoDB Restore Script
necho.
echo Enter path to dump folder (e.g. C:\path\to\backups\dump-YYYYMMDD):
set /p DUMP_PATH=
if "%DUMP_PATH%"=="" (
  echo No path provided. Exiting.
  exit /b 1
)

echo Enter target local MongoDB URI (default mongodb://127.0.0.1:27017):
set /p LOCALURI=
if "%LOCALURI%"=="" set LOCALURI=mongodb://127.0.0.1:27017

mongorestore --uri="%LOCALURI%" --drop "%DUMP_PATH%"
if %ERRORLEVEL% neq 0 (
  echo mongorestore failed. Ensure MongoDB Database Tools are installed and in PATH.
  exit /b %ERRORLEVEL%
)
echo Restore completed to %LOCALURI%
