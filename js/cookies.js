/**
 * Elétrica Medina — Gerenciador de Consentimento e Privacidade (LGPD)
 * Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
 */

(function () {
  const STORAGE_KEY = 'eletricamedina_cookie_consent';
  const CONSENT_VERSION = '1.0';

  function getSavedConsent() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consentData) {
    consentData.timestamp = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
    } catch (e) {
      console.warn('Não foi possível salvar consentimento no localStorage:', e);
    }
    dispatchConsentEvent(consentData);
    hideBanner();
    hideModal();
  }

  function dispatchConsentEvent(consent) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'ad_storage': consent.marketing ? 'granted' : 'denied',
        'ad_user_data': consent.marketing ? 'granted' : 'denied',
        'ad_personalization': consent.marketing ? 'granted' : 'denied'
      });
    }

    const event = new CustomEvent('eletricamedina_consent_updated', { detail: consent });
    window.dispatchEvent(event);
  }

  function showBanner() {
    const banner = document.getElementById('medina-cookie-banner');
    if (banner) {
      banner.style.display = 'block';
      document.body.classList.add('cookie-banner-active');
    }
  }

  function hideBanner() {
    const banner = document.getElementById('medina-cookie-banner');
    if (banner) {
      banner.style.display = 'none';
      document.body.classList.remove('cookie-banner-active');
    }
  }

  function showModal() {
    const modal = document.getElementById('medina-cookie-modal');
    if (modal) {
      const saved = getSavedConsent();
      const analyticsCheckbox = document.getElementById('toggle-analytics');
      const marketingCheckbox = document.getElementById('toggle-marketing');

      if (saved) {
        if (analyticsCheckbox) analyticsCheckbox.checked = saved.analytics;
        if (marketingCheckbox) marketingCheckbox.checked = saved.marketing;
      }
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function hideModal() {
    const modal = document.getElementById('medina-cookie-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const saved = getSavedConsent();

    if (!saved || saved.version !== CONSENT_VERSION) {
      showBanner();
    } else {
      dispatchConsentEvent(saved);
    }

    const btnAcceptAll = document.getElementById('btn-cookie-accept-all');
    if (btnAcceptAll) {
      btnAcceptAll.addEventListener('click', function () {
        saveConsent({
          version: CONSENT_VERSION,
          necessary: true,
          analytics: true,
          marketing: true,
          status: 'accepted_all'
        });
      });
    }

    const btnRejectOptional = document.getElementById('btn-cookie-reject-optional');
    if (btnRejectOptional) {
      btnRejectOptional.addEventListener('click', function () {
        saveConsent({
          version: CONSENT_VERSION,
          necessary: true,
          analytics: false,
          marketing: false,
          status: 'rejected_optional'
        });
      });
    }

    const btnCustomize = document.getElementById('btn-cookie-customize');
    if (btnCustomize) {
      btnCustomize.addEventListener('click', showModal);
    }

    const btnFloatingTrigger = document.getElementById('btn-cookie-preferences-trigger');
    if (btnFloatingTrigger) {
      btnFloatingTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        showModal();
      });
    }

    const btnCloseModal = document.getElementById('btn-cookie-modal-close');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', hideModal);
    }

    const btnSaveCustom = document.getElementById('btn-cookie-save-custom');
    if (btnSaveCustom) {
      btnSaveCustom.addEventListener('click', function () {
        const analyticsCheckbox = document.getElementById('toggle-analytics');
        const marketingCheckbox = document.getElementById('toggle-marketing');
        saveConsent({
          version: CONSENT_VERSION,
          necessary: true,
          analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
          marketing: marketingCheckbox ? marketingCheckbox.checked : false,
          status: 'customized'
        });
      });
    }

    const modalOverlay = document.getElementById('medina-cookie-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) hideModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.style.display === 'flex') {
        hideModal();
      }
    });
  });
})();
