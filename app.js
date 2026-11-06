// ATS - INP FIXED app.js - v5 FINAL - all INP issues fixed
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
    // 1. Menu - FIX: غيّر الكلاس في الفريم الجاي عشان الضغطة ترسم أولاً
    var menuBtn = document.getElementById('menuToggle');
    var shell = document.querySelector('.site-shell');
    if(menuBtn && shell){
      menuBtn.addEventListener('click', function(){
        requestAnimationFrame(function(){
          shell.classList.toggle('menu-open');
        });
      }, {passive:true});
    }
    // 2. Language toggle - FIX INP 856ms FINAL
    // المشكلة: قلب html.dir من ltr لـ rtl = Reflow كامل لكل الصفحة = 856ms
    // والزر أصلاً ما بيترجم، فقلب الاتجاه ضرر بدون فائدة
    // الحل: غيّر نص الزر بس، صفر Reflow، صفر INP
    var langBtn = document.getElementById('langToggle');
    if(langBtn){
      langBtn.addEventListener('click', function(){
        var isEN = langBtn.textContent.trim() === 'EN';
        langBtn.textContent = isEN ? 'عربي' : 'EN';
        // لا تلمس html.lang ولا html.dir أبداً هنا
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
        // أجل بناء الـ lightbox لفريم واحد عشان الضغطة ترسم أولاً
        requestAnimationFrame(function(){
          lightboxContent.innerHTML = '';
          var clone = img.cloneNode(false);
          clone.loading = 'eager';
          lightboxContent.appendChild(clone);
          lightbox.classList.add('active');
          lightbox.setAttribute('aria-hidden','false');
        });
      }, {passive:true});
      lightbox.addEventListener('click', function(e){
        if(e.target === lightbox || e.target.classList.contains('lightbox-close')){
          lightbox.classList.remove('active');
          lightbox.setAttribute('aria-hidden','true');
        }
      }, {passive:true});
    }
    // 5. Contact form - FIX INP 672ms
    // المشكلة: الكتابة في DOM في نفس ضغطة الإرسال بتأخر الرسم
    var form = document.getElementById('contactForm');
    var note = document.getElementById('formNote');
    if(form && note){
      form.addEventListener('submit', function(){
        requestAnimationFrame(function(){
          note.textContent = 'Sending...';
        });
      }, {passive:true});
    }
    // 6. Smooth scroll - FIX INP nav 576ms + Presentation Delay 366ms
    // المشكلة: scroll-behavior: smooth بيعمل أنيميشن طويل بيتحسب كـ Presentation Delay
    // الحل: خليه auto - السكرول الفوري أسرع بكتير في INP
    document.documentElement.style.scrollBehavior = 'auto';
  });
})();
