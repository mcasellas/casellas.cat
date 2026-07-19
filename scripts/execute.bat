@echo off
set /p CATEGORY="Categoria (ex: viatges): "
bash "optimize-portfolio.sh" "%CATEGORY%"
pause