
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





// --- Formulaire de devis -> WhatsApp ---
(function(){
  var form = document.getElementById("quoteForm");
  if(!form) return;
  var typeMap = { consommation: "Consommation directe / distribution", industrie: "Industrie / transformation", "les-deux": "Les deux" };
  var qMap = { "moins-250kg": "Moins de 250 kg", "250-1000kg": "250 kg - 1 tonne", "1-5t": "1 - 5 tonnes", "plus-5t": "Plus de 5 tonnes" };
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var fd = new FormData(form);
    var parts = [];
    function v(k){ var s = fd.get(k); return s ? String(s).trim() : ""; }
    if(v("nom")) parts.push("Nom : " + v("nom"));
    if(v("entreprise")) parts.push("Entreprise : " + v("entreprise"));
    if(v("email")) parts.push("Email : " + v("email"));
    if(v("telephone")) parts.push("Téléphone : " + v("telephone"));
    var prods = fd.getAll("produit");
    if(prods.length) parts.push("Produits souhaités : " + prods.join(", "));
    var tp = fd.get("type"); if(tp && typeMap[tp]) parts.push("Type de besoin : " + typeMap[tp]);
    var q = fd.get("quantite"); if(q && qMap[q]) parts.push("Quantité estimée : " + qMap[q]);
    if(v("pays")) parts.push("Pays de destination : " + v("pays"));
    if(v("message")) parts.push("Besoins : " + v("message"));
    var body = "Bonjour BIO Agro Business, voici ma demande de devis :" + "\n" + parts.join("\n");
    var url = "https://wa.me/22672471906?text=" + encodeURIComponent(body);
    window.open(url, "_blank");
  });
})();
