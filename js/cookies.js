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
        <div class="cookie-banner-text">
          <h3>Cuidamos tu experiencia</h3>
          <p>Usamos cookies para mejorar la navegación y mostrarte contenido relevante. Puedes elegir qué aceptar.</p>
        </div>
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
