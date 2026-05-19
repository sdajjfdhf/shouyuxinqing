@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "SQLFILE=给Supabase粘贴用-只要这个文件.sql"
if not exist "%SQLFILE%" (
    echo [错误] 找不到：%SQLFILE%
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Get-Content -LiteralPath (Join-Path '%CD%' '%SQLFILE%') -Raw -Encoding UTF8 | Set-Clipboard"

echo.
echo ============================================================
echo   已复制：%SQLFILE%
echo ============================================================
echo.
echo 【不要粘贴 .bat 文件里的 @echo、npm 到 Supabase，会报错！】
echo.
echo ① 浏览器打开 https://supabase.com/dashboard 并登录
echo ② 打开你的项目 - SQL Editor - New query
echo ③ 在网页里按 Ctrl+V 粘贴，点 Run
echo ④ 成功后，关掉网页，回到本文件夹双击「启动兽予心晴-连数据库请用这个.bat」
echo    浏览器打开 http://127.0.0.1:5178（以黑窗口里 Local 为准）
echo.
pause
start "" "https://supabase.com/dashboard/projects"
