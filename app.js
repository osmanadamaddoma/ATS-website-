// ATS - INP FIXED app.js - lightweight, no long tasks
(function(){
  function onIdle(fn){
    if('requestIdleCallback' in window) requestIdleCallback(fn,{timeout:2000});
    else setTimeout(fn, 200);
  }
  function onReady(fn){
    if(document.readyState!=='loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, {passive:true});
  }
  onReady(function(){
    // 1. Menu - light, no layout thrash
    var menuBtn = document.getElementById('menuToggle');
    var shell = document.querySelector('.site-shell');
    if(menuBtn && shell){
      menuBtn.addEventListener('click', function(){
        shell.classList.toggle('menu-open');
      }, {passive:true});
    }
    // 2. Language toggle - defer translation work
    var langBtn = document.getElementById('langToggle');
    if(langBtn){
      langBtn.addEventListener('click', function(){
        onIdle(function(){
          var html = document.documentElement;
          var isAr = html.lang === 'ar';
          html.lang = isAr ? 'en' : 'ar';
          html.dir = isAr ? 'ltr' : 'rtl';
          langBtn.textContent = isAr ? 'عربي' : 'EN';
        });
      }, {passive:true});
    }
    // 3. Reveal - ONE observer, idle, no work on click
    onIdle(function(){
      var els = document.querySelectorAll('.reveal');
      if(!('IntersectionObserver' in window)){
        els.forEach(function(e){ e.classList.add('visible'); });
        return;
      }
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){
            en.target.classList.add('visible');
            io.unobserve(en.target);
          }
        });
      }, {rootMargin:'0px 0px -10% 0px', threshold:0.05});
      els.forEach(function(e){ io.observe(e); });
    });
    // 4. Gallery lightbox - delegated, no listeners per image
    var gallery = document.querySelector('.gallery-grid');
    var lightbox = document.getElementById('lightbox');
    var lightboxContent = document.getElementById('lightboxContent');
    if(gallery && lightbox){
      gallery.addEventListener('click', function(e){
        var btn = e.target.closest('.gallery-item');
        if(!btn) return;
        var img = btn.querySelector('img');
        if(!img) return;
        lightboxContent.innerHTML = '';
        var clone = img.cloneNode(false);
        clone.loading = 'eager';
        lightboxContent.appendChild(clone);
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden','false');
      }, {passive:true});
      lightbox.addEventListener('click', function(e){
        if(e.target === lightbox || e.target.classList.contains('lightbox-close')){
          lightbox.classList.remove('active');
          lightbox.setAttribute('aria-hidden','true');
        }
      }, {passive:true});
    }
    // 5. Contact form - no blocking, just note
    var form = document.getElementById('contactForm');
    var note = document.getElementById('formNote');
    if(form && note){
      form.addEventListener('submit', function(){
        note.textContent = 'Sending...';
      }, {passive:true});
    }
    // 6. Smooth scroll - native, no JS animation
    document.documentElement.style.scrollBehavior = 'smooth';
  });
})();
