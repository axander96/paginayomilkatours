// Custom language switcher for GTranslate
(function () {
  function closeAllMenus() {
    document.querySelectorAll('.lang-switcher-menu').forEach(menu => menu.classList.remove('open'));
    document.querySelectorAll('.lang-switcher-trigger').forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
  }

  function updateLangCode(lang) {
    const code = lang === 'en' ? 'EN' : 'ES';
    document.querySelectorAll('.lang-switcher-code').forEach(el => {
      el.textContent = code;
    });
  }

  function getGTranslateSelect() {
    return document.querySelector('.gtranslate_wrapper select');
  }

  function setGTranslateLanguage(lang) {
    const trySet = () => {
      const select = getGTranslateSelect();
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    };

    if (!trySet()) {
      const interval = setInterval(() => {
        if (trySet()) clearInterval(interval);
      }, 200);
      setTimeout(() => clearInterval(interval), 5000);
    }
  }

  function syncFromGTranslate() {
    const select = getGTranslateSelect();
    if (select && select.value) {
      updateLangCode(select.value);
    }
  }

  function initSwitchers() {
    document.querySelectorAll('.lang-switcher').forEach(switcher => {
      const trigger = switcher.querySelector('.lang-switcher-trigger');
      const menu = switcher.querySelector('.lang-switcher-menu');
      const options = switcher.querySelectorAll('[data-lang]');

      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('open');
        closeAllMenus();
        if (!isOpen) {
          menu.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      options.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = btn.dataset.lang;
          setGTranslateLanguage(lang);
          updateLangCode(lang);
          closeAllMenus();
        });
      });
    });

    document.addEventListener('click', closeAllMenus);

    // Sync when GTranslate select changes
    const select = getGTranslateSelect();
    if (select) {
      select.addEventListener('change', () => updateLangCode(select.value));
      syncFromGTranslate();
    } else {
      const interval = setInterval(() => {
        const s = getGTranslateSelect();
        if (s) {
          s.addEventListener('change', () => updateLangCode(s.value));
          syncFromGTranslate();
          clearInterval(interval);
        }
      }, 200);
      setTimeout(() => clearInterval(interval), 5000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitchers);
  } else {
    initSwitchers();
  }
})();
