@echo off
SET VERSION=%1
IF "%VERSION%"=="" (
  echo Usage: release.bat ^<version^>
  echo Example: release.bat 0.2.0
  exit /b 1
)

echo Building Electron app v%VERSION%...
call npm run electron:build:win

echo Creating GitHub Release v%VERSION%...
gh release create "v%VERSION%" --title "Cue v%VERSION%" --generate-notes

echo Uploading installer...
copy "dist-electron\Cue Setup %VERSION%.exe" "dist-electron\Cue-Setup-%VERSION%.exe"
gh release upload "v%VERSION%" "dist-electron\Cue-Setup-%VERSION%.exe" --clobber

echo.
echo Done! Release v%VERSION% is live.
gh release view "v%VERSION%"
