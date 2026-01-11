# Script para desplegar automáticamente a GitHub Pages
# Uso: .\deploy-github.ps1 "mensaje del commit"

param(
    [string]$CommitMessage = "Actualización automática del sitio"
)

Write-Host "🚀 Iniciando despliegue a GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

# Verificar si estamos en un repositorio git
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  No es un repositorio git. Inicializando..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositorio inicializado" -ForegroundColor Green
}

# Verificar si hay cambios
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  No hay cambios para desplegar" -ForegroundColor Blue
    exit 0
}

Write-Host "📝 Cambios detectados:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Agregar todos los archivos
Write-Host "➕ Agregando archivos..." -ForegroundColor Cyan
git add .

# Hacer commit
Write-Host "💾 Creando commit..." -ForegroundColor Cyan
git commit -m "$CommitMessage"

# Verificar si existe remote origin
$remoteExists = git remote | Select-String -Pattern "origin" -Quiet
if (-not $remoteExists) {
    Write-Host ""
    Write-Host "⚠️  No hay remote configurado" -ForegroundColor Yellow
    Write-Host "Por favor, configura el remote con:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/TU-USUARIO/progetto-tech-kids.git" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Push a GitHub
Write-Host "☁️  Subiendo a GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Despliegue exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Tu sitio se actualizará en 1-2 minutos en:" -ForegroundColor Cyan
    Write-Host "   https://TU-USUARIO.github.io/progetto-tech-kids/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Error al hacer push" -ForegroundColor Red
    Write-Host "Verifica tu conexión y credenciales de GitHub" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
