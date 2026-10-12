(() => {
  'use strict';
  document.documentElement.classList.add('js');

  /* Contact channels. Fill at least one: the form and the floating button use them.
     whatsapp: international number without + or spaces (e.g. '226XXXXXXXX'). email: 'contact@...' */
  const CONFIG = { whatsapp: '', email: '' };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const navToggle = $('#nav-toggle');
  const siteNav = $('#site-nav');
  const closeNav = () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    siteNav?.classList.remove('is-open');
  };
  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav?.classList.toggle('is-open', !isOpen);
  });
  $$('#site-nav a').forEach(link => link.addEventListener('click', closeNav));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });

  const heroImage = $('.hero__image');
  const heroVideo = $('.hero__video');
  if (heroImage && heroVideo) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData === true;
    const videoUnavailable = () => heroImage.classList.add('video-unavailable');
    const playHeroVideo = () => {
      if (reducedMotion || saveData || document.hidden) return;
      const playRequest = heroVideo.play();
      if (playRequest && typeof playRequest.catch === 'function') {
        playRequest.catch(() => {
          /* Browsers can reject autoplay; the poster remains visible as fallback. */
        });
      }
    };

    heroVideo.addEventListener('error', videoUnavailable, { once: true });
    heroVideo.addEventListener('loadeddata', playHeroVideo, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        heroVideo.pause();
      } else {
        playHeroVideo();
      }
    });
    if (reducedMotion || saveData) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    } else {
      playHeroVideo();
    }
  }

  let textRevealObserver = null;
  let heroRevealObserver = null;
  let revealFrame = 0;

  const splitWords = (element, className) => {
    const generatedWords = $$(`.${className}`, element);
    const text = generatedWords.length
      ? generatedWords.map(word => word.textContent.trim()).join(' ')
      : element.textContent.trim();
    if (!text) return [];
    element.setAttribute('aria-label', text);
    element.textContent = '';
    return text.split(/\s+/).map((word, index) => {
      const span = document.createElement('span');
      span.className = className;
      span.textContent = word;
      span.style.setProperty('--word-index', index);
      span.setAttribute('aria-hidden', 'true');
      element.append(span);
      return span;
    });
  };

  const revealVisibleText = () => {
    $$('.text-reveal:not(.is-revealed)').forEach(target => {
      const bounds = target.getBoundingClientRect();
      if (bounds.top < window.innerHeight * .86 && bounds.bottom > 0) {
        target.classList.add('is-revealed');
      }
    });
  };

  const prepareTextAnimations = () => {
    textRevealObserver?.disconnect();
    heroRevealObserver?.disconnect();
    const heroTitle = $('.hero h1');
    const hero = $('.hero');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (heroTitle) {
      $$('[data-i18n^="h_title"]', heroTitle).forEach(part => {
        splitWords(part, 'hero-reveal-word');
      });
    }

    const textTargets = $$('#why h2, #why .lead, #products h2, #products .section-heading__aside, #origin h2, #origin .lead, #process h2, #process .section-heading__aside, #contact h2, #contact .lead');
    textTargets.forEach(target => {
      target.classList.add('text-reveal');
      splitWords(target, 'reveal-word');
    });

    if (reducedMotion) {
      $$('.text-reveal').forEach(target => target.classList.add('is-revealed'));
      hero?.classList.add('is-visible');
      return;
    }

    if (hero) {
      heroRevealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      }, { threshold: 0 });
      heroRevealObserver.observe(hero);
      const bounds = hero.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        hero.classList.add('is-visible');
      }
    }

    textRevealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
      });
    }, { threshold: .2, rootMargin: '0px 0px -60px' });
    $$('.text-reveal').forEach(target => textRevealObserver.observe(target));
    revealVisibleText();
  };

  const onScroll = () => {
    if (revealFrame) return;
    revealFrame = requestAnimationFrame(() => {
      revealFrame = 0;
      revealVisibleText();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const revealItems = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px' });
    revealItems.forEach(item => {
      item.style.setProperty('--reveal-delay', `${item.dataset.revealDelay || 0}ms`);
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  /* Marquee: duplicate the group so the loop is seamless (done before i18n capture) */
  const group = $('.marquee__group');
  if (group) {
    const copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    group.after(copy);
  }

  /* Language (FR default text lives in the HTML, EN in i18n.js) */
  const texts = $$('[data-i18n]');
  texts.forEach(el => { el.dataset.fr = el.textContent; });
  let lang = 'fr';
  let current = null;

  const setLang = l => {
    lang = l;
    document.documentElement.lang = l;
    texts.forEach(el => { el.textContent = l === 'fr' ? el.dataset.fr : (I18N.en[el.dataset.i18n] ?? el.dataset.fr); });
    $('#lang').textContent = l === 'fr' ? 'EN' : 'FR';
    $('#form-status').textContent = '';
    if (current && detail) fillDetail(current);
    prepareTextAnimations();
    try { localStorage.setItem('lang', l); } catch (e) { /* storage unavailable */ }
  };

  /* Product detail (orbit nodes and pills share the same content as the product cards) */
  const orbit = $('#orbit');
  const detail = $('#detail');
  const fillDetail = id => {
    $('#d-title').textContent = $(`#${id} h3`).textContent;
    $('#d-desc').textContent = $(`#${id} .product__desc`).textContent;
  };
  const markActive = id => $$('.node, .pill').forEach(b => b.classList.toggle('is-active', b.dataset.p === id));

  const selectProduct = id => {
    current = id;
    fillDetail(id);
    markActive(id);
    detail.hidden = false;
    orbit.classList.add('is-paused');
  };
  const closeDetail = () => {
    current = null;
    markActive(null);
    detail.hidden = true;
    orbit.classList.remove('is-paused');
  };

  $$('.node, .pill').forEach(b => b.addEventListener('click', () => (current === b.dataset.p ? closeDetail() : selectProduct(b.dataset.p))));
  if ($('#d-close')) $('#d-close').addEventListener('click', closeDetail);
  if ($('#d-cta')) $('#d-cta').addEventListener('click', () => { $('#f-product').value = current; });
  $$('[data-pick]').forEach(a => a.addEventListener('click', () => { $('#f-product').value = a.dataset.pick; }));

  /* Contact form: opens WhatsApp or the mail client with a ready-to-send message */
  const status = $('#form-status');
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    if (!f.elements.name.value.trim() || !f.elements.country.value.trim()) {
      status.textContent = I18N.status.missing[lang];
      return;
    }
    const subject = `Novarix | ${lang === 'fr' ? 'Demande de devis' : 'Quote request'}`;
    const body = [...f.elements]
      .filter(el => el.name && el.value.trim())
      .map(el => `${el.closest('label').firstElementChild.textContent}: ${el.selectedOptions ? el.selectedOptions[0].text : el.value.trim()}`)
      .join('\n');
    if (CONFIG.whatsapp) {
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`${subject}\n${body}`)}`, '_blank', 'noopener');
    } else if (CONFIG.email) {
      location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
      status.textContent = I18N.status[lang];
    }
  });

  if (CONFIG.whatsapp) {
    const wa = $('#wa');
    wa.href = `https://wa.me/${CONFIG.whatsapp}`;
    wa.hidden = false;
  }

  /* Init: saved choice, else browser language */
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* ignore */ }
  const browserLang = (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  if ((saved || browserLang) === 'en') setLang('en');
  prepareTextAnimations();
  $('#lang').addEventListener('click', () => setLang(lang === 'fr' ? 'en' : 'fr'));
})();
