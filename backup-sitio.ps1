# Script de Backup Automático
# Ejecutar semanalmente o después de cambios importantes

param(
    [string]$BackupPath = "$env:USERPROFILE\Desktop\progetto-backups"
)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFolder = "$BackupPath\backup_$timestamp"

Write-Host "🔄 Creando backup..." -ForegroundColor Cyan

# Crear carpeta de backup
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

# Copiar archivos importantes
Copy-Item -Path "c:\Users\Carlos Acametitla\Desktop\progetto-deploy\*" -Destination $backupFolder -Recurse -Exclude @('.git', 'node_modules', '.vercel')

# Comprimir
$zipPath = "$BackupPath\backup_$timestamp.zip"
Compress-Archive -Path $backupFolder -DestinationPath $zipPath -Force

# Limpiar carpeta temporal
Remove-Item $backupFolder -Recurse -Force

Write-Host "✅ Backup creado: $zipPath" -ForegroundColor Green
Write-Host "📦 Tamaño: $([math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB" -ForegroundColor Cyan

# Limpiar backups antiguos (mantener solo últimos 5)
Get-ChildItem $BackupPath -Filter "backup_*.zip" | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -Skip 5 | 
    Remove-Item -Force

Write-Host "🗑️ Backups antiguos eliminados (manteniendo últimos 5)" -ForegroundColor Yellow
