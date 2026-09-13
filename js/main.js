
  // --- Smooth scroll (lerp-based, no external dependency) ---
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var content = document.getElementById('scrollContent');
  var current = 0, target = 0, ease = reduceMotion ? 1 : 0.085;

  function setBodyHeight(){
    document.body.style.height = content.getBoundingClientRect().height + 'px';
  }
  window.addEventListener('load', setBodyHeight);
  window.addEventListener('resize', setBodyHeight);
  setTimeout(setBodyHeight, 400);
  setBodyHeight();

  window.addEventListener('scroll', function(){ target = window.scrollY; }, { passive:true });

  function loop(){
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.05) current = target;
    if (!reduceMotion) content.style.transform = 'translate3d(0,' + (-current) + 'px,0)';
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // --- Reveal on scroll (single orchestrated behaviour, not scattered per-card) ---
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  // Hero entrance
  window.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.hero-reveal').forEach(function(el, i){
      setTimeout(function(){ el.classList.add('in'); }, 120);
    });
  });
