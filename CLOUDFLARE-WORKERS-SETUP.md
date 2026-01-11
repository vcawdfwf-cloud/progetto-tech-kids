# MEJOR ALTERNATIVA: Cloudflare Workers (GRATIS)
# Para mantener tu token de Telegram seguro

## ¿Por qué Cloudflare Workers?

- ✅ **100% GRATIS** hasta 100,000 requests/día
- ✅ Funciones serverless como Vercel/Netlify
- ✅ Mantiene tu token de Telegram seguro
- ✅ Sin tarjeta de crédito requerida para empezar
- ✅ Deploy en segundos

## Pasos para Configurar

### 1. Crear cuenta en Cloudflare

1. Ve a https://dash.cloudflare.com/sign-up
2. Crea tu cuenta (gratis)

### 2. Instalar Wrangler CLI

```powershell
npm install -g wrangler
```

### 3. Crear Worker para Telegram

```powershell
# Login a Cloudflare
wrangler login

# Crear nuevo worker
wrangler init telegram-notifier
```

### 4. Código del Worker

Crea `telegram-notifier/src/index.js`:

```javascript
export default {
  async fetch(request) {
    // Solo permitir POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Headers CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Manejar preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { message } = await request.json();
      
      if (!message) {
        return new Response(
          JSON.stringify({ error: 'Message required' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Tu configuración de Telegram
      const TELEGRAM_TOKEN = '8211518197:AAHDzMq22bUBGRqzMyBYAXvFPg_07lHouWI';
      const CHAT_ID = '6995082947';
      
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        return new Response(
          JSON.stringify({ success: true }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        throw new Error(data.description);
      }
      
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
};
```

### 5. Deploy del Worker

```powershell
cd telegram-notifier
wrangler deploy
```

Obtendrás una URL como: `https://telegram-notifier.TU-USUARIO.workers.dev`

### 6. Usar en tu sitio

En tu `main.js` o donde necesites:

```javascript
async function enviarNotificacion(mensaje) {
  try {
    const response = await fetch('https://telegram-notifier.TU-USUARIO.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: mensaje })
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Uso
await enviarNotificacion('🛒 Nueva orden desde GitHub Pages');
```

## Ventajas vs Alternativas

| Característica | Cloudflare Workers | Telegram Directo | Vercel/Netlify |
|----------------|-------------------|------------------|----------------|
| Costo | GRATIS | GRATIS | Requieren pago |
| Token seguro | ✅ Sí | ❌ No | ✅ Sí |
| Límite | 100k req/día | Ilimitado | Limitado |
| Setup | 5 minutos | 1 minuto | Bloqueado |
| CORS | ✅ Configurable | ⚠️ Limitado | ✅ Sí |

## ⚠️ IMPORTANTE

Si usas Cloudflare Workers, **elimina o no uses** `js/telegram-direct.js` porque expone tu token.

Con Workers, tu token está seguro en el servidor de Cloudflare.

---

**Recomendación:** Usar Cloudflare Workers para producción. Es gratis, seguro y profesional.
