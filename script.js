document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.getElementById('motion-toggle');
  let userPaused = false;
  let savedTheme = null;
  try {
    userPaused = localStorage.getItem('ether-motion') === 'off';
    savedTheme = localStorage.getItem('ether-theme');
  } catch { /* Browser storage can be unavailable in private or file contexts. */ }
  const save = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Preferences still work for this visit. */ }
  };

  const applyTheme = theme => {
    root.dataset.theme = theme;
    const isDark = theme === 'dark';
    document.getElementById('theme-label').textContent = isDark ? 'Day' : 'Night';
    document.getElementById('theme-toggle').setAttribute('aria-label', isDark ? 'Switch to daylight theme' : 'Switch to night theme');
    document.querySelector('meta[name="theme-color"]').content = isDark ? '#15211a' : '#f1f0e8';
  };
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  // Smooth theme transition animation
  let themeTransitionTimer;
  document.getElementById('theme-toggle').addEventListener('click', () => {
    if (!root.classList.contains('motion-paused') && !reducedMotion.matches) {
      root.classList.add('theme-transitioning');
      clearTimeout(themeTransitionTimer);
      themeTransitionTimer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 360);
    }
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    save('ether-theme', theme);
  });

  const applyMotion = () => {
    const paused = userPaused || reducedMotion.matches;
    root.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = reducedMotion.matches ? 'Reduced motion enabled' : paused ? 'Resume motion' : 'Pause motion';
    motionButton.disabled = reducedMotion.matches;
    document.dispatchEvent(new Event('ether:motionchange'));
    updateScrollImage();
  };
  motionButton.addEventListener('click', () => {
    userPaused = !userPaused;
    save('ether-motion', userPaused ? 'off' : 'on');
    applyMotion();
  });
  reducedMotion.addEventListener('change', applyMotion);

  const menu = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-navigation');
  const setMenu = open => {
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menu.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  window.matchMedia('(max-width: 760px)').addEventListener('change', () => setMenu(false));

  // Emil Kowalski spring-momentum tilt on floating hero fragment
  const heroFragment = document.querySelector('.hero-fragment');
  const heroSection = document.getElementById('home');
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;
  let heroTiltRaf = null;

  const updateHeroTilt = () => {
    heroTiltRaf = null;
    if (root.classList.contains('motion-paused') || window.matchMedia('(pointer: coarse)').matches || !heroFragment) return;

    // Linear interpolation with damping (simulates gentle spring settle)
    currentTiltX += (targetTiltX - currentTiltX) * 0.09;
    currentTiltY += (targetTiltY - currentTiltY) * 0.09;

    const baseRot = -3;
    const dynamicRot = baseRot + currentTiltY * 2.2;
    heroFragment.style.transform = `rotate(${dynamicRot.toFixed(2)}deg) translate3d(${(currentTiltX * 7).toFixed(1)}px, ${(currentTiltY * 6).toFixed(1)}px, 0)`;

    if (Math.abs(targetTiltX - currentTiltX) > 0.005 || Math.abs(targetTiltY - currentTiltY) > 0.005) {
      heroTiltRaf = requestAnimationFrame(updateHeroTilt);
    }
  };

  if (heroSection) {
    heroSection.addEventListener('pointermove', event => {
      if (root.classList.contains('motion-paused') || window.matchMedia('(pointer: coarse)').matches) return;
      const rect = heroSection.getBoundingClientRect();
      const normX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      targetTiltX = Math.max(-1, Math.min(1, normX));
      targetTiltY = Math.max(-1, Math.min(1, normY));
      if (!heroTiltRaf) heroTiltRaf = requestAnimationFrame(updateHeroTilt);
    }, { passive: true });

    heroSection.addEventListener('pointerleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
      if (!heroTiltRaf) heroTiltRaf = requestAnimationFrame(updateHeroTilt);
    });
  }

  const panels = [...document.querySelectorAll('.scene-panel')];
  const scenes = panels.map(panel => ({
    src: panel.querySelector('img').getAttribute('src'),
    alt: panel.querySelector('img').alt,
    title: panel.querySelector('.scene-trigger > span').textContent,
    caption: panel.querySelector('.scene-detail p').textContent
  }));
  const selectScene = index => {
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === index);
      panel.querySelector('.scene-trigger').setAttribute('aria-expanded', String(i === index));
      panel.querySelector('.scene-detail').hidden = i !== index;
    });
  };
  panels.forEach((panel, index) => {
    const trigger = panel.querySelector('.scene-trigger');
    trigger.addEventListener('click', () => selectScene(index));
    trigger.addEventListener('keydown', event => {
      const offset = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1}[event.key];
      if (!offset) return;
      event.preventDefault();
      const next = (index + offset + panels.length) % panels.length;
      selectScene(next);
      panels[next].querySelector('.scene-trigger').focus();
    });
  });

  const dialog = document.getElementById('still-dialog');
  const dialogImage = document.getElementById('dialog-image');
  let currentScene = 0;
  let isDialogFading = false;

  const showScene = (index, animated = true) => {
    currentScene = (index + scenes.length) % scenes.length;
    const scene = scenes[currentScene];
    document.getElementById('dialog-title').textContent = scene.title;
    document.getElementById('dialog-caption').textContent = scene.caption;
    document.getElementById('dialog-position').textContent = `${currentScene + 1} / ${scenes.length}`;

    if (!animated || root.classList.contains('motion-paused') || !dialog.open) {
      dialogImage.src = scene.src;
      dialogImage.alt = scene.alt;
      return;
    }

    if (isDialogFading) return;
    isDialogFading = true;
    dialogImage.classList.add('is-fading');
    setTimeout(() => {
      dialogImage.src = scene.src;
      dialogImage.alt = scene.alt;
      dialogImage.classList.remove('is-fading');
      isDialogFading = false;
    }, 130);
  };

  document.querySelectorAll('[data-open-scene]').forEach(button => {
    button.addEventListener('click', () => {
      showScene(Number(button.dataset.openScene), false);
      dialog.showModal();
    });
  });
  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
  document.getElementById('dialog-prev').addEventListener('click', () => showScene(currentScene - 1));
  document.getElementById('dialog-next').addEventListener('click', () => showScene(currentScene + 1));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showScene(currentScene + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  const setHorizon = scene => {
    const image = document.getElementById('hero-landscape');
    image.src = scene.src;
    image.alt = scene.alt;
  };
  try {
    const saved = scenes.find(scene => scene.src === localStorage.getItem('ether-horizon-bg'));
    if (saved) setHorizon(saved);
  } catch { /* The default landscape remains available without storage. */ }

  let toastTimer;
  document.getElementById('set-horizon').addEventListener('click', () => {
    const scene = scenes[currentScene];
    setHorizon(scene);
    save('ether-horizon-bg', scene.src);
    dialog.close();
    document.getElementById('home').scrollIntoView({behavior: root.classList.contains('motion-paused') ? 'instant' : 'smooth'});
    document.getElementById('site-status').textContent = `Opening scene changed to ${scene.title.toLowerCase()}.`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { document.getElementById('site-status').textContent = ''; }, 4200);
  });

  const fragments = [
    ['fieldnotes', 'I took the long way home today. For a few minutes, the sky was the same green as the song.', 'Somewhere after school.'],
    ['lowtide', 'I do not know any of your real names. It is strange how that makes it easier to say what I mean.', 'A window left open.'],
    ['greenroom', 'The headphones are old. The left side only works if I hold the cable a certain way. I keep them anyway.', 'Listening again.'],
    ['distantlight', 'Maybe we are all looking at different skies and hearing the same thing.', 'Before the last train.']
  ];
  let fragmentIndex = 0;
  const bbsMessage = document.querySelector('.bbs-message');
  let isBrowsingBBS = false;

  const browseFragment = offset => {
    if (isBrowsingBBS) return;
    fragmentIndex = (fragmentIndex + offset + fragments.length) % fragments.length;
    const [author, quote, signoff] = fragments[fragmentIndex];

    if (root.classList.contains('motion-paused') || !bbsMessage) {
      document.getElementById('bbs-author').textContent = author;
      document.getElementById('bbs-quote').textContent = quote;
      document.getElementById('bbs-signoff').textContent = signoff;
      document.getElementById('bbs-position').textContent = `${fragmentIndex + 1} / ${fragments.length}`;
      return;
    }

    // Emil Kowalski blur-masking technique for fluid text state transition
    isBrowsingBBS = true;
    bbsMessage.classList.add('is-changing');
    setTimeout(() => {
      document.getElementById('bbs-author').textContent = author;
      document.getElementById('bbs-quote').textContent = quote;
      document.getElementById('bbs-signoff').textContent = signoff;
      document.getElementById('bbs-position').textContent = `${fragmentIndex + 1} / ${fragments.length}`;
      bbsMessage.classList.remove('is-changing');
      isBrowsingBBS = false;
    }, 140);
  };

  document.getElementById('bbs-prev').addEventListener('click', () => browseFragment(-1));
  document.getElementById('bbs-next').addEventListener('click', () => browseFragment(1));

  const scrollImage = document.querySelector('.scroll-image');
  let scrollFrame = 0;
  function updateScrollImage() {
    scrollFrame = 0;
    if (root.classList.contains('motion-paused')) {
      scrollImage.style.transform = '';
      scrollImage.style.opacity = '';
      return;
    }
    const rect = scrollImage.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight * .65)));
    scrollImage.style.transform = `scale(${.8 + progress * .2})`;
    scrollImage.style.opacity = rect.bottom < 120 ? Math.max(.2, rect.bottom / 120) : 1;
  }
  const scheduleScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollImage); };
  window.addEventListener('scroll', scheduleScroll, {passive: true});
  window.addEventListener('resize', scheduleScroll);
  applyMotion();
});
