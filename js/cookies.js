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
          <svg class="cookie-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.53.44-2.96 1.19-4.18.26.34.66.56 1.11.56.82 0 1.5-.68 1.5-1.5 0-.41-.17-.79-.44-1.07.6-.49 1.27-.89 2-1.18V10c0 .55.45 1 1 1s1-.45 1-1V7.42c.71.15 1.38.4 2 .72-.12.22-.19.46-.19.72 0 .82.68 1.5 1.5 1.5.55 0 1.03-.3 1.29-.74.62.65 1.12 1.4 1.47 2.22-.45.08-.83.37-1.03.77-.37.76-.06 1.67.7 2.04.21.1.43.15.65.15.13 0 .27-.02.4-.06.03.38.05.77.05 1.16 0 4.41-3.59 8-8 8z"/>
            <circle cx="9" cy="13" r="1.5"/>
            <circle cx="15" cy="13" r="1.5"/>
            <circle cx="12" cy="16" r="1.5"/>
            <circle cx="10" cy="10" r="1"/>
            <circle cx="14" cy="10" r="1"/>
          </svg>
          <h3>Cuidamos tu experiencia</h3>
        </div>
        <p>Usamos cookies para mejorar la navegación y mostrarte contenido relevante.</p>
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
