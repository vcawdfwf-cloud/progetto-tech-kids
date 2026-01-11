# Servidor Local Simple para Progetto Tech Kids
# Ejecutar: .\servidor-local.ps1

Write-Host "🚀 Iniciando servidor local..." -ForegroundColor Cyan
Write-Host ""

# Abrir navegador
Start-Process "http://localhost:8080"

# Configurar servidor
Add-Type -AssemblyName System.Net.Http
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()

Write-Host "✅ Servidor corriendo en: http://localhost:8080" -ForegroundColor Green
Write-Host "📂 Carpeta: $((Get-Location).Path)" -ForegroundColor Cyan
Write-Host "⏹️  Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Determinar ruta del archivo
        $path = $request.Url.LocalPath
        if ($path -eq '/') { $path = '/index.html' }
        
        $filePath = Join-Path (Get-Location).Path $path.TrimStart('/')
        
        if (Test-Path $filePath) {
            # Leer archivo
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # Determinar Content-Type
            $ext = [System.IO.Path]::GetExtension($filePath)
            $contentType = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css' }
                '.js'   { 'application/javascript' }
                '.json' { 'application/json' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                '.gif'  { 'image/gif' }
                '.svg'  { 'image/svg+xml' }
                default { 'application/octet-stream' }
            }
            $response.ContentType = $contentType
            
            # Enviar respuesta
            $response.OutputStream.Write($content, 0, $content.Length)
            
            # Log
            $timestamp = Get-Date -Format "HH:mm:ss"
            Write-Host "[$timestamp] 200 $path" -ForegroundColor Green
        }
        else {
            # 404 Not Found
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('404 - Archivo no encontrado')
            $response.OutputStream.Write($msg, 0, $msg.Length)
            
            $timestamp = Get-Date -Format "HH:mm:ss"
            Write-Host "[$timestamp] 404 $path" -ForegroundColor Red
        }
        
        $response.Close()
    }
}
finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "🛑 Servidor detenido" -ForegroundColor Yellow
}
