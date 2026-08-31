const PROJECT_ID = '587018';
let deviceChartInst = null;
let funnelDonutChartInst = null;
let currentPeriod = 'today';
let rawEventsCache = [];
let isFetching = false;

// ─── View / Tab Switching ───
function switchTab(tab, el) {
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  const kpisEl = document.getElementById('kpis');
  const funnelEl = document.getElementById('funnelSection');
  const dropoffEl = document.getElementById('dropoff');
  const liveEl = document.getElementById('live');
  const devicesEl = document.getElementById('devices');

  if (tab === 'all') {
    if (kpisEl) kpisEl.style.display = 'grid';
    if (funnelEl) funnelEl.style.display = 'grid';
    if (dropoffEl) dropoffEl.style.display = 'block';
    if (liveEl) liveEl.style.display = 'block';
    if (devicesEl) devicesEl.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tab === 'funnel') {
    if (kpisEl) kpisEl.style.display = 'grid';
    if (funnelEl) funnelEl.style.display = 'grid';
    if (dropoffEl) dropoffEl.style.display = 'none';
    if (liveEl) liveEl.style.display = 'none';
    if (devicesEl) devicesEl.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tab === 'dropoff') {
    if (kpisEl) kpisEl.style.display = 'none';
    if (funnelEl) funnelEl.style.display = 'none';
    if (dropoffEl) dropoffEl.style.display = 'block';
    if (liveEl) liveEl.style.display = 'none';
    if (devicesEl) devicesEl.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tab === 'live') {
    if (kpisEl) kpisEl.style.display = 'none';
    if (funnelEl) funnelEl.style.display = 'none';
    if (dropoffEl) dropoffEl.style.display = 'none';
    if (liveEl) liveEl.style.display = 'block';
    if (devicesEl) devicesEl.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tab === 'devices') {
    if (kpisEl) kpisEl.style.display = 'none';
    if (funnelEl) funnelEl.style.display = 'none';
    if (dropoffEl) dropoffEl.style.display = 'none';
    if (liveEl) liveEl.style.display = 'none';
    if (devicesEl) devicesEl.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ─── Period Filter ───
function setPeriod(period, btnEl) {
  currentPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  
  applyPeriodFilterAndRender();
  fetchData();
}

function applyPeriodFilterAndRender() {
  if (!rawEventsCache || rawEventsCache.length === 0) {
    return;
  }

  const now = new Date();
  let filtered = rawEventsCache;

  if (currentPeriod === 'today') {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const matches = rawEventsCache.filter(e => {
      if (!e.timestamp) return true;
      const t = new Date(e.timestamp).getTime();
      return t >= todayStart || (now.getTime() - t) <= (24 * 3600 * 1000);
    });
    filtered = matches.length > 0 ? matches : rawEventsCache;
  } else if (currentPeriod === 'yesterday') {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - (24 * 3600 * 1000);
    filtered = rawEventsCache.filter(e => {
      if (!e.timestamp) return false;
      const t = new Date(e.timestamp).getTime();
      return t >= yesterdayStart && t < todayStart;
    });
  } else if (currentPeriod === '7days') {
    const sevenDaysAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
    filtered = rawEventsCache.filter(e => {
      if (!e.timestamp) return true;
      return new Date(e.timestamp).getTime() >= sevenDaysAgo;
    });
  }

  const eventsToRender = (filtered && filtered.length > 0) ? filtered : rawEventsCache;
  processData(eventsToRender);

  const periodLabels = { today: 'Hoje', yesterday: 'Ontem', '7days': 'Últimos 7 dias' };
  const count = eventsToRender.length;
  const lastUp = document.getElementById('lastUpdateText');
  if (lastUp) lastUp.textContent = `${periodLabels[currentPeriod] || 'Hoje'} · ${count} eventos sincronizados · ${new Date().toLocaleTimeString('pt-BR')}`;
  const conn = document.getElementById('connectionStatus');
  if (conn) conn.textContent = `🟢 Conectado (${count} eventos)`;
}

// ─── Live Data Fetching ───
async function fetchData() {
  if (isFetching) return;
  isFetching = true;

  const btn = document.getElementById('refreshBtn');
  if (btn) {
    btn.classList.add('loading');
    btn.innerHTML = '⚡ Atualizando...';
  }

  try {
    const proxyUrl = window.location.protocol === 'file:' 
      ? 'http://localhost:8080/api/posthog' 
      : '/api/posthog';
      
    const res = await fetch(proxyUrl + '?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        rawEventsCache = data.results;
        try { localStorage.setItem('cached_quiz_events', JSON.stringify(data.results)); } catch(e){}
        applyPeriodFilterAndRender();
      }
    }
  } catch (e) {
    console.warn('Erro ao atualizar eventos:', e);
  } finally {
    isFetching = false;
    if (btn) {
      btn.classList.remove('loading');
      btn.innerHTML = '🔄 Atualizar';
    }
  }
}

// ─── Process Events ───
function processData(events) {
  if (!events || !Array.isArray(events)) return;

  const users = new Set();
  const stepUsers = {};
  let startsUsers = new Set();
  let completedUsers = new Set();
  let vslUsers = new Set();
  let checkoutUsers = new Set();

  const devices = { Mobile: 0, Desktop: 0, Tablet: 0 };

  const translations = {
    '$pageview': '🌐 Acessou o Quiz',
    'quiz_step_view': '👁️ Visualizou Pergunta',
    'quiz_started': '🚀 Iniciou o Quiz',
    'quiz_question_answered': '✅ Marcou Resposta',
    'quiz_result_view': '📋 Viu Perfil IMC',
    'quiz_completed': '🏁 Completou o Quiz',
    'vsl_offer_view': '🎬 Abriu Oferta VSL',
    'quiz_lead_submitted': '📧 Enviou E-mail',
    'checkout_button_clicked': '🛒 Clicou em Comprar',
    '$autocapture': '🖱️ Interação na Página',
    '$pageleave': '👋 Saiu da Página'
  };

  const dotColors = {
    'quiz_started': 'var(--cyan)',
    'quiz_completed': 'var(--success)',
    'vsl_offer_view': 'var(--warning)',
    'checkout_button_clicked': 'var(--pink)',
    'quiz_question_answered': 'var(--accent)',
    '$pageview': 'var(--text-muted)',
    '$autocapture': 'var(--text-muted)',
    '$pageleave': 'var(--text-muted)'
  };

  const feedItems = [];

  events.forEach(e => {
    const uid = e.distinct_id;
    if (uid) users.add(uid);
    const name = e.event;
    const p = e.properties || {};
    const stepNum = String(p.step_number || p.step || '');

    if (name === 'quiz_started' || (name === 'quiz_step_view' && (stepNum === '1' || stepNum === '1b')) || name === 'quiz_question_answered') {
      if (uid) startsUsers.add(uid);
    }
    if (name === 'quiz_completed' || (name === 'quiz_step_view' && stepNum === '30')) {
      if (uid) completedUsers.add(uid);
    }
    if (name === 'vsl_offer_view') {
      if (uid) vslUsers.add(uid);
    }
    if (name === 'checkout_button_clicked') {
      if (uid) checkoutUsers.add(uid);
    }

    if (stepNum) {
      if (!stepUsers[stepNum]) stepUsers[stepNum] = new Set();
      if (uid) stepUsers[stepNum].add(uid);
    }

    const rawDev = p['$device_type'] || 'Desktop';
    const dev = (rawDev === 'Mobile' || rawDev === 'Mobile Safari') ? 'Mobile' : (rawDev === 'Tablet' ? 'Tablet' : 'Desktop');
    devices[dev] = (devices[dev] || 0) + 1;

    // Feed
    const time = new Date(e.timestamp).toLocaleTimeString('pt-BR');
    const label = translations[name] || name;
    let detail = p.step_title || p.question_key || (stepNum ? `Etapa ${stepNum}` : '');
    if (p.answer !== undefined && p.answer !== null) detail += `: ${JSON.stringify(p.answer)}`;
    if (name === 'checkout_button_clicked') detail = 'Redirecionamento LastLink';
    const city = `${p['$geoip_city_name'] || ''}${p['$geoip_subdivision_1_code'] ? ', ' + p['$geoip_subdivision_1_code'] : ''}`.trim() || 'Brasil';
    const devLabel = `${dev} · ${p['$browser'] || ''} · ${city}`;

    feedItems.push({ time, label, detail, devLabel, name, dotColor: dotColors[name] || 'var(--text-muted)' });
  });

  const total = Math.max(users.size, 1);
  const starts = Math.min(total, (startsUsers.size || (stepUsers['1']?.size || 0) || (stepUsers['1b']?.size || 0) || total));
  const completed = completedUsers.size || (stepUsers['30']?.size || 0);
  const vsl = vslUsers.size || (stepUsers['vsl']?.size || 0);
  const checkout = checkoutUsers.size;

  // Transform stepUsers to counts
  const stepCounts = {};
  for (const k in stepUsers) {
    stepCounts[k] = stepUsers[k].size;
  }

  // Update KPIs
  animateValue('kpiVisitors', total);
  animateValue('kpiStarts', starts);
  animateValue('kpiCompleted', completed);
  animateValue('kpiVsl', vsl);
  animateValue('kpiCheckout', checkout);

  const startsPct = total > 0 ? Math.round((starts / total) * 100) : 0;
  const completedPct = starts > 0 ? Math.round((completed / starts) * 100) : 0;
  const convPct = total > 0 ? ((checkout / total) * 100).toFixed(1) : '0.0';

  const elStartsRate = document.getElementById('kpiStartsRate');
  if (elStartsRate) elStartsRate.textContent = `${startsPct}% taxa de início`;

  const elCompletedRate = document.getElementById('kpiCompletedRate');
  if (elCompletedRate) elCompletedRate.textContent = `${completedPct}% taxa de conclusão`;

  const elConvRate = document.getElementById('kpiConvRate');
  if (elConvRate) elConvRate.textContent = `${convPct}% taxa de conversão`;

  // Funnel
  buildFunnel([
    { label: 'Acessaram o Quiz', count: total, icon: '👥' },
    { label: 'Iniciaram Respostas', count: starts, icon: '🚀' },
    { label: 'Projeção 21 Dias', count: stepCounts['26c'] || (stepCounts['19'] ? 1 : (stepCounts['6'] ? 1 : 0)), icon: '📊' },
    { label: 'Finalizaram o Quiz', count: completed, icon: '🏁' },
    { label: 'Abriram a Oferta VSL', count: vsl, icon: '🎬' },
    { label: 'Clicaram para Comprar', count: checkout, icon: '🛒' }
  ], total);

  // Dropoff Table
  buildDropoff(stepCounts, total);

  // Feed
  buildFeed(feedItems);
  const badge = document.getElementById('navLiveBadge');
  if (badge) badge.textContent = events.length;

  // Funnel Donut Chart
  buildFunnelDonutChart({ total, starts, completed, vsl, checkout });

  // Devices Chart
  buildDeviceChart(devices);
}

// ─── Animate Number ───
function animateValue(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  if (start === target) { el.textContent = target; return; }
  const duration = 600;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ─── Funnel ───
function buildFunnel(stages, base) {
  const el = document.getElementById('funnelContainer');
  if (!el) return;
  let html = '';

  stages.forEach((s, i) => {
    const pct = base > 0 ? Math.min(100, Math.round((s.count / base) * 100)) : 0;
    let dropHtml = '';
    if (i > 0) {
      const prev = stages[i - 1].count || 1;
      const dropPct = Math.round(((prev - s.count) / prev) * 100);
      if (dropPct > 0) {
        dropHtml = `<div class="funnel-drop-arrow">↓ −${dropPct}% de queda</div>`;
      }
    }

    html += `
      ${dropHtml}
      <div class="funnel-step">
        <div class="funnel-step-info">
          <div class="funnel-step-label">${s.icon} ${s.label}</div>
          <div class="funnel-bar-track">
            <div class="funnel-bar-value" style="width: ${pct}%"></div>
          </div>
        </div>
        <div class="funnel-step-stats">
          <div class="funnel-count">${s.count}</div>
          <div class="funnel-pct">${pct}%</div>
        </div>
      </div>
    `;
  });

  el.innerHTML = html;
}

// ─── Dropoff Table ───
function buildDropoff(stepCounts, base) {
  const tbody = document.getElementById('dropoffBody');
  if (!tbody) return;

  const steps = [
    ['1', 'Etapa 1 — Faixa Etária'],
    ['1b', 'Etapa 1b — Idade Exata'],
    ['2', 'Etapa 2 — Prova Social'],
    ['3', 'Etapa 3 — Experiência Prévia'],
    ['5', 'Etapa 5 — Objetivo Principal'],
    ['6', 'Etapa 6 — Zonas de Preocupação'],
    ['7', 'Etapa 7 — Zonas Alvo'],
    ['8', 'Etapa 8 — Nível de Conforto'],
    ['12', 'Etapa 12 — Limitações Físicas'],
    ['14', 'Etapa 14 — Frequência Atividade'],
    ['15', 'Etapa 15 — Altura'],
    ['16', 'Etapa 16 — Peso Atual'],
    ['17', 'Etapa 17 — Peso Alvo'],
    ['23', 'Etapa 23 — Preferência Alimentar'],
    ['24', 'Dieta & Nutrição'],
    ['25', 'Comprometimento'],
    ['26', 'Resumo Pré-Cálculo'],
    ['26c', 'Projeção 21 Dias'],
    ['26d', 'Perfil IMC'],
    ['30', 'Etapa 30 — Resumo Final']
  ];

  let rows = '';
  let runningRetention = 100;

  steps.forEach(([k, name], index) => {
    const rawCount = stepCounts[k] || 0;
    
    let pct = 0;
    if (index === 0) {
      pct = 100;
      runningRetention = 100;
    } else {
      if (rawCount > 0 && base > 0) {
        const calculatedPct = Math.min(100, Math.round((rawCount / base) * 100));
        runningRetention = Math.min(runningRetention, calculatedPct);
        pct = runningRetention;
      } else {
        pct = (index <= 5 && rawCount > 0) ? 100 : 0;
      }
    }

    const displayCount = (index === 0 && rawCount === 0) ? base : rawCount;

    let tagClass = 'tag-success', tagText = '✅ Saudável';
    let barColor = 'var(--success)';
    if (pct === 0 && displayCount === 0) { 
      tagClass = 'tag-warning'; tagText = '—'; barColor = 'var(--text-muted)'; 
    } else if (pct < 30) { 
      tagClass = 'tag-danger'; tagText = '🔴 Crítico'; barColor = 'var(--danger)'; 
    } else if (pct < 65) { 
      tagClass = 'tag-warning'; tagText = '⚠️ Atenção'; barColor = 'var(--warning)'; 
    }

    rows += `
      <tr>
        <td class="step-name">${name}</td>
        <td>${displayCount}</td>
        <td style="font-weight: 700;">${pct}%</td>
        <td>
          <span class="mini-bar"><span class="mini-bar-fill" style="width: ${pct}%; background: ${barColor};"></span></span>
        </td>
        <td><span class="tag ${tagClass}">${tagText}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = rows;
}

// ─── Live Feed ───
function buildFeed(items) {
  const el = document.getElementById('feedList');
  if (!el) return;

  if (!items || items.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📡</div>
        <div class="empty-state-text">Nenhum evento registrado ainda</div>
        <div class="empty-state-sub">Abra o quiz em outra aba e responda algumas perguntas</div>
      </div>`;
    return;
  }

  const meaningful = items.filter(i => i.name !== '$autocapture');
  const display = meaningful.slice(0, 30);

  let html = '';
  display.forEach(item => {
    html += `
      <div class="feed-item">
        <div class="feed-dot" style="background: ${item.dotColor};"></div>
        <div class="feed-content">
          <div class="feed-event">${item.label}</div>
          <div class="feed-detail">${item.detail || item.devLabel}</div>
          <a href="https://us.posthog.com/project/${PROJECT_ID}/replay" target="_blank" class="feed-replay">
            🎥 Ver Gravação
          </a>
        </div>
        <div class="feed-time">${item.time}</div>
      </div>
    `;
  });

  el.innerHTML = html;
}

// ─── Funnel Donut Chart ───
function buildFunnelDonutChart(data) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('funnelDonutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (funnelDonutChartInst) funnelDonutChartInst.destroy();

  const vals = [
    data.total || 0,
    data.starts || 0,
    data.completed || 0,
    data.vsl || 0,
    data.checkout || 0
  ];

  const convPct = data.total > 0 ? ((data.checkout / data.total) * 100).toFixed(1) : '0';
  const centerRateEl = document.getElementById('centerConvRate');
  if (centerRateEl) centerRateEl.textContent = `${convPct}%`;

  const hexColors = [
    '#818cf8', // Roxo - Visitantes
    '#22d3ee', // Ciano - Iniciaram
    '#34d399', // Verde - Completaram
    '#fbbf24', // Amarelo - Viram VSL
    '#f472b6'  // Rosa - Cliques Compras
  ];

  const labels = [
    '👥 Visitantes Únicos',
    '🚀 Iniciaram o Quiz',
    '🏁 Completaram o Quiz',
    '🎬 Viram a Oferta VSL',
    '🛒 Cliques em Comprar'
  ];

  funnelDonutChartInst = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: vals.every(v => v === 0) ? [1, 1, 1, 1, 1] : vals,
        backgroundColor: hexColors,
        borderColor: 'transparent',
        borderWidth: 0,
        spacing: 3,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleFont: { weight: '700' },
          callbacks: {
            label: function(context) {
              const val = context.parsed;
              const pct = data.total > 0 ? Math.round((val / data.total) * 100) : 0;
              return ` ${context.label}: ${val} (${pct}%)`;
            }
          }
        }
      }
    }
  });

  // Custom Funnel Legend
  const legendEl = document.getElementById('funnelLegend');
  if (!legendEl) return;
  let legendHtml = '';
  labels.forEach((label, i) => {
    const val = vals[i];
    const pct = data.total > 0 ? Math.round((val / data.total) * 100) : 0;
    legendHtml += `
      <div class="legend-item">
        <div class="legend-dot" style="background: ${hexColors[i]}; box-shadow: 0 0 10px ${hexColors[i]}aa;"></div>
        <span style="color: #f8fafc; font-size: 0.92rem;">${label}</span>
        <span class="legend-value">${val} <span style="font-size: 0.78rem; color: #94a3b8; font-weight: 600;">(${pct}%)</span></span>
      </div>
    `;
  });
  legendEl.innerHTML = legendHtml;
}

// ─── Devices Chart ───
function buildDeviceChart(devices) {
  if (typeof Chart === 'undefined') return;
  const canvas = document.getElementById('deviceChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (deviceChartInst) deviceChartInst.destroy();

  const vals = [devices.Mobile || 0, devices.Desktop || 0, devices.Tablet || 0];
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  const totalEl = document.getElementById('totalDevices');
  if (totalEl) totalEl.textContent = total;

  const hexColors = ['#f472b6', '#818cf8', '#22d3ee'];
  const labels = ['📱 Celular / Mobile', '💻 Computador / Desktop', '📱 Tablet'];

  deviceChartInst = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: vals.every(v => v === 0) ? [1, 1, 1] : vals,
        backgroundColor: hexColors,
        borderColor: 'transparent',
        borderWidth: 0,
        spacing: 3,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          borderColor: '#334155',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
          titleFont: { weight: '700' },
          callbacks: {
            label: function(context) {
              const val = context.parsed;
              const pct = Math.round((val / total) * 100);
              return ` ${context.label}: ${val} (${pct}%)`;
            }
          }
        }
      }
    }
  });

  const legendEl = document.getElementById('deviceLegend');
  if (!legendEl) return;
  let legendHtml = '';
  labels.forEach((label, i) => {
    const pct = Math.round((vals[i] / total) * 100);
    legendHtml += `
      <div class="legend-item">
        <div class="legend-dot" style="background: ${hexColors[i]}; box-shadow: 0 0 10px ${hexColors[i]}aa;"></div>
        <span style="color: #f8fafc; font-size: 0.92rem;">${label}</span>
        <span class="legend-value">${vals[i]} <span style="font-size: 0.78rem; color: #94a3b8; font-weight: 600;">(${pct}%)</span></span>
      </div>
    `;
  });
  legendEl.innerHTML = legendHtml;
}

// ─── Init ───
try {
  const cached = localStorage.getItem('cached_quiz_events');
  if (cached) {
    rawEventsCache = JSON.parse(cached);
    applyPeriodFilterAndRender();
  }
} catch(e) {}

fetchData();
setInterval(fetchData, 5000);

