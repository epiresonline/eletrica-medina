/**
 * Elétrica Medina — Inteligência de Front-end, Triagem e Despacho WhatsApp
 * Atendimento 24 Horas em Porto Alegre e Região Metropolitana
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Controle de Tema Claro (Padrão) e Tema Escuro
  initThemeToggle();

  // 2. Menu Gaveta Mobile / Slide-Over Drawer
  initMobileDrawer();

  // 3. Simulador de Atendimento, Estimativa de Tempo e Despacho WhatsApp
  initSimulator();

  // 4. FAQ Accordion
  initFaqAccordion();

  // 5. Scroll Suave para Âncoras
  initSmoothScroll();
});

/* ==========================================================================
   1. Controle de Tema (Light Default com Suporte a Dark Mode)
   ========================================================================== */
function initThemeToggle() {
  const THEME_KEY = 'eletricamedina_theme';
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleBtnDrawer = document.getElementById('theme-toggle-drawer');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function handleToggle() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', handleToggle);
  if (toggleBtnDrawer) toggleBtnDrawer.addEventListener('click', handleToggle);
}

/* ==========================================================================
   2. Menu Hambúrguer Executivo & Gaveta Lateral (Slide-Over Drawer)
   ========================================================================== */
function initMobileDrawer() {
  const openBtn = document.getElementById('btn-open-menu');
  const closeBtn = document.getElementById('btn-close-drawer');
  const drawer = document.getElementById('site-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-nav a');

  function openDrawer() {
    if (drawer && backdrop) {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeDrawer() {
    if (drawer && backdrop) {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. Simulador de Triagem, Estimativa de Tempo e Envio WhatsApp
   ========================================================================== */
function initSimulator() {
  const form = document.getElementById('form-atendimento-medina');
  if (!form) return;

  const inputNome = document.getElementById('sim-nome');
  const inputTelefone = document.getElementById('sim-telefone');
  const selectCidade = document.getElementById('sim-cidade');
  const selectBairroPoa = document.getElementById('sim-bairro-poa');
  const inputBairroOutro = document.getElementById('sim-bairro-outro');
  const containerBairroPoa = document.getElementById('container-bairro-poa');
  const containerBairroOutro = document.getElementById('container-bairro-outro');
  const radioUrgencia = document.querySelectorAll('input[name="modalidade_atendimento"]');
  const urgenciaBox = document.getElementById('urgencia-box');
  const taxaSim = document.getElementById('taxa-sim');
  const taxaNao = document.getElementById('taxa-nao');

  // Elementos do Card de Estimativa
  const estimateEta = document.getElementById('estimate-eta');
  const estimateZone = document.getElementById('estimate-zone');
  const estimateBadge = document.getElementById('estimate-badge');

  // Máscara dinâmica de telefone brasileiro (DDD) 99999-9999
  if (inputTelefone) {
    inputTelefone.addEventListener('input', function (e) {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);

      if (val.length > 6) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
      } else if (val.length > 2) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2)}`;
      } else if (val.length > 0) {
        e.target.value = `(${val}`;
      } else {
        e.target.value = '';
      }
      inputTelefone.classList.remove('input-error');
    });
  }

  if (inputNome) {
    inputNome.addEventListener('input', function () {
      inputNome.classList.remove('input-error');
    });
  }

  // Tabela de Estimativa de Deslocamento em Porto Alegre e Região
  const timeEstimates = {
    'central': { eta: '25 a 35 min', zone: 'Regi\u00E3o Central / Nobre de POA' },
    'norte': { eta: '30 a 45 min', zone: 'Zona Norte de Porto Alegre' },
    'sul': { eta: '35 a 50 min', zone: 'Zona Sul de Porto Alegre' },
    'leste': { eta: '30 a 45 min', zone: 'Zona Leste de Porto Alegre' },
    'canoas': { eta: '35 a 50 min', zone: 'Canoas e Eixo Norte' },
    'gravatai': { eta: '45 a 60 min', zone: 'Gravata\u00ED / Cachoeirinha' },
    'cachoeirinha': { eta: '40 a 55 min', zone: 'Cachoeirinha e Vizinhan\u00E7as' },
    'viamao': { eta: '45 a 65 min', zone: 'Viam\u00E3o e Regi\u00E3o' },
    'alvorada': { eta: '40 a 55 min', zone: 'Alvorada e Eixo Leste' },
    'outra': { eta: '45 a 70 min', zone: 'Regi\u00E3o Metropolitana Ampliada' }
  };

  function updateLocationView() {
    const cidade = selectCidade.value;

    if (cidade === 'Porto Alegre') {
      if (containerBairroPoa) containerBairroPoa.style.display = 'block';
      if (containerBairroOutro) containerBairroOutro.style.display = 'none';
      updatePoaEstimate();
    } else {
      if (containerBairroPoa) containerBairroPoa.style.display = 'none';
      if (containerBairroOutro) containerBairroOutro.style.display = 'block';
      updateMetroEstimate(cidade);
    }
  }

  function updatePoaEstimate() {
    const selectedOption = selectBairroPoa.options[selectBairroPoa.selectedIndex];
    const group = selectedOption ? selectedOption.getAttribute('data-zone') || 'central' : 'central';
    const est = timeEstimates[group] || timeEstimates['central'];

    if (estimateEta) estimateEta.textContent = est.eta;
    if (estimateZone) estimateZone.textContent = `${selectedOption.text} \u2014 ${est.zone}`;
    if (estimateBadge) estimateBadge.textContent = '\u{1F7E2} Deslocamento Imediato POA';
  }

  function updateMetroEstimate(cidade) {
    let key = 'outra';
    const cLower = cidade.toLowerCase();
    if (cLower.includes('canoas')) key = 'canoas';
    else if (cLower.includes('gravata')) key = 'gravatai';
    else if (cLower.includes('cachoeirinha')) key = 'cachoeirinha';
    else if (cLower.includes('viam')) key = 'viamao';
    else if (cLower.includes('alvorada')) key = 'alvorada';

    const est = timeEstimates[key] || timeEstimates['outra'];
    if (estimateEta) estimateEta.textContent = est.eta;
    if (estimateZone) estimateZone.textContent = `${cidade} \u2014 ${est.zone}`;
    if (estimateBadge) estimateBadge.textContent = '\u{1F697} Deslocamento Metropolitano';
  }

  function updateUrgencyView() {
    const selectedMode = document.querySelector('input[name="modalidade_atendimento"]:checked');
    const isEmergencia = selectedMode && selectedMode.value === 'emergencia';

    if (urgenciaBox) {
      urgenciaBox.style.display = isEmergencia ? 'block' : 'none';
    }

    if (!isEmergencia && taxaNao) {
      taxaNao.checked = true;
    } else if (isEmergencia && taxaSim) {
      taxaSim.checked = true;
    }
  }

  if (selectCidade) selectCidade.addEventListener('change', updateLocationView);
  if (selectBairroPoa) selectBairroPoa.addEventListener('change', updatePoaEstimate);
  radioUrgencia.forEach(r => r.addEventListener('change', updateUrgencyView));

  // Inicializa visual
  updateLocationView();
  updateUrgencyView();

  // Submissão do Formulário e Montagem do Link WhatsApp
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = (inputNome ? inputNome.value : '').trim();
    const telefone = (inputTelefone ? inputTelefone.value : '').trim();

    // Validação estrita de campos obrigatórios
    if (!nome) {
      if (inputNome) {
        inputNome.focus();
        inputNome.classList.add('input-error');
      }
      alert('Por favor, informe seu nome para iniciarmos o atendimento.');
      return;
    }

    if (!telefone || telefone.replace(/\D/g, '').length < 8) {
      if (inputTelefone) {
        inputTelefone.focus();
        inputTelefone.classList.add('input-error');
      }
      alert('Por favor, informe seu telefone / WhatsApp de contato com DDD.');
      return;
    }

    const cidade = selectCidade.value;
    let bairro = '';

    if (cidade === 'Porto Alegre') {
      const selectedOption = selectBairroPoa.options[selectBairroPoa.selectedIndex];
      bairro = selectedOption ? selectedOption.text : 'Porto Alegre';
    } else {
      bairro = (inputBairroOutro.value || '').trim() || 'Regi\u00E3o Metropolitana';
    }

    const modalidadeInput = document.querySelector('input[name="modalidade_atendimento"]:checked');
    const isEmergencia = modalidadeInput && modalidadeInput.value === 'emergencia';
    const modalidadeTexto = isEmergencia ? 'Plant\u00E3o de Emerg\u00EAncia 24h (Imediato)' : 'Agendamento Comercial Regular';

    let taxaTexto = 'N\u00E3o aplic\u00E1vel (Hor\u00E1rio Comercial)';
    if (isEmergencia) {
      const taxaInput = document.querySelector('input[name="aceite_taxa"]:checked');
      if (taxaInput && taxaInput.value === 'sim') {
        taxaTexto = 'SIM \u2014 Aceita a taxa de deslocamento/urg\u00EAncia do plant\u00E3o 24h';
      } else {
        taxaTexto = 'N\u00C3O \u2014 Deseja confirmar valores antes ou agendar';
      }
    }

    const servico = document.getElementById('sim-servico').value;
    const descricao = (document.getElementById('sim-descricao').value || '').trim() || 'Sem observa\u00E7\u00F5es adicionais.';
    const tempoEstimado = estimateEta ? estimateEta.textContent.replace(/[\u{1F7E2}\u{1F697}]/gu, '').trim() : '30 a 45 min';

    // Montagem da mensagem estruturada com Unicode escapes 100% seguros
    const msg = [
      `*SOLICITA\u00C7\u00C3O DE ATENDIMENTO \u2014 EL\u00C9TRICA MEDINA* \u26A1`,
      ``,
      `\u{1F464} *Cliente:* ${nome}`,
      `\u{1F4DE} *Contato:* ${telefone}`,
      `\u{1F4CD} *Localiza\u00E7\u00E3o:* ${bairro}, ${cidade}`,
      `\u23F1\uFE0F *Tempo Estimado POA:* ${tempoEstimado}`,
      `\u{1F6A8} *Modalidade:* ${modalidadeTexto}`,
      `\u{1F4B0} *Taxa de Urg\u00EAncia:* ${taxaTexto}`,
      `\u{1F6E0}\uFE0F *Servi\u00E7o Solicitado:* ${servico}`,
      `\u{1F4DD} *Detalhes:* ${descricao}`,
      ``,
      `_Mensagem originada pelo site oficial El\u00E9trica Medina_`
    ].join('\n');

    const whatsappNumber = '5551992108340';
    // Endpoint oficial e universal do WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(msg)}`;

    // Redireciona o usuário para o WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. Scroll Suave para Âncoras
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
