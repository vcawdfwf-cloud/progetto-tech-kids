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
    // Cerrar menú al hacer clic en un enlace
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', ()=>{
        nav.classList.remove('active');
        burger.textContent = '☰';
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
});
