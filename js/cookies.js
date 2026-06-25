// Cookie consent banner for Yomilka Tours
(function () {
  const CONSENT_KEY = 'yomilka_cookie_consent';

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY));
    } catch (e) {
      return null;
    }
  }

  function setConsent(type) {
    const consent = {
      essential: true,
      analytics: type === 'all',
      marketing: type === 'all',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    hideBanner();
  }

  function hideBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
  }

  function showBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.add('show');
  }

  function createBanner() {
    if (document.getElementById('cookieBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-header">
          <svg class="cookie-icon" width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="24" cy="24" r="24" fill="#172135"/>
            <g transform="scale(1.25) translate(-4.8 -4.8)">
              <path d="M30.25 25.1c-.7.1-1.42-.07-2.02-.5a3.22 3.22 0 0 1-1.22-1.68 3.27 3.27 0 0 1-3.48-3.47 6.78 6.78 0 1 0 6.72 5.65Z" stroke="#2F80ED" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="21.2" cy="25.3" r="0.75" fill="#2F80ED"/>
              <circle cx="24.8" cy="29" r="0.75" fill="#2F80ED"/>
              <circle cx="25.4" cy="24.8" r="0.55" fill="#2F80ED"/>
              <circle cx="19.1" cy="29" r="0.55" fill="#2F80ED"/>
            </g>
          </svg>
          <h3>Tu experiencia nos importa</h3>
        </div>
        <p>Utilizamos cookies para mejorar tu navegación y mostrarte contenido de tu interés. Puedes elegir qué permitir.</p>
        <div class="cookie-banner-actions">
          <button class="cookie-btn cookie-btn-secondary" type="button">Solo esenciales</button>
          <button class="cookie-btn cookie-btn-primary" type="button">Aceptar todo</button>
        </div>
      </div>
    `;

    banner.querySelector('.cookie-btn-secondary').addEventListener('click', () => setConsent('essential'));
    banner.querySelector('.cookie-btn-primary').addEventListener('click', () => setConsent('all'));

    document.body.appendChild(banner);
  }

  function init() {
    createBanner();
    if (!getConsent()) {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
