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

  // Carrega preferência salva ou mantém light
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

  // Tabela de Estimativa de Deslocamento em Porto Alegre e Região
  const timeEstimates = {
    // Zona Central / Nobre de Porto Alegre
    'central': { eta: '25 a 35 min', zone: 'Região Central / Nobre de POA' },
    // Zona Norte POA
    'norte': { eta: '30 a 45 min', zone: 'Zona Norte de Porto Alegre' },
    // Zona Sul POA
    'sul': { eta: '35 a 50 min', zone: 'Zona Sul de Porto Alegre' },
    // Zona Leste POA
    'leste': { eta: '30 a 45 min', zone: 'Zona Leste de Porto Alegre' },
    // Cidades Metropolitanas
    'canoas': { eta: '35 a 50 min', zone: 'Canoas e Eixo Norte' },
    'gravatai': { eta: '45 a 60 min', zone: 'Gravataí / Cachoeirinha' },
    'cachoeirinha': { eta: '40 a 55 min', zone: 'Cachoeirinha e Vizinhanças' },
    'viamao': { eta: '45 a 65 min', zone: 'Viamão e Região' },
    'alvorada': { eta: '40 a 55 min', zone: 'Alvorada e Eixo Leste' },
    'outra': { eta: '45 a 70 min', zone: 'Região Metropolitana Ampliada' }
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
    if (estimateZone) estimateZone.textContent = `${selectedOption.text} — ${est.zone}`;
    if (estimateBadge) estimateBadge.textContent = '🟢 Deslocamento Imediato POA';
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
    if (estimateZone) estimateZone.textContent = `${cidade} — ${est.zone}`;
    if (estimateBadge) estimateBadge.textContent = '🚗 Deslocamento Metropolitano';
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

    const nome = (document.getElementById('sim-nome').value || '').trim();
    const telefone = (document.getElementById('sim-telefone').value || '').trim();
    const cidade = selectCidade.value;
    let bairro = '';

    if (cidade === 'Porto Alegre') {
      const selectedOption = selectBairroPoa.options[selectBairroPoa.selectedIndex];
      bairro = selectedOption ? selectedOption.text : 'Porto Alegre';
    } else {
      bairro = (inputBairroOutro.value || '').trim() || 'Região Metropolitana';
    }

    const modalidadeInput = document.querySelector('input[name="modalidade_atendimento"]:checked');
    const isEmergencia = modalidadeInput && modalidadeInput.value === 'emergencia';
    const modalidadeTexto = isEmergencia ? 'Plantão de Emergência 24h (Imediato)' : 'Agendamento Comercial Regular';

    let taxaTexto = 'Não aplicável (Horário Comercial)';
    if (isEmergencia) {
      const taxaInput = document.querySelector('input[name="aceite_taxa"]:checked');
      if (taxaInput && taxaInput.value === 'sim') {
        taxaTexto = 'SIM — Aceita a taxa de deslocamento/urgência do plantão 24h';
      } else {
        taxaTexto = 'NÃO — Deseja confirmar valores antes ou agendar';
      }
    }

    const servico = document.getElementById('sim-servico').value;
    const descricao = (document.getElementById('sim-descricao').value || '').trim() || 'Sem observações adicionais.';
    const tempoEstimado = estimateEta ? estimateEta.textContent : '30 a 45 min';

    // Montagem da mensagem estruturada
    const msg = [
      `*SOLICITAÇÃO DE ATENDIMENTO — ELÉTRICA MEDINA* ⚡`,
      ``,
      `👤 *Cliente:* ${nome}`,
      `📞 *Contato:* ${telefone}`,
      `📍 *Localização:* ${bairro}, ${cidade}`,
      `⏱️ *Tempo Estimado POA:* ${tempoEstimado}`,
      `🚨 *Modalidade:* ${modalidadeTexto}`,
      `💰 *Taxa de Urgência:* ${taxaTexto}`,
      `🛠️ *Serviço Solicitado:* ${servico}`,
      `📝 *Detalhes:* ${descricao}`,
      ``,
      `_Mensagem originada pelo site oficial Elétrica Medina_`
    ].join('\n');

    const whatsappNumber = '5551992108340';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;

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

      // Fecha outros itens
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Alterna o item atual
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
