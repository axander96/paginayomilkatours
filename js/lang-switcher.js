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

  function getDefaultLanguage() {
    return (window.gtranslateSettings && window.gtranslateSettings.default_language) || 'es';
  }

  function getGTranslateSelect() {
    return document.querySelector('.gtranslate_wrapper select.gt_selector');
  }

  function loadGTranslateLibrary() {
    // The native GTranslate widget loads Google's translation library on hover/focus.
    // Since our custom trigger is separate, we load it manually when needed.
    if (!window.gt_translate_script) {
      window.gt_translate_script = document.createElement('script');
      window.gt_translate_script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2';
      document.body.appendChild(window.gt_translate_script);
    }
  }

  function setGTranslateLanguage(lang) {
    const defaultLang = getDefaultLanguage();
    const langPair = defaultLang + '|' + lang;

    const trySet = () => {
      const select = getGTranslateSelect();
      if (!select) return false;

      loadGTranslateLibrary();

      const option = select.querySelector(`option[value="${langPair}"]`);
      if (option) option.selected = true;
      select.value = langPair;

      // Trigger the change event GTranslate listens to
      select.dispatchEvent(new Event('change', { bubbles: true }));

      return true;
    };

    if (!trySet()) {
      const interval = setInterval(() => {
        if (trySet()) clearInterval(interval);
      }, 300);
      setTimeout(() => clearInterval(interval), 8000);
    }
  }

  function syncFromGTranslate() {
    const select = getGTranslateSelect();
    if (select && select.value) {
      const targetLang = select.value.split('|')[1];
      updateLangCode(targetLang);
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
    const attachSelectListener = () => {
      const select = getGTranslateSelect();
      if (select) {
        select.addEventListener('change', () => {
          const targetLang = select.value.split('|')[1];
          updateLangCode(targetLang);
        });
        syncFromGTranslate();
        return true;
      }
      return false;
    };

    if (!attachSelectListener()) {
      const interval = setInterval(() => {
        if (attachSelectListener()) clearInterval(interval);
      }, 300);
      setTimeout(() => clearInterval(interval), 8000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitchers);
  } else {
    initSwitchers();
  }
})();
