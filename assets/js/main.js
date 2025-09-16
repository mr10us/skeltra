window.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    await ensureSwiper();
    initialiseSliders();
  } catch (e) {
    console.error("Swiper load failed:", e);
  } finally {
  }
}

/* ===== Надёжная загрузка Swiper ===== */
async function ensureSwiper() {
  if (window.Swiper) return;

  // если на странице уже есть тег со swiper — просто подождём глобал
  const existing = document.querySelector("script[src*='swiper']");
  if (existing) {
    await waitForGlobal(() => window.Swiper, 5000);
    if (window.Swiper) return;
  }

  // Список источников: локальный, затем CDN bundle
  const sources = [
    {
      css: "assets/css/swiper.min.css",
      js: "assets/js/swiper.min.js",
      note: "local",
    },
    {
      css: "https://unpkg.com/swiper@11/swiper-bundle.min.css",
      js: "https://unpkg.com/swiper@11/swiper-bundle.min.js",
      note: "cdn",
    },
  ];

  for (const src of sources) {
    try {
      await addCSSOnce(src.css);
      const ok = await loadScriptUntilGlobal(src.js, () => window.Swiper, 5000);
      if (ok && window.Swiper) return; // успех
    } catch (e) {
      console.warn("[swiper] try failed:", src.note, e);
      // пробуем следующий источник
    }
  }
  throw new Error("Unable to load Swiper from all sources");
}

function addCSSOnce(href) {
  return new Promise((resolve) => {
    if ([...document.styleSheets].some((s) => s.href && s.href.includes(href)))
      return resolve();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve(); // не блокируем цепочку
    document.head.appendChild(link);
  });
}

/**
 * Подгружаем <script>, но РАСЧИТЫВАЕМ не на onload,
 * а на появление глобала (window.Swiper) или таймаут.
 */
function loadScriptUntilGlobal(src, globalCheck, timeout = 5000) {
  return new Promise((resolve, reject) => {
    let done = false;
    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";

    const cleanup = () => {
      script.onload = script.onerror = null;
    };

    const t = setTimeout(() => {
      if (done) return;
      done = true;
      cleanup();
      resolve(false); // таймаут — считаем попытку неудачной
    }, timeout);

    // Если вдруг onload пришёл — ок, но всё равно проверим глобал
    script.onload = () => {
      if (done) return;
      // не завершаем сразу — ждём глобал параллельно (ниже)
    };
    script.onerror = () => {
      if (done) return;
      done = true;
      cleanup();
      clearTimeout(t);
      resolve(false); // ошибка — двигаемся к следующему источнику
    };

    document.head.appendChild(script);

    // Параллельно опрашиваем наличие глобала
    pollForGlobal(globalCheck, timeout).then((has) => {
      if (done) return;
      done = true;
      cleanup();
      clearTimeout(t);
      resolve(!!has);
    });
  });
}

function pollForGlobal(check, timeout = 5000, interval = 50) {
  return new Promise((resolve) => {
    const start = Date.now();
    (function tick() {
      try {
        if (check()) return resolve(true);
      } catch {}
      if (Date.now() - start > timeout) return resolve(false);
      setTimeout(tick, interval);
    })();
  });
}

function waitForGlobal(check, timeout = 5000, interval = 50) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function tick() {
      try {
        if (check()) return resolve();
      } catch {}
      if (Date.now() - start > timeout)
        return reject(new Error("waitFor timeout"));
      setTimeout(tick, interval);
    })();
  });
}

function initialiseSliders() {
  const aboutSwiperEl = document.querySelector(".about .about-swiper");

  if (aboutSwiperEl) {
    const aboutSwiper = new Swiper(aboutSwiperEl, {
      slidesPerView: 1,
      loop: true,
      spaceBetween: 16,
      pagination: {
        el: ".about-swiper-container .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".about-swiper-container .swiper-button-next",
        prevEl: ".about-swiper-container .swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        1024: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
        1440: {
          slidesPerView: 4,
          slidesPerGroup: 4,
        },
      },
    });
  }

  const portfolioSwiperEl = document.querySelector(
    ".portfolio .portfolio-swiper"
  );

  if (portfolioSwiperEl) {
    const portfolioSwiper = new Swiper(portfolioSwiperEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      navigation: {
        nextEl: ".portfolio-swiper-container .swiper-button-next",
        prevEl: ".portfolio-swiper-container .swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        1024: {
          slidesPerView: 3,
        },
        1440: {
          slidesPerView: 4,
        },
      },
    });
  }

  
  const reviewsSwiperEl = document.querySelector(
    ".reviews .reviews-swiper"
  );

  if (reviewsSwiperEl) {
    const reviewsSwiper = new Swiper(reviewsSwiperEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      navigation: {
        nextEl: ".reviews-swiper-container .swiper-button-next",
        prevEl: ".reviews-swiper-container .swiper-button-prev",
      },
      pagination: {
        el: ".reviews-swiper-container .swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 2,
          slidesPerGroup: 2,
        },
        1440: {
          slidesPerView: 3,
          slidesPerGroup: 3,
        },
      },
    });
  }
}
