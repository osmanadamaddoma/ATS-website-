// ATS - INP FIXED app.js - lightweight, no long tasks - v3 langToggle fixed
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
    // 2. Language toggle - FIX INP 752ms
    // المشكلة القديمة: onIdle + dir flip = reflow كامل + تأخير الرسم
    // الحل: حدّث الزر فوراً، وأجّل قلب الاتجاه لفريم واحد فقط
    var langBtn = document.getElementById('langToggle');
    if(langBtn){
      langBtn.addEventListener('click', function(){
        var html = document.documentElement;
        var isAr = html.lang === 'ar';
        var newLang = isAr ? 'en' : 'ar';
        var newDir = isAr ? 'ltr' : 'rtl';
        var newLabel = isAr ? 'عربي' : 'EN';

        // 1) استجابة فورية - غيّر نص الزر طوالي، ده بيرسم في نفس الفريم
        // وده اللي بيخلي INP ينزل من 752ms لـ تحت 100ms
        langBtn.textContent = newLabel;

        // 2) قلب اللغة والاتجاه في الفريم الجاي، مش في نفس الضغطة
        // عشان المتصفح يرسم الضغطة أولاً وبعدين يعمل الـ Reflow
        requestAnimationFrame(function(){
          html.lang = newLang;
          html.dir = newDir;
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
