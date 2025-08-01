/**
 * Script para mejorar Web Vitals y rendimiento en compresoweb
 * - Optimiza imágenes y reserva espacio para evitar CLS
 * - Aplica lazy loading a imágenes
 * - Asegura defer/async en JS pesados
 * - Añade preconnect a orígenes críticos
 * - Reserva espacio en elementos que causan layout shift
 * - Optimiza srcset y tamaños en imágenes grandes para móvil
 */
(function(){
  // 1. Añade preconnect dinámico para orígenes importantes si no existe ya
  const origins = [
    "https://www.googletagmanager.com",
    "https://fonts.googleapis.com",
    "https://cdnjs.cloudflare.com"
  ];
  origins.forEach(url => {
    if (!document.querySelector(`link[rel="preconnect"][href="${url}"]`)) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = url;
      document.head.appendChild(link);
    }
  });

  // 2. Aplica lazy loading a todas las imágenes (si no está ya)
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  });

  // 3. Reserva espacio para imágenes que no tienen width/height (reduce CLS)
  document.querySelectorAll('img').forEach(img => {
    if (!img.width || !img.height) {
      // Si hay dimensiones en el padre, úsalas
      let w = img.parentElement?.offsetWidth || 320;
      let h = img.parentElement?.offsetHeight || 180;
      img.width = w;
      img.height = h;
    }
  });

  // 4. Reserva espacio para elementos que causan layout shift
  function reserveLayout(selector, minHeight) {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.style.minHeight) el.style.minHeight = minHeight + "px";
    });
  }
  reserveLayout('.description', 48); // Ajusta según diseño real
  reserveLayout('.brillo-activo', 24);

  // 5. Asegura defer en scripts pesados
  document.querySelectorAll('script[src]').forEach(script => {
    if (script.src.match(/main\.min\.js|config\.js|gtm-loader\.js/) && !script.defer && !script.async) {
      script.defer = true;
    }
  });

  // 6. Usa la versión más pequeña de imágenes en móviles si tiene srcset
  function optimizeImagesForDevice() {
    var isMobile = window.innerWidth <= 600;
    document.querySelectorAll('img').forEach(function(img) {
      if (!img.srcset) return;
      var srcs = img.srcset.split(',');
      if (srcs.length > 1 && isMobile) {
        var bestSrc = srcs[0].trim().split(' ')[0];
        img.src = bestSrc;
      }
    });
  }
  window.addEventListener('load', optimizeImagesForDevice);

  // 7. Reserva espacio para el teléfono dinámico (si existe)
  var headerPhone = document.getElementById('header-phone');
  if (headerPhone) headerPhone.style.minWidth = "130px";

  // 8. Asegura font-display: swap en fuentes personalizadas
  var style = document.createElement('style');
  style.innerHTML = "@font-face{font-display:swap}";
  document.head.appendChild(style);
})();
