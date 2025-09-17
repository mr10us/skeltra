(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // уважаем пользователей

  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      // Явная задержка из data-delay, либо рассчитываем stagger из родителя
      const explicitDelay = parseFloat(el.dataset.delay ?? 'NaN');
      let delay = Number.isNaN(explicitDelay) ? 0 : explicitDelay;

      // если у ближайшего контейнера есть data-stagger — применяем ступенчатую задержку
      if (Number.isNaN(explicitDelay)) {
        const parentWithStagger = el.closest('[data-stagger]');
        if (parentWithStagger) {
          const children = [...parentWithStagger.querySelectorAll('.reveal')];
          const index = Math.max(0, children.indexOf(el));
          const step = parseFloat(parentWithStagger.dataset.stagger || '0.06');
          delay = index * step;
        }
      }

      // Ставим CSS-переменную до добавления класса запуска
      el.style.setProperty('--delay', `${delay}s`);

      // Длительность можно слегка адаптировать к расстоянию скролла (опционально)
      // el.style.setProperty('--dur', `${Math.min(0.6, 0.36 + delay)}s`);

      el.classList.add('is-animated');
      io.unobserve(el);
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // запускаем чуть раньше, чтобы не было "рывка"
    threshold: 0.12
  });

  els.forEach((el) => io.observe(el));
})();
