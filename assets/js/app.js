// 魔法王國資訊站 — 主程式（原生 ES Modules，無需建置）
import { GATES, MONSTERS, POTIONS, LANGUAGES } from './data.js';
import { t, detectLanguage, setLanguage, getLanguage } from './i18n.js';
import { injectSprite, icon } from './icons.js';

const $ = (sel, root = document) => root.querySelector(sel);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

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
  let text = t(`items.${id}`);
  if (amount != null) text += ` ${fmtGame(amount)}`;
  if (note) text += ` (${note})`;
  return `<li class="item">
    ${icon(`i-${id}`, 'ico item__icon')}
    <span class="item__name">${esc(text)}</span>
    ${qty ? `<span class="item__qty">×${qty}</span>` : ''}
    ${isNew ? `<span class="tag tag--new">${esc(t('common.new'))}</span>` : ''}
  </li>`;
}
const itemList = (items) => `<ul class="items" role="list">${items.map(itemHtml).join('')}</ul>`;

/* ---------- 藥水需求（第四區、第五區） ---------- */

const potionState = { zone4: 0, zone5: 0 };
const FLAG_LABELS = ['0/3', '1/3', '2/3'];
const flagLabel = (f) => `${icon('i-flag', 'ico ico--sm')} ${FLAG_LABELS[f]}`;

function renderPotions(zone) {
  const tiers = POTIONS[zone];
  const idx = potionState[zone];
  const tier = tiers[idx];
  const total = sum(tier.flags.flat());

  $(`#${zone}-body`).innerHTML = `
    <div class="tabs" role="tablist" aria-label="${esc(t('potions.bet'))}">
      ${tiers
        .map(
          (x, i) => `<button type="button" role="tab" class="tab" id="${zone}-tab-${i}"
            aria-selected="${i === idx}" aria-controls="${zone}-panel" tabindex="${i === idx ? 0 : -1}"
            data-zone="${zone}" data-idx="${i}">${icon('i-energy', 'ico ico--sm')} ${x.bet}</button>`,
        )
        .join('')}
    </div>

    <div class="potion-panel card" role="tabpanel" id="${zone}-panel" aria-labelledby="${zone}-tab-${idx}">
      <div class="flag-grid">
        ${tier.flags
          .map((col, f) => `<section class="flag-col" aria-label="${FLAG_LABELS[f]}">
              <h3 class="flag-col__title">${flagLabel(f)}</h3>
              <ol class="cells" role="list">
                ${col
                  .map((v, i) => {
                    const cyc = tier.cyclops && tier.cyclops.flag === f && i >= tier.cyclops.from;
                    return `<li class="cell${cyc ? ' cell--cyclops' : ''}"
                      title="${esc(fmtFull(v))}${cyc ? ` — ${esc(t('monsters.names.cyclops'))}` : ''}">
                      <span class="cell__i">${i + 1}</span><span class="cell__v">${fmtGame(v)}</span>
                    </li>`;
                  })
                  .join('')}
              </ol>
              <p class="flag-col__sub">${esc(t('potions.subtotal'))}
                <strong title="${esc(fmtFull(sum(col)))}">${fmtGame(sum(col))}</strong></p>
            </section>`)
          .join('')}
      </div>

      ${tier.cyclops ? `<p class="note note--cyclops">${icon('m-cyclops', 'ico')} ${esc(t('potions.cyclopsNote'))}</p>` : ''}

      <p class="potion-total">${esc(t('potions.total', { bet: tier.bet }))}
        <strong>${fmtGame(total)}</strong>
        <small>(${fmtFull(total)})</small></p>
    </div>`;
}

/* ---------- 大門與鑰匙 ---------- */

function renderGates() {
  const col = (kind) => {
    const keyIcon = kind === 'bronze' ? 'i-rustyKey' : 'i-goldKey';
    return `<article class="gate-col gate-col--${kind}">
      <h3 class="gate-col__title">${icon(keyIcon)} ${esc(t(`gates.${kind}`))}</h3>
      <ol class="gate-list" role="list">
        ${GATES[kind]
          .map(
            (g) => `<li class="gate card">
              <header class="gate__head">
                <span class="gate__no">${g.no}</span>
                <span class="gate__island">${esc(t('common.island', { n: g.island }))}</span>
              </header>
              <div class="gate__body">
                ${icon(`g-${g.scene}`, 'gate__art')}
                ${itemList(g.rewards)}
              </div>
              <p class="gate__cost">${esc(t('gates.cost'))}
                <strong>${g.cost}</strong> ${esc(t(`gates.${kind}Unit`))} ${icon(keyIcon, 'ico ico--sm')}</p>
            </li>`,
          )
          .join('')}
      </ol>
    </article>`;
  };
  const keys = (kind) => sum(GATES[kind].map((g) => g.cost));
  $('#gates-body').innerHTML = `
    <div class="gate-grid">${col('bronze')}${col('gold')}</div>
    <p class="note">${esc(t('gates.totalNote', { bronze: keys('bronze'), gold: keys('gold') }))}</p>`;
}

/* ---------- 怪物 ---------- */

let monsterZone = 'all';

function renderMonsters() {
  const zones = ['all', 2, 3, 4, 5];
  const list = MONSTERS.filter((m) => monsterZone === 'all' || m.zone === monsterZone);
  const grandTotal = sum(list.map((m) => m.total));

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
    <div class="monster-grid">${list.map(monsterCard).join('')}</div>`;
}

function monsterCard(m) {
  const name = t(`monsters.names.${m.name}`);
  const badges = [
    m.priority && `<span class="tag tag--priority">${esc(t('monsters.priority'))}</span>`,
    m.mustPass && `<span class="tag tag--must">${esc(t('monsters.mustPass'))}</span>`,
  ].filter(Boolean).join('');
  const final = m.finalKey ? `<p>${esc(t(m.finalKey))}</p>` : itemList(m.final);

  return `<article class="monster card" data-zone="${m.zone}">
    <header class="monster__head">
      <div class="monster__avatar">
        ${icon(`m-${m.name}`, 'monster__art')}
        <span class="monster__no">${m.no}</span>
      </div>
      <div>
        <h3 class="monster__name">${esc(name)}</h3>
        <p class="monster__zone">${esc(t('common.zone', { n: m.zone }))}</p>
      </div>
      <div class="monster__badges">${badges}</div>
    </header>
    <div class="table-wrap">
      <table class="stage-table">
        <caption class="visually-hidden">${esc(name)} #${m.no}</caption>
        <thead><tr>
          <th scope="col">${esc(t('monsters.hp'))}</th>
          <th scope="col">${esc(t('monsters.reward'))}</th>
          <th scope="col">${esc(t('monsters.cost'))}</th>
        </tr></thead>
        <tbody>
          ${m.stages
            .map(
              (s) => `<tr>
                <td>${fmtFull(s.hp)}</td>
                <td>${itemList(s.reward)}</td>
                <td><span title="${esc(fmtFull(s.cost))}">${fmtGame(s.cost)}</span></td>
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
      <span>${icon('i-energy', 'ico')} ${esc(t('monsters.total'))}</span>
      <strong title="${esc(fmtFull(m.total))}">${fmtGame(m.total)}</strong>
    </footer>
  </article>`;
}

/* ---------- 語言選單 ---------- */

function renderLangMenu() {
  $('#lang-menu').innerHTML = LANGUAGES.map(
    (l) => `<li><button type="button" lang="${l.code}" data-lang="${l.code}"
      aria-current="${l.code === getLanguage()}">${esc(l.label)}</button></li>`,
  ).join('');
  $('#lang-current').textContent = LANGUAGES.find((l) => l.code === getLanguage())?.label ?? '';
}

/* ---------- 主繪製 ---------- */

function renderAll() {
  renderLangMenu();
  renderPotions('zone4');
  renderPotions('zone5');
  renderGates();
  renderMonsters();
  $('#year').textContent = new Date().getFullYear();
}

async function changeLanguage(code) {
  const run = async () => { if (await setLanguage(code)) renderAll(); };
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // 快速連點時前一個 transition 會被中止；吞掉 ready 的 AbortError，只等 DOM 更新完成
    const vt = document.startViewTransition(run);
    vt.ready.catch(() => {});
    await vt.updateCallbackDone.catch(() => {});
  } else {
    await run();
  }
}

/* ---------- 事件（事件委派） ---------- */

function selectTab(zone, idx) {
  potionState[zone] = idx;
  renderPotions(zone);
  $(`#${zone}-tab-${idx}`)?.focus();
}

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

// 分頁鍵盤操作（WAI-ARIA Tabs pattern）
document.addEventListener('keydown', (e) => {
  const tab = e.target.closest?.('.tab[data-zone]');
  if (!tab) return;
  const n = POTIONS[tab.dataset.zone].length;
  const i = Number(tab.dataset.idx);
  const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
  if (next !== undefined) { e.preventDefault(); selectTab(tab.dataset.zone, next); }
});

/* ---------- 啟動 ---------- */

injectSprite();
await setLanguage(detectLanguage());
renderAll();
