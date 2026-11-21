// 魔法王國資訊站 — 主程式（原生 ES Modules，無需建置）
import { GATES, MONSTERS, MONSTERS_VERSION, POTIONS, ICONS, LANGUAGES } from './data.js';
import { t, detectLanguage, setLanguage, getLanguage } from './i18n.js';

const $ = (sel, root = document) => root.querySelector(sel);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* ---------- 數字格式 ---------- */

/** 遊戲顯示單位：無條件捨去（1,267,000 → 1.26M、888,500 → 888.5K），與原始表格一致 */
export function fmtGame(n) {
  const trunc = (v, d) => Math.floor(v * 10 ** d) / 10 ** d;
  if (n >= 1_000_000) return `${trunc(n / 1_000_000, 2)}M`;
  if (n >= 1_000) return `${trunc(n / 1_000, 1)}K`;
  return String(n);
}
const fmtFull = (n) => new Intl.NumberFormat(getLanguage()).format(n);

/* ---------- 道具 ---------- */

function itemHtml({ id, qty, amount, note, isNew }) {
  const name = t(`items.${id}`);
  const parts = [name];
  if (amount != null) parts.push(fmtGame(amount));
  let text = parts.join(' ');
  if (note) text += ` (${note})`;
  return `<li class="item">
    <span class="item__icon" aria-hidden="true">${ICONS[id] ?? '•'}</span>
    <span class="item__name">${esc(text)}</span>
    ${qty ? `<span class="item__qty">×${qty}</span>` : ''}
    ${isNew ? `<span class="tag tag--new">${esc(t('common.new'))}</span>` : ''}
  </li>`;
}
const itemList = (items) => `<ul class="items" role="list">${items.map(itemHtml).join('')}</ul>`;

/* ---------- 大門與鑰匙 ---------- */

function renderGates() {
  const col = (kind) => {
    const icon = kind === 'bronze' ? '🗝️' : '🔑';
    return `<article class="gate-col gate-col--${kind}">
      <h3 class="gate-col__title"><span aria-hidden="true">${icon}</span> ${esc(t(`gates.${kind}`))}</h3>
      <ol class="gate-list" role="list">
        ${GATES[kind]
          .map(
            (g) => `<li class="gate card">
              <header class="gate__head">
                <span class="gate__no">${g.no}</span>
                <span class="gate__island">${esc(t('common.island', { n: g.island }))}</span>
              </header>
              ${itemList(g.rewards)}
              <p class="gate__cost">${esc(t('gates.cost'))}
                <strong>${g.cost}</strong> ${esc(t(`gates.${kind}Unit`))} <span aria-hidden="true">${icon}</span></p>
            </li>`,
          )
          .join('')}
      </ol>
    </article>`;
  };
  const sum = (kind) => GATES[kind].reduce((a, g) => a + g.cost, 0);
  $('#gates-body').innerHTML = `
    <div class="gate-grid">${col('bronze')}${col('gold')}</div>
    <p class="note">${esc(t('gates.totalNote', { bronze: sum('bronze'), gold: sum('gold') }))}</p>`;
}

/* ---------- 怪物 ---------- */

let monsterZone = 'all';

function renderMonsters() {
  const zones = ['all', 2, 3, 4, 5];
  const list = MONSTERS.filter((m) => monsterZone === 'all' || m.zone === monsterZone);
  const grandTotal = list.reduce((a, m) => a + m.total, 0);

  $('#monsters-body').innerHTML = `
    <div class="chips" role="group" aria-label="${esc(t('monsters.filter'))}">
      ${zones
        .map(
          (z) => `<button type="button" class="chip" data-zone="${z}" aria-pressed="${z === monsterZone}">
            ${esc(z === 'all' ? t('common.all') : t('common.zone', { n: z }))}</button>`,
        )
        .join('')}
    </div>
    <p class="summary">${esc(t('monsters.summary', { count: list.length }))}
      <strong title="${esc(fmtFull(grandTotal))}">${fmtGame(grandTotal)}</strong></p>
    <div class="monster-grid">
      ${list.map(monsterCard).join('')}
    </div>`;
}

function monsterCard(m) {
  const badges = [
    m.priority && `<span class="tag tag--priority">${esc(t('monsters.priority'))}</span>`,
    m.mustPass && `<span class="tag tag--must">${esc(t('monsters.mustPass'))}</span>`,
  ].filter(Boolean).join('');
  const final = m.finalKey ? `<p>${esc(t(m.finalKey))}</p>` : itemList(m.final);

  return `<article class="monster card" data-zone="${m.zone}">
    <header class="monster__head">
      <span class="monster__no" aria-label="#${m.no}">${m.no}</span>
      <div>
        <h3 class="monster__name">${esc(t(`monsters.names.${m.name}`))}</h3>
        <p class="monster__zone">${esc(t('common.zone', { n: m.zone }))}</p>
      </div>
      <div class="monster__badges">${badges}</div>
    </header>
    <div class="table-wrap">
      <table class="stage-table">
        <caption class="visually-hidden">${esc(t(`monsters.names.${m.name}`))} #${m.no}</caption>
        <thead><tr>
          <th scope="col">${esc(t('monsters.hp'))}</th>
          <th scope="col">${esc(t('monsters.reward'))}</th>
          <th scope="col">${esc(t('monsters.cost'))}</th>
        </tr></thead>
        <tbody>
          ${m.stages
            .map(
              (s) => `<tr>
                <td data-label="${esc(t('monsters.hp'))}">${fmtFull(s.hp)}</td>
                <td data-label="${esc(t('monsters.reward'))}">${itemList(s.reward)}</td>
                <td data-label="${esc(t('monsters.cost'))}"><span title="${esc(fmtFull(s.cost))}">${fmtGame(s.cost)}</span></td>
              </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="monster__final">
      <h4>${esc(t('monsters.final'))}</h4>
      ${final}
    </div>
    <footer class="monster__total">
      <span>🧪 ${esc(t('monsters.total'))}</span>
      <strong title="${esc(fmtFull(m.total))}">${fmtGame(m.total)}</strong>
    </footer>
  </article>`;
}

/* ---------- 藥水需求 ---------- */

const potionState = { zone4: 0, zone5: 0 };
const budget = { zone4: '', zone5: '' };

function renderPotions(zone) {
  const tiers = POTIONS[zone];
  const idx = potionState[zone];
  const tier = tiers[idx];
  const max = Math.max(...tiers.map((x) => x.flags.flat().reduce((a, b) => a + b, 0)));
  const flagLabels = ['🚩 0/3', '🚩 1/3', '🚩 2/3'];

  // 預算計算：依序（0/3 → 1/3 → 2/3）扣除藥水，看可以走到哪一格
  const have = Number(String(budget[zone]).replace(/[^\d]/g, '')) || 0;
  let remain = have;
  let reached = 0;
  const totalCells = tier.flags.flat().length;
  const affordable = tier.flags.map((col) =>
    col.map((v) => {
      if (have && remain >= v) { remain -= v; reached++; return true; }
      remain = -1;
      return false;
    }),
  );

  const body = $(`#${zone}-body`);
  body.innerHTML = `
    <div class="tabs" role="tablist" aria-label="${esc(t('potions.bet'))}">
      ${tiers
        .map(
          (x, i) => `<button type="button" role="tab" class="tab" id="${zone}-tab-${i}"
            aria-selected="${i === idx}" aria-controls="${zone}-panel" tabindex="${i === idx ? 0 : -1}"
            data-zone="${zone}" data-idx="${i}">🔋 ${x.bet}</button>`,
        )
        .join('')}
    </div>

    <div class="potion-panel card" role="tabpanel" id="${zone}-panel" aria-labelledby="${zone}-tab-${idx}">
      <div class="budget">
        <label for="${zone}-budget">${esc(t('potions.budget'))}</label>
        <input id="${zone}-budget" inputmode="numeric" autocomplete="off" placeholder="${esc(t('potions.budgetPlaceholder'))}"
          value="${esc(budget[zone])}" data-zone="${zone}">
        <output for="${zone}-budget" aria-live="polite">${
          have ? esc(t('potions.budgetResult', { reached, total: totalCells })) : ''
        }</output>
      </div>

      <div class="flag-grid">
        ${tier.flags
          .map((col, f) => {
            const sub = col.reduce((a, b) => a + b, 0);
            return `<section class="flag-col" aria-label="${flagLabels[f]}">
              <h3 class="flag-col__title">${flagLabels[f]}</h3>
              <ol class="cells" role="list">
                ${col
                  .map((v, i) => {
                    const cyc = tier.cyclops && tier.cyclops.flag === f && i >= tier.cyclops.from;
                    const ok = affordable[f][i];
                    return `<li class="cell${cyc ? ' cell--cyclops' : ''}${have ? (ok ? ' cell--ok' : ' cell--no') : ''}"
                      title="${esc(fmtFull(v))}${cyc ? ` — ${esc(t('monsters.names.cyclops'))}` : ''}">
                      <span class="cell__i">${i + 1}</span><span class="cell__v">${fmtGame(v)}</span>
                    </li>`;
                  })
                  .join('')}
              </ol>
              <p class="flag-col__sub">${esc(t('potions.subtotal'))}
                <strong title="${esc(fmtFull(sub))}">${fmtGame(sub)}</strong></p>
            </section>`;
          })
          .join('')}
      </div>

      ${tier.cyclops ? `<p class="note note--cyclops">${esc(t('potions.cyclopsNote'))}</p>` : ''}

      <p class="potion-total">${esc(t('potions.total', { bet: tier.bet }))}
        <strong>${fmtGame(tier.flags.flat().reduce((a, b) => a + b, 0))}</strong>
        <small>(${fmtFull(tier.flags.flat().reduce((a, b) => a + b, 0))})</small></p>
    </div>

    <figure class="bars">
      <figcaption>${esc(t('potions.compare'))}</figcaption>
      ${tiers
        .map((x, i) => {
          const subs = x.flags.map((c) => c.reduce((a, b) => a + b, 0));
          const tot = subs.reduce((a, b) => a + b, 0);
          return `<div class="bar${i === idx ? ' bar--active' : ''}">
            <span class="bar__label">🔋 ${x.bet}</span>
            <span class="bar__track" style="--w:${((tot / max) * 100).toFixed(2)}%">
              ${subs.map((s, f) => `<span class="bar__seg bar__seg--${f}" style="flex:${s}" title="${flagLabels[f]}: ${fmtFull(s)}"></span>`).join('')}
            </span>
            <span class="bar__value">${fmtGame(tot)}</span>
          </div>`;
        })
        .join('')}
      <p class="legend">${flagLabels.map((l, f) => `<span><i class="bar__seg--${f}"></i>${l}</span>`).join('')}</p>
    </figure>`;
}

/* ---------- 語言選單 ---------- */

function renderLangMenu() {
  const menu = $('#lang-menu');
  menu.innerHTML = LANGUAGES.map(
    (l) => `<li><button type="button" lang="${l.code}" data-lang="${l.code}"
      aria-current="${l.code === getLanguage()}">${esc(l.label)}</button></li>`,
  ).join('');
  $('#lang-current').textContent = LANGUAGES.find((l) => l.code === getLanguage())?.label ?? '';
}

/* ---------- 主繪製 ---------- */

function renderAll() {
  renderLangMenu();
  $('#monsters-version').textContent = t('monsters.version', { date: MONSTERS_VERSION });
  renderGates();
  renderMonsters();
  renderPotions('zone4');
  renderPotions('zone5');
  $('#year').textContent = new Date().getFullYear();
}

async function changeLanguage(code) {
  const run = async () => { if (await setLanguage(code)) renderAll(); };
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    await document.startViewTransition(run).finished;
  } else {
    await run();
  }
}

/* ---------- 事件（事件委派） ---------- */

document.addEventListener('click', (e) => {
  const langBtn = e.target.closest('[data-lang]');
  if (langBtn) {
    $('#lang-popover').hidePopover?.();
    changeLanguage(langBtn.dataset.lang);
    return;
  }
  const chip = e.target.closest('.chip[data-zone]');
  if (chip) {
    monsterZone = chip.dataset.zone === 'all' ? 'all' : Number(chip.dataset.zone);
    renderMonsters();
    $(`.chip[data-zone="${chip.dataset.zone}"]`)?.focus();
    return;
  }
  const tab = e.target.closest('.tab[data-zone]');
  if (tab) selectTab(tab.dataset.zone, Number(tab.dataset.idx));
});

function selectTab(zone, idx) {
  potionState[zone] = idx;
  renderPotions(zone);
  $(`#${zone}-tab-${idx}`)?.focus();
}

// 分頁鍵盤操作（WAI-ARIA Tabs pattern）
document.addEventListener('keydown', (e) => {
  const tab = e.target.closest?.('.tab[data-zone]');
  if (!tab) return;
  const zone = tab.dataset.zone;
  const n = POTIONS[zone].length;
  const i = Number(tab.dataset.idx);
  const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
  if (next !== undefined) { e.preventDefault(); selectTab(zone, next); }
});

document.addEventListener('input', (e) => {
  const input = e.target.closest('.budget input');
  if (!input) return;
  const zone = input.dataset.zone;
  budget[zone] = input.value;
  const pos = input.selectionStart;
  renderPotions(zone);
  const again = $(`#${zone}-budget`);
  again.focus();
  again.setSelectionRange(pos, pos);
});

/* ---------- 主題切換 ---------- */

const THEME_KEY = 'magicland.theme';
function applyTheme(theme) {
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}
try { applyTheme(localStorage.getItem(THEME_KEY)); } catch { /* ignore */ }

$('#theme-toggle').addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = isDark ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
});

/* ---------- 啟動 ---------- */

await setLanguage(detectLanguage());
renderAll();
document.documentElement.classList.add('is-ready');
