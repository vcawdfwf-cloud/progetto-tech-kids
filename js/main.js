// Minimal JS: set year, burger toggle, and a simple carousel
document.addEventListener('DOMContentLoaded', function(){
  // Year in footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Burger toggle for mobile nav
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if(burger && nav) {
    burger.addEventListener('click', ()=>{
      nav.classList.toggle('active');
      burger.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', ()=>{
        nav.classList.remove('active');
        burger.textContent = '☰';
      });
    });
        nav.querySelectorAll('.nav__link').forEach(link => {
          link.addEventListener('click', (e)=>{
            // Si es el enlace de servicios, cerrar el menú
            if(link.getAttribute('href') === 'servicios.html') {
              nav.classList.remove('active');
              burger.textContent = '☰';
            }
            // O cerrar siempre en móvil
            if(window.innerWidth <= 1000) {
              nav.classList.remove('active');
              burger.textContent = '☰';
            }
          });
        });
  }

  // Simple carousel
  const carousel = document.querySelector('[data-carousel]');
  if(!carousel) return;
  const track = carousel.querySelector('[data-track]');
  const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
  let idx = 0;
  // add transition
  if(track) track.style.transition = 'transform .6s cubic-bezier(.22,.9,.22,1)';

  // create dots
  const dotsContainer = carousel.querySelector('[data-dots]');
  let dots = [];
  if(dotsContainer) {
    slides.forEach((s, i) => {
      const d = document.createElement('button');
      d.className = 'carousel__dot';
      d.setAttribute('aria-label', `Slide ${i+1}`);
      d.addEventListener('click', ()=> show(i));
      dotsContainer.appendChild(d);
      dots.push(d);
    });
  }

  function updateDots(){
    dots.forEach((d, i)=> d.classList.toggle('active', i===idx));
  }

  function show(i){
    if(!track) return;
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    updateDots();
  }

  const prevBtn = carousel.querySelector('[data-prev]');
  const nextBtn = carousel.querySelector('[data-next]');
  if(prevBtn) prevBtn.addEventListener('click', ()=> show(idx-1));
  if(nextBtn) nextBtn.addEventListener('click', ()=> show(idx+1));

  // Auto-scroll enabled - carousel rotates every 4 seconds
  let interval = setInterval(()=> show(idx+1), 4000);
  carousel.addEventListener('mouseenter', ()=> clearInterval(interval));
  carousel.addEventListener('mouseleave', ()=> interval = setInterval(()=> show(idx+1), 4000));

  // init - show first slide
  show(0);

  // Weekly image: prefer local images in img/weekly/YYYY-MM-DD.(jpg|png), then other fallbacks
  (function(){
    const weeklyImg = document.getElementById('weekly-img');
    if(!weeklyImg) return;
    (async ()=>{
      try{
        const now = new Date();
        const day = now.getDay(); // 0=Sun..6=Sat
        const diffToMonday = ((day + 6) % 7);
        const monday = new Date(now);
        monday.setDate(now.getDate() - diffToMonday);
        const seed = monday.toISOString().slice(0,10); // YYYY-MM-DD

        const candidates = [
          `/img/weekly/${seed}.jpg`,
          `/img/weekly/${seed}.png`,
          `/img/weekly.jpg`,
          `/img/weekly.png`
        ];

        for(const p of candidates){
          try{
            const head = await fetch(p, { method: 'HEAD' });
            if(head.ok){ weeklyImg.src = p; return; }
          }catch(e){ /* ignore */ }
        }

        // try weekly.url file
        try{
          const r = await fetch('/img/weekly.url');
          if(r.ok){
            const txt = (await r.text()).trim();
            if(txt) { weeklyImg.src = txt; return; }
          }
        }catch(e){ /* ignore */ }

        // fallback to Unsplash Source seeded by monday
        weeklyImg.src = `https://source.unsplash.com/1200x700/?art,technology&sig=${seed}`;
      }catch(e){
        console.warn('weekly image error', e);
      }
    })();
  })();

  // Countdown timer for robotics class
  (function(){
    const countdownDate = new Date('2026-01-31T07:00:00-06:00').getTime(); // CSTM timezone
    
    function updateCountdown(){
      const now = new Date().getTime();
      const distance = countdownDate - now;
      
      if(distance < 0){
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      document.getElementById('days').textContent = String(days).padStart(2, '0');
      document.getElementById('hours').textContent = String(hours).padStart(2, '0');
      document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  })();

  // Productos carousel - auto-rotate through products every 3 seconds
  (function(){
    const track = document.getElementById('productos-track');
    if(!track) return;
    
    const items = track.querySelectorAll('a');
    let currentIndex = 0;
    
    function showNextProduct(){
      currentIndex = (currentIndex + 1) % items.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // Change product every 3 seconds
    setInterval(showNextProduct, 3000);
    
    // Disable click on product links (for now)
    document.querySelectorAll('.producto-link[data-disabled]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('🛒 Compra no disponible aún.\n\nPróximamente podrás comprar nuestros productos.\n\n¡Gracias por tu interés!');
      });
    });
  })();

  // Formulario del Concurso de Robótica
  const concursoForm = document.getElementById('concurso-form');
  if (concursoForm) {
    concursoForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formMensaje = document.getElementById('form-mensaje');
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      
      // Validar archivo
      const archivoInput = this.querySelector('input[name="proyecto"]');
      const archivo = archivoInput.files[0];
      
      if (!archivo) {
        formMensaje.style.display = 'block';
        formMensaje.style.background = 'rgba(255,107,107,0.2)';
        formMensaje.style.color = 'white';
        formMensaje.innerHTML = '❌ Por favor selecciona un archivo';
        return;
      }
      
      // Validar tipo de archivo
      if (!archivo.type.match('image/jpeg') && !archivo.type.match('image/jpg')) {
        formMensaje.style.display = 'block';
        formMensaje.style.background = 'rgba(255,107,107,0.2)';
        formMensaje.style.color = 'white';
        formMensaje.innerHTML = '❌ Solo se permiten archivos JPG o JPEG';
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (archivo.size > 5 * 1024 * 1024) {
        formMensaje.style.display = 'block';
        formMensaje.style.background = 'rgba(255,107,107,0.2)';
        formMensaje.style.color = 'white';
        formMensaje.innerHTML = '❌ El archivo no debe superar los 5MB';
        return;
      }
      
      // Deshabilitar botón y mostrar loading
      submitButton.disabled = true;
      submitButton.innerHTML = '⏳ Enviando...';
      formMensaje.style.display = 'none';
      
      // Obtener datos del formulario
      const formData = {
        nombre: this.nombre.value,
        edad: this.edad.value,
        email: this.email.value,
        telefono: this.telefono.value,
        tipo_proyecto: this.tipo_proyecto.value,
        descripcion: this.descripcion.value || 'Sin descripción',
        archivo_nombre: archivo.name,
        archivo_tamanio: (archivo.size / 1024).toFixed(2) + ' KB',
        fecha_envio: new Date().toLocaleString('es-MX')
      };
      
      // Crear mensaje para Telegram
      const mensaje = `
🏆 *NUEVA INSCRIPCIÓN - CONCURSO DE ROBÓTICA*

👤 *Participante:* ${formData.nombre}
🎂 *Edad:* ${formData.edad} años
📧 *Email:* ${formData.email}
📱 *Teléfono:* ${formData.telefono}
🤖 *Tipo:* ${formData.tipo_proyecto === 'dibujo' ? '🎨 Dibujo de robot' : '🤖 Robot armado'}
📝 *Descripción:* ${formData.descripcion}

📎 *Archivo:* ${formData.archivo_nombre}
📊 *Tamaño:* ${formData.archivo_tamanio}
🕐 *Fecha:* ${formData.fecha_envio}

---
_Inscripción al Concurso - Progetto Tech Kids_
      `.trim();
      
      // Simular envío (en producción, aquí irá la integración real)
      setTimeout(() => {
        formMensaje.style.display = 'block';
        formMensaje.style.background = 'rgba(67,233,123,0.2)';
        formMensaje.style.color = 'white';
        formMensaje.innerHTML = '✅ ¡Proyecto enviado exitosamente!<br><small style="opacity: 0.9;">Recibirás confirmación por email.</small>';
        
        // Reset form
        this.reset();
        
        // Reactivar botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        // Log para desarrollo (remover en producción)
        console.log('📧 Mensaje a enviar:', mensaje);
        console.log('📦 Datos del formulario:', formData);
        
        // Scroll al mensaje
        formMensaje.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1500);
    });
    
    // Validación en tiempo real del archivo
    const fileInput = concursoForm.querySelector('input[name="proyecto"]');
    if (fileInput) {
      fileInput.addEventListener('change', function() {
        const formMensaje = document.getElementById('form-mensaje');
        const file = this.files[0];
        
        if (file) {
          if (!file.type.match('image/jpeg') && !file.type.match('image/jpg')) {
            formMensaje.style.display = 'block';
            formMensaje.style.background = 'rgba(255,165,0,0.2)';
            formMensaje.style.color = 'white';
            formMensaje.innerHTML = '⚠️ Solo archivos JPG/JPEG';
            this.value = '';
          } else if (file.size > 5 * 1024 * 1024) {
            formMensaje.style.display = 'block';
            formMensaje.style.background = 'rgba(255,165,0,0.2)';
            formMensaje.style.color = 'white';
            formMensaje.innerHTML = '⚠️ Archivo muy grande (máx 5MB)';
            this.value = '';
          } else {
            formMensaje.style.display = 'block';
            formMensaje.style.background = 'rgba(67,233,123,0.2)';
            formMensaje.style.color = 'white';
            formMensaje.innerHTML = `✅ ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
          }
        }
      });
    }
  }
});
