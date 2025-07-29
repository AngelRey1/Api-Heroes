Write-Host "🚀 Iniciando el backend..." -ForegroundColor Green
Set-Location "Api-Heroes"
Write-Host "📁 Directorio actual: $(Get-Location)" -ForegroundColor Yellow
Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
npm install
Write-Host "🎯 Iniciando servidor..." -ForegroundColor Green
npm start
Read-Host "Presiona Enter para salir..." 