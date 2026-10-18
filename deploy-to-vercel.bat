@echo off
title Vercel Live Deployment - SMS 2K26
color 0b
echo ======================================================================
echo             SMS 2K26 - LIVE VERCEL DEPLOYMENT AUTOMATOR
echo ======================================================================
echo.
echo [1/3] Logging in to Vercel...
echo When prompted below, press [ENTER] to continue with GitHub:
echo (Your browser will open to confirm authorization)
echo.
call npx vercel login
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Login was not completed or failed. Please run this script again.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ======================================================================
echo [2/3] Linking to existing project (flying-quasar)...
echo ======================================================================
call npx vercel link --project flying-quasar --yes
if %ERRORLEVEL% NEQ 0 (
    echo Trying with full domain name...
    call npx vercel link --project flying-quasar-kjsp0rp --yes
)
if %ERRORLEVEL% NEQ 0 (
    echo Could not auto-link by name. Please select your project interactively:
    call npx vercel link
)

echo.
echo ======================================================================
echo [3/3] Deploying updates to production...
echo ======================================================================
call npx vercel --prod --yes

echo.
echo ======================================================================
echo             DEPLOYMENT COMPLETE! YOUR SITE IS NOW UPDATED!
echo             Check: https://flying-quasar-kjsp0rp.vercel.app
echo ======================================================================
echo.
pause
