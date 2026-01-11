# Script de actualizacion automatica de productos
# Ubicacion: img/productos-subir/

Write-Host "`n=== ACTUALIZACION DE PRODUCTOS ===" -ForegroundColor Green

$sourceFolder = "c:\Users\Carlos Acametitla\Desktop\progetto-tech-kids\index.html\img\productos-subir"
$targetFolder = "c:\Users\Carlos Acametitla\Desktop\progetto-tech-kids\index.html\img"

# Obtener todas las imagenes de la carpeta
$images = Get-ChildItem "$sourceFolder" -File | Where-Object {$_.Extension -match '\.(jpg|jpeg|png)$'} | Sort-Object Name

if ($images.Count -eq 0) {
    Write-Host "`n[!] No se encontraron imagenes en productos-subir/" -ForegroundColor Yellow
    Write-Host "   Sube imagenes aqui y vuelve a ejecutar el script" -ForegroundColor Gray
    exit
}

Write-Host "`n[+] Encontradas $($images.Count) imagenes" -ForegroundColor Cyan

# Renombrar y copiar hasta 3 imagenes (maximo)
$count = [Math]::Min($images.Count, 3)

for ($i = 0; $i -lt $count; $i++) {
    $newName = "novedad-$($i + 1).png"
    $sourcePath = $images[$i].FullName
    $targetPath = Join-Path $targetFolder $newName
    
    Copy-Item $sourcePath $targetPath -Force
    Write-Host "  [OK] $($images[$i].Name) -> $newName" -ForegroundColor Green
}

Write-Host "`n[LISTO] PRODUCTOS ACTUALIZADOS" -ForegroundColor Yellow
Write-Host "   Las imagenes estan listas en la pagina principal" -ForegroundColor Gray
Write-Host "`n[INFO] Recarga el navegador para ver los cambios" -ForegroundColor Cyan
