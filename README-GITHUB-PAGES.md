# Migración a GitHub Pages - Progetto Tech Kids

## 🚀 Guía de Despliegue

### Requisitos Previos
- Cuenta de GitHub
- Git instalado en tu computadora

## 📝 Pasos para Desplegar

### 1. Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón "+" arriba a la derecha y selecciona "New repository"
3. Nombre del repositorio: `progetto-tech-kids` (o el que prefieras)
4. **NO** marques "Initialize this repository with a README"
5. Haz clic en "Create repository"

### 2. Inicializar Git y Subir el Proyecto

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
# Inicializar repositorio git (si no existe)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Migración a GitHub Pages desde Vercel/Netlify"

# Configurar la rama principal como 'main'
git branch -M main

# Conectar con el repositorio remoto (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/progetto-tech-kids.git

# Subir los archivos
git push -u origin main
```

### 3. Activar GitHub Pages

1. En tu repositorio en GitHub, ve a **Settings** (Configuración)
2. En el menú lateral, busca **Pages**
3. En "Source" (Fuente), selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
4. Haz clic en **Save**
5. Espera unos minutos y tu sitio estará disponible en:
   - `https://TU-USUARIO.github.io/progetto-tech-kids/`

### 4. Configurar Dominio Personalizado (Opcional)

Si quieres usar `progettokids.com`:

1. En GitHub Pages settings, ingresa tu dominio en "Custom domain"
2. En tu proveedor de dominio (GoDaddy, Namecheap, etc.), configura:

   **Para un dominio apex (sin www):**
   ```
   Tipo A records apuntando a:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   **Para www:**
   ```
   CNAME record: www -> TU-USUARIO.github.io
   ```

3. Marca la casilla "Enforce HTTPS" para SSL automático

## ⚠️ Limitaciones de GitHub Pages

GitHub Pages solo soporta sitios estáticos (HTML, CSS, JS). **NO soporta funciones serverless**.

### Funciones Serverless (Telegram, etc.)

Las funciones en `/api/` y `/netlify/functions/` **NO funcionarán** en GitHub Pages.

**Solución alternativa:**
- Usa servicios como [Cloudflare Workers](https://workers.cloudflare.com/) (GRATIS)
- O usa [Pipedream](https://pipedream.com/) para webhooks
- O contacta directamente la API de Telegram desde el frontend (menos seguro - expone token)

Ver `js/telegram-direct.js` para implementación alternativa.

## 🔄 Actualizar el Sitio

Cada vez que hagas cambios:

```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

GitHub Pages se actualizará automáticamente en 1-2 minutos.

## 📞 Soporte

- Documentación oficial: https://docs.github.com/es/pages
- GitHub Pages está incluido GRATIS en todas las cuentas
- Límites: 1GB de espacio, 100GB de ancho de banda/mes

## ✅ Ventajas de GitHub Pages

- ✅ **Completamente GRATIS**
- ✅ No requiere tarjeta de crédito
- ✅ SSL/HTTPS gratis con Let's Encrypt
- ✅ CDN global incluido
- ✅ No te bloquearán ni pedirán pago
- ✅ Actualizaciones automáticas con git push
- ✅ Soporte para dominio personalizado

---

*Última actualización: Enero 2026*
