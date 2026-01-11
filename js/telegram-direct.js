// Solución alternativa para notificaciones Telegram sin serverless
// IMPORTANTE: Este enfoque expone tu token de Telegram en el frontend
// Solo usar para pruebas o considerar usar Cloudflare Workers (gratis)

class TelegramNotifier {
  constructor() {
    // MEJOR PRÁCTICA: Mover estos valores a un worker de Cloudflare
    // Por ahora, están aquí para que funcione básicamente
    this.TELEGRAM_TOKEN = '8211518197:AAHDzMq22bUBGRqzMyBYAXvFPg_07lHouWI';
    this.CHAT_ID = '6995082947';
    this.API_URL = `https://api.telegram.org/bot${this.TELEGRAM_TOKEN}/sendMessage`;
  }

  async send(message) {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        console.log('✅ Notificación enviada correctamente');
        return { success: true };
      } else {
        throw new Error(data.description || 'Error de Telegram API');
      }
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para notificaciones de productos
  async notifyNewOrder(productName, quantity = 1) {
    const message = `
🛒 *Nueva Orden - Progetto Tech Kids*

📦 Producto: ${productName}
📊 Cantidad: ${quantity}
🕐 Fecha: ${new Date().toLocaleString('es-MX')}
🌐 Sitio: GitHub Pages

---
_Notificación automática_
    `.trim();

    return await this.send(message);
  }

  // Método para consultas/contacto
  async notifyContact(name, email, message) {
    const notification = `
📧 *Nuevo Contacto - Progetto Tech Kids*

👤 Nombre: ${name}
📧 Email: ${email}
💬 Mensaje: ${message}
🕐 Fecha: ${new Date().toLocaleString('es-MX')}

---
_Notificación automática_
    `.trim();

    return await this.send(notification);
  }
}

// Exportar para uso en otros archivos
window.TelegramNotifier = TelegramNotifier;

// Ejemplo de uso:
// const notifier = new TelegramNotifier();
// await notifier.notifyNewOrder('Robot Arduino Kit', 2);
