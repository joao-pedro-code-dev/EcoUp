(() => {
  'use strict';

  const STORAGE_KEY = 'ecoup-demo-state-v1';
  const materials = {
    plastic: { name: 'Plástico limpo', points: 25, icon: '🧴', hint: 'Esvazie e, quando possível, enxágue a embalagem. Confira as regras da coleta local.' },
    paper: { name: 'Papel e papelão', points: 10, icon: '📦', hint: 'Mantenha o papel seco e sem excesso de gordura. Achate caixas para ocupar menos espaço.' },
    metal: { name: 'Metal / lata', points: 35, icon: '🥫', hint: 'Esvazie as latas e tenha cuidado com bordas cortantes.' },
    glass: { name: 'Vidro', points: 30, icon: '🍾', hint: 'Manuseie com cuidado. Embale cacos e siga a orientação da coleta local.' },
    'e-waste': { name: 'Eletrônico pequeno', points: 50, icon: '🔋', hint: 'Eletrônicos e baterias costumam precisar de pontos de entrega específicos. Não use lixeira comum.' }
  };

  const $ = (id) => document.getElementById(id);
  const pointsTotal = $('points-total');
  const itemsCount = $('items-count');
  const rewardsCount = $('rewards-count');
  const progress = $('reward-progress');
  const progressPercent = $('progress-percent');
  const nextRewardText = $('next-reward-text');
  const select = $('material-select');
  const hint = $('material-hint');
  const selectedIcon = $('selected-material-icon');
  const feedback = $('simulation-feedback');
  const toast = $('toast');
  const toastMessage = $('toast-message');
  const resetDialog = $('reset-dialog');
  let toastTimer;

  const defaultState = () => ({ points: 0, items: 0, redemptions: 0, history: [] });
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const saved = JSON.parse(raw);
      return {
        points: Number.isFinite(saved.points) && saved.points >= 0 ? saved.points : 0,
        items: Number.isFinite(saved.items) && saved.items >= 0 ? saved.items : 0,
        redemptions: Number.isFinite(saved.redemptions) && saved.redemptions >= 0 ? saved.redemptions : 0,
        history: Array.isArray(saved.history) ? saved.history.slice(-30) : []
      };
    } catch (error) {
      return defaultState();
    }
  }
  let state = loadState();

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { /* A demonstração continua funcionando mesmo sem armazenamento local. */ }
  }

  function render() {
    pointsTotal.textContent = state.points.toLocaleString('pt-BR');
    itemsCount.textContent = state.items.toLocaleString('pt-BR');
    rewardsCount.textContent = state.redemptions.toLocaleString('pt-BR');
    const firstGoal = 100;
    const nextGoal = state.points < firstGoal ? firstGoal : state.points < 250 ? 250 : state.points < 500 ? 500 : 1000;
    const pct = Math.min(100, Math.round((state.points / nextGoal) * 100));
    progress.style.width = `${pct}%`;
    progressPercent.textContent = `${pct}%`;
    if (state.points >= firstGoal) {
      nextRewardText.textContent = state.points < 250
        ? 'Você já pode resgatar a recompensa de 100 pontos. Próxima meta: 250.'
        : state.points < 500
          ? 'Você já pode resgatar recompensas de até 250 pontos. Próxima meta: 500.'
          : `Você já pode resgatar recompensas de até 500 pontos. Próxima meta: ${nextGoal}.`;
    } else {
      nextRewardText.textContent = `Faltam ${firstGoal - state.points} EcoPoints para a primeira recompensa.`;
    }
  }

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 4300);
  }

  function updateMaterial() {
    const material = materials[select.value] || materials.plastic;
    selectedIcon.textContent = material.icon;
    hint.textContent = material.hint;
    feedback.classList.remove('success');
  }

  $('simulate-disposal').addEventListener('click', () => {
    const material = materials[select.value] || materials.plastic;
    state.points += material.points;
    state.items += 1;
    state.history.push({ material: select.value, points: material.points, at: Date.now() });
    saveState();
    render();
    feedback.textContent = `+${material.points} EcoPoints simulados para ${material.name.toLowerCase()}!`;
    feedback.classList.add('success');
    showToast(`Boa! +${material.points} EcoPoints na sua demonstração.`);
  });

  select.addEventListener('change', updateMaterial);
  document.querySelectorAll('.redeem-button').forEach((button) => {
    button.addEventListener('click', () => {
      const cost = Number(button.dataset.cost);
      const name = button.dataset.name || 'recompensa';
      if (state.points < cost) {
        const missing = cost - state.points;
        showToast(`Faltam ${missing} EcoPoints para resgatar: ${name}.`);
        return;
      }
      state.points -= cost;
      state.redemptions += 1;
      saveState();
      render();
      showToast(`${name} resgatado na demonstração! Nenhum benefício real foi emitido.`);
    });
  });

  $('reset-demo').addEventListener('click', () => {
    if (typeof resetDialog.showModal === 'function') resetDialog.showModal();
    else if (window.confirm('Reiniciar a demonstração e zerar seus dados?')) resetState();
  });
  function resetState() {
    state = defaultState();
    saveState();
    render();
    feedback.textContent = 'Escolha um material e faça sua primeira simulação.';
    feedback.classList.remove('success');
    if (resetDialog.open) resetDialog.close();
    showToast('Demonstração reiniciada. Seu saldo voltou a zero.');
  }
  $('confirm-reset').addEventListener('click', resetState);
  $('cancel-reset').addEventListener('click', () => resetDialog.close());
  resetDialog.addEventListener('click', (event) => {
    if (event.target === resetDialog) resetDialog.close();
  });
  $('toast-close').addEventListener('click', () => toast.classList.remove('visible'));
  $('current-year').textContent = new Date().getFullYear();

  const menuToggle = $('menu-toggle');
  const nav = $('primary-nav');
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
    nav.classList.toggle('open', !expanded);
    document.body.classList.toggle('menu-open', !expanded);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  }));

  render();
  updateMaterial();
})();
