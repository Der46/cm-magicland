// SVG 圖示 sprite（原創向量繪製，非遊戲素材）。
// 道具：<use href="#i-{id}">；怪物：<use href="#m-{name}">。
// 寶箱等共用造型透過 CSS 自訂屬性（--c1 / --c2）在 <use> 內換色。

const chestBase = `
  <symbol id="chest-base" viewBox="0 0 32 32">
    <path d="M4 14q0-8 12-8t12 8z" fill="var(--c1)" stroke="#2b1606" stroke-width="1.2"/>
    <rect x="4" y="14" width="24" height="13" rx="2" fill="var(--c1)" stroke="#2b1606" stroke-width="1.2"/>
    <path d="M4 14h24" stroke="#2b1606" stroke-width="1.2"/>
    <rect x="9" y="6.6" width="3" height="20.4" fill="var(--c2)"/>
    <rect x="20" y="6.6" width="3" height="20.4" fill="var(--c2)"/>
    <rect x="13.5" y="12" width="5" height="6" rx="1" fill="var(--c2)" stroke="#2b1606" stroke-width="1"/>
    <circle cx="16" cy="15" r="1" fill="#2b1606"/>
    <path d="M6 9.5q4-2.5 9-2.8" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  </symbol>`;

const crown = (y = 0) => `<path transform="translate(0 ${y})" d="M9 6l2.5 3 4.5-5 4.5 5L23 6l-1 6H10z" fill="#ffd23f" stroke="#8a5a00" stroke-width="1"/>`;

const chest = (id, c1, c2, extra = '') => `
  <symbol id="i-${id}" viewBox="0 0 32 32">
    <use href="#chest-base" style="--c1:${c1};--c2:${c2}"/>${extra}
  </symbol>`;

const card = (id, c1, c2, inner) => `
  <symbol id="i-${id}" viewBox="0 0 32 32">
    <rect x="7" y="3" width="18" height="26" rx="3" fill="${c1}" stroke="${c2}" stroke-width="1.6" transform="rotate(8 16 16)"/>
    <rect x="9.5" y="6" width="13" height="20" rx="2" fill="none" stroke="#fff" stroke-opacity=".5" transform="rotate(8 16 16)"/>
    <g transform="rotate(8 16 16)">${inner}</g>
  </symbol>`;

const star = (cx, cy, r, fill) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
  return `<polygon points="${pts}" fill="${fill}"/>`;
};

const items = `
  <symbol id="i-energy" viewBox="0 0 32 32">
    <rect x="12" y="2.5" width="8" height="5" rx="1.2" fill="#a0612b"/>
    <path d="M12.5 7.5h7v4.5l7 8.5a7 7 0 0 1-5.5 10h-10a7 7 0 0 1-5.5-10l7-8.5z" fill="#d9f2ff" fill-opacity=".35" stroke="#bfe6ff" stroke-width="1.2"/>
    <path d="M7.2 20.5h17.6a7 7 0 0 1-3.8 9.5h-10a7 7 0 0 1-3.8-9.5z" fill="#3b82f6"/>
    <path d="M17 14l-4 7h3l-1 5 4.5-7h-3z" fill="#ffe14d"/>
  </symbol>

  <symbol id="i-bomb" viewBox="0 0 32 32">
    <circle cx="14" cy="19" r="10" fill="#1f2937" stroke="#000" stroke-width="1"/>
    <circle cx="10.5" cy="15.5" r="3" fill="#fff" fill-opacity=".25"/>
    <rect x="17.5" y="6.5" width="6" height="5" rx="1" transform="rotate(40 20.5 9)" fill="#6b7280"/>
    <path d="M23 6q2-3 4-2" stroke="#a16207" stroke-width="1.6" fill="none"/>
    ${star(27.5, 4, 3.2, '#fbbf24')}
  </symbol>

  <symbol id="i-cannon" viewBox="0 0 32 32">
    <rect x="5" y="9" width="21" height="9" rx="4.5" transform="rotate(-20 15 13)" fill="#475569" stroke="#0f172a" stroke-width="1"/>
    <ellipse cx="25.5" cy="9" rx="2.2" ry="4" transform="rotate(-20 25.5 9)" fill="#0f172a"/>
    <path d="M6 22h14l2 6H4z" fill="#92400e" stroke="#451a03" stroke-width="1"/>
    <circle cx="10" cy="25" r="4" fill="#b45309" stroke="#451a03" stroke-width="1.2"/>
    <circle cx="10" cy="25" r="1.2" fill="#451a03"/>
  </symbol>

  <symbol id="i-rustyKey" viewBox="0 0 32 32">
    <circle cx="10" cy="10" r="6.5" fill="none" stroke="#b86b3a" stroke-width="3.2"/>
    <path d="M14.5 14.5L27 27M21 21l3-3M24.5 24.5l3-3" stroke="#b86b3a" stroke-width="3.2" stroke-linecap="round"/>
    <circle cx="10" cy="10" r="2.2" fill="#e8a46f"/>
  </symbol>

  <symbol id="i-goldKey" viewBox="0 0 32 32">
    <circle cx="10" cy="10" r="6.5" fill="none" stroke="#e0a800" stroke-width="3.2"/>
    <path d="M14.5 14.5L27 27M21 21l3-3M24.5 24.5l3-3" stroke="#e0a800" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M10 6l3 4-3 4-3-4z" fill="#ec4899" stroke="#fff" stroke-width=".6"/>
  </symbol>

  ${chest('chest', '#9a5b2b', '#f2c14e')}
  ${chest('purpleChest', '#7c3aed', '#f2c14e')}
  ${chest('lightningChest', '#2563eb', '#cbd5e1', `<path d="M17 13l-3 5h2.5l-1 4 3.5-5.5H16.5z" fill="#ffe14d"/>`)}
  ${chest('jesterChest', '#dc2626', '#facc15', `<path d="M8 6l3 4 5-6 5 6 3-4-1 6H9z" fill="#22c55e" stroke="#14532d" stroke-width=".8"/><circle cx="8" cy="5.5" r="1.4" fill="#facc15"/><circle cx="16" cy="3.5" r="1.4" fill="#facc15"/><circle cx="24" cy="5.5" r="1.4" fill="#facc15"/>`)}
  ${chest('blueCrownChest', '#1d4ed8', '#f2c14e', crown(-1))}
  ${chest('redCrownChest', '#be123c', '#f2c14e', crown(-1))}
  ${chest('royalChest', '#6d28d9', '#fbbf24', crown(-1) + `<circle cx="16" cy="22.5" r="1.6" fill="#ec4899"/>`)}
  ${chest('seasonChest', '#0f766e', '#fde68a', star(16, 22.5, 3, '#fde68a'))}

  <symbol id="i-thunderCoin" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="13" fill="#7e22ce" stroke="#facc15" stroke-width="2.5"/>
    <circle cx="16" cy="16" r="9.5" fill="#a855f7"/>
    <path d="M17.5 7l-6 10h4.5l-1.5 8 6.5-10.5H16.5z" fill="#fff"/>
  </symbol>

  ${card('goldCard', '#f5b81c', '#8a5a00', star(16, 16, 6, '#fff7d6'))}
  ${card('blueCard', '#3b82f6', '#1e3a8a', star(16, 16, 6, '#dbeafe'))}
  ${card('jokerCard', '#f8fafc', '#7c3aed', `<path d="M10 13l2.5 3 3.5-6 3.5 6 2.5-3-1 7h-10z" fill="#ec4899"/><circle cx="10" cy="12.5" r="1.3" fill="#22c55e"/><circle cx="16" cy="9.5" r="1.3" fill="#3b82f6"/><circle cx="22" cy="12.5" r="1.3" fill="#f59e0b"/>`)}

  <symbol id="i-bunnyCoin" viewBox="0 0 32 32">
    <circle cx="16" cy="17" r="13" fill="#f5b81c" stroke="#a16207" stroke-width="1.6"/>
    <circle cx="16" cy="17" r="10" fill="#fcd34d"/>
    <ellipse cx="13" cy="11" rx="2" ry="5" fill="#fff"/>
    <ellipse cx="19" cy="11" rx="2" ry="5" fill="#fff"/>
    <circle cx="16" cy="19" r="5.5" fill="#fff"/>
    <circle cx="14" cy="18.5" r=".9" fill="#1f2937"/><circle cx="18" cy="18.5" r=".9" fill="#1f2937"/>
    <ellipse cx="16" cy="21" rx="1" ry=".7" fill="#f472b6"/>
  </symbol>

  <symbol id="i-gems" viewBox="0 0 32 32">
    <path d="M9 5h14l6 8-13 15L3 13z" fill="#ec4899" stroke="#831843" stroke-width="1"/>
    <path d="M3 13h26M9 5l4 8 3 15M23 5l-4 8-3 15M13 13l3-8 3 8" stroke="#fbcfe8" stroke-width=".9" fill="none"/>
  </symbol>

  ${card('diamondCard', '#1e3a8a', '#93c5fd', `<path d="M11 13h10l3 4-8 9-8-9z" fill="#67e8f9" stroke="#e0f2fe" stroke-width=".8"/><path d="M8 17h16M13 13l3 13 3-13" stroke="#0e7490" stroke-width=".7" fill="none"/>`)}
  ${card('seasonCard', '#0369a1', '#7dd3fc', `<ellipse cx="16" cy="23" rx="6" ry="2" fill="#fde68a"/><path d="M16 22q-1-6 1-9" stroke="#92400e" stroke-width="1.4" fill="none"/><path d="M17 13q-4-3-7 1 4-1 7-1zM17 13q4-3 7 0-4-1-7 0zM17 13q-2-4-5-4 3 2 5 4zM17 13q3-4 6-3-3 1-6 3z" fill="#22c55e"/>`)}

  <!-- 網站 Logo：魔法城堡 -->
  <symbol id="i-castle" viewBox="0 0 32 32">
    <rect x="1" y="1" width="30" height="30" rx="7" fill="#0f3d3a"/>
    <circle cx="24" cy="8" r="2.2" fill="#fde68a"/>
    <path d="M1 25q15-4 30 0v-0 1a5 5 0 0 1-5 5H6a5 5 0 0 1-5-5z" fill="#166534"/>
    <rect x="9" y="14" width="14" height="12" fill="#cbd5e1" stroke="#334155" stroke-width=".8"/>
    <path d="M9 14v-2h2v2h2.5v-2h2v2h2.5v-2h2v2h1" fill="none" stroke="#334155" stroke-width=".8"/>
    <rect x="9" y="12" width="2" height="2" fill="#cbd5e1"/><rect x="13.5" y="12" width="2" height="2" fill="#cbd5e1"/><rect x="18" y="12" width="2" height="2" fill="#cbd5e1"/>
    <rect x="4.5" y="11" width="5" height="15" fill="#e2e8f0" stroke="#334155" stroke-width=".8"/>
    <rect x="22.5" y="11" width="5" height="15" fill="#e2e8f0" stroke="#334155" stroke-width=".8"/>
    <path d="M3.8 11.2L7 5l3.2 6.2zM21.8 11.2L25 5l3.2 6.2z" fill="#7c3aed" stroke="#3b0764" stroke-width=".8" stroke-linejoin="round"/>
    <rect x="13" y="7" width="6" height="7" fill="#e2e8f0" stroke="#334155" stroke-width=".8"/>
    <path d="M12.2 7.2L16 1.8l3.8 5.4z" fill="#7c3aed" stroke="#3b0764" stroke-width=".8" stroke-linejoin="round"/>
    <path d="M16 2V.6l2.6.8L16 2.2z" fill="#f5b81c"/>
    <path d="M7 5V3.4l2 .7L7 4.8zM25 5V3.4l2 .7-2 .7z" fill="#f5b81c"/>
    <path d="M13.5 26v-4a2.5 2.5 0 0 1 5 0v4z" fill="#78350f" stroke="#334155" stroke-width=".8"/>
    <rect x="15.2" y="9" width="1.6" height="2.4" rx=".8" fill="#f5b81c"/>
    <rect x="6.2" y="15" width="1.6" height="2.4" rx=".8" fill="#f5b81c"/><rect x="24.2" y="15" width="1.6" height="2.4" rx=".8" fill="#f5b81c"/>
  </symbol>

  <symbol id="i-mystery" viewBox="0 0 32 32">
    <defs><linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f472b6"/><stop offset=".35" stop-color="#facc15"/>
      <stop offset=".7" stop-color="#4ade80"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs>
    <path d="M10 11a6 6 0 1 1 9 5c-2 1.2-3 2.3-3 4.5" stroke="url(#rainbow)" stroke-width="4.2" fill="none" stroke-linecap="round"/>
    <circle cx="16" cy="26.5" r="2.4" fill="#60a5fa"/>
  </symbol>

  <symbol id="i-flag" viewBox="0 0 32 32">
    <path d="M8 3v26" stroke="#78350f" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M9 4h16l-4 6 4 6H9z" fill="#ef4444" stroke="#7f1d1d" stroke-width="1"/>
  </symbol>`;

/* ---------- 怪物（64×64，原創 Q 版造型） ---------- */
const monsters = `
  <!-- 部落酋長：金色面具頭盔、紅羽毛、權杖 -->
  <symbol id="m-chief" viewBox="0 0 64 64">
    <path d="M50 10v46" stroke="#a16207" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="9" r="5" fill="#facc15" stroke="#854d0e" stroke-width="1.2"/>
    <path d="M14 58q0-20 18-20t18 20z" fill="#b45309" stroke="#431407" stroke-width="1.5"/>
    <path d="M22 48h20l-2 10H24z" fill="#65a30d"/>
    <path d="M18 32q0-20 14-20t14 20q0 8-14 8t-14-8z" fill="#facc15" stroke="#854d0e" stroke-width="1.6"/>
    <path d="M22 18q10-6 20 0" stroke="#ef4444" stroke-width="3" fill="none"/>
    <path d="M32 12q-2-8 3-10 1 6-3 10z" fill="#ef4444"/>
    <path d="M23 26h7v4h-7zM34 26h7v4h-7z" fill="#1f2937"/>
    <circle cx="26.5" cy="28" r="1.3" fill="#fde047"/><circle cx="37.5" cy="28" r="1.3" fill="#fde047"/>
    <rect x="25" y="33" width="14" height="4" rx="1" fill="#7c2d12"/>
    <path d="M27 33v4M30 33v4M33 33v4M36 33v4" stroke="#fef3c7" stroke-width="1"/>
  </symbol>

  <!-- 獵面祭司：紫色長袍、大金面具、葉子頭飾 -->
  <symbol id="m-maskPriest" viewBox="0 0 64 64">
    <path d="M12 60q2-26 20-26t20 26z" fill="#7e22ce" stroke="#3b0764" stroke-width="1.5"/>
    <path d="M26 40h12l-2 20h-8z" fill="#c026d3"/>
    <path d="M16 18q4-12 16-14 12 2 16 14" fill="#16a34a" stroke="#14532d" stroke-width="1.4"/>
    <path d="M14 20l-4-8 8 4zM50 20l4-8-8 4zM22 8l-2-7 6 5zM42 8l2-7-6 5z" fill="#22c55e"/>
    <ellipse cx="32" cy="24" rx="13" ry="15" fill="#f59e0b" stroke="#78350f" stroke-width="1.6"/>
    <path d="M23 20q4-3 7 0M34 20q4-3 7 0" stroke="#78350f" stroke-width="2" fill="none"/>
    <ellipse cx="26.5" cy="23" rx="2.6" ry="2" fill="#1f2937"/><ellipse cx="37.5" cy="23" rx="2.6" ry="2" fill="#1f2937"/>
    <circle cx="26.5" cy="23" r="1" fill="#facc15"/><circle cx="37.5" cy="23" r="1" fill="#facc15"/>
    <path d="M25 31q7 5 14 0q-2 6-7 6t-7-6z" fill="#7c2d12"/>
    <path d="M28 32v3M32 33v3M36 32v3" stroke="#fef3c7" stroke-width="1.2"/>
    <path d="M32 9v4" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>
  </symbol>

  <!-- 被綠的恰吉：綠色石像、藤蔓、紅眼 -->
  <symbol id="m-vineChucky" viewBox="0 0 64 64">
    <path d="M6 30l8-4 2 14-8 4zM58 30l-8-4-2 14 8 4z" fill="#3f6212" stroke="#1a2e05" stroke-width="1.2"/>
    <path d="M12 60V36q0-8 8-8h24q8 0 8 8v24z" fill="#4d7c0f" stroke="#1a2e05" stroke-width="1.6"/>
    <path d="M14 10h36l2 18H12z" fill="#65a30d" stroke="#1a2e05" stroke-width="1.6"/>
    <path d="M14 10l4-6h28l4 6" fill="#3f6212" stroke="#1a2e05" stroke-width="1.4"/>
    <path d="M20 17h9l-2 4h-7zM35 17h9v4h-7z" fill="#111827"/>
    <circle cx="24" cy="19" r="1.8" fill="#ef4444"/><circle cx="40" cy="19" r="1.8" fill="#ef4444"/>
    <rect x="22" y="23" width="20" height="9" rx="2" fill="#7f1d1d" stroke="#1a2e05" stroke-width="1.2"/>
    <path d="M24 23v4M28 23v4M32 23v4M36 23v4M40 23v4" stroke="#fef3c7" stroke-width="1.3"/>
    <path d="M10 14q6 6 2 14q-4 8 4 14M54 14q-6 6-2 14q4 8-4 14" stroke="#22c55e" stroke-width="2.4" fill="none"/>
    <circle cx="12" cy="24" r="2" fill="#4ade80"/><circle cx="52" cy="22" r="2" fill="#4ade80"/>
    <circle cx="16" cy="42" r="2" fill="#4ade80"/><circle cx="48" cy="40" r="2" fill="#4ade80"/>
  </symbol>

  <!-- 熔岩怪：暗色岩石身體、橘色裂紋、發光眼睛 -->
  <symbol id="m-lavaMonster" viewBox="0 0 64 64">
    <path d="M4 44q-2-10 8-14l4 18q-8 4-12-4zM60 44q2-10-8-14l-4 18q8 4 12-4z" fill="#3b1f1a" stroke="#120806" stroke-width="1.4"/>
    <path d="M12 58q-4-14 2-24 2-14 12-20 6-4 12 0 10 6 12 20 6 10 2 24z" fill="#4a2a22" stroke="#120806" stroke-width="1.8"/>
    <path d="M22 16l-4-8 8 4zM42 16l4-8-8 4z" fill="#3b1f1a" stroke="#120806" stroke-width="1"/>
    <path d="M18 38l6 4 4-6 6 5 5-4 6 3M24 50l4-4 6 4 4-3M26 22l3 4" stroke="#f97316" stroke-width="2" fill="none" stroke-linejoin="round"/>
    <path d="M22 26l7 2-1 3-6-1zM42 26l-7 2 1 3 6-1z" fill="#fde047"/>
    <circle cx="26" cy="29" r="5" fill="#f97316" fill-opacity=".25"/><circle cx="38" cy="29" r="5" fill="#f97316" fill-opacity=".25"/>
    <path d="M26 34q6 4 12 0" stroke="#fb923c" stroke-width="2" fill="none" stroke-linecap="round"/>
  </symbol>

  <!-- 獨眼怪：米色圓胖身體、單眼、角、大錘 -->
  <symbol id="m-cyclops" viewBox="0 0 64 64">
    <path d="M52 22v34" stroke="#78350f" stroke-width="3.2" stroke-linecap="round"/>
    <rect x="44" y="12" width="16" height="11" rx="2" fill="#64748b" stroke="#1e293b" stroke-width="1.4"/>
    <ellipse cx="30" cy="40" rx="20" ry="20" fill="#e7cfa0" stroke="#78350f" stroke-width="1.8"/>
    <path d="M14 48q16 8 32 0v8q-16 6-32 0z" fill="#92400e"/>
    <path d="M30 20l-3-10 6 1z" fill="#f5f5f4" stroke="#78350f" stroke-width="1"/>
    <circle cx="30" cy="33" r="9" fill="#fff" stroke="#78350f" stroke-width="1.6"/>
    <circle cx="31" cy="34" r="4.5" fill="#2563eb"/><circle cx="31" cy="34" r="2.2" fill="#0f172a"/>
    <circle cx="29.5" cy="32.5" r="1" fill="#fff"/>
    <path d="M22 24q8-5 16 0" stroke="#78350f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M22 45q8 5 16 0" stroke="#78350f" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M26 46l1.5 3 1.5-2.6M33 46l1.5 3 1.5-2.6" fill="#fff"/>
  </symbol>`;

/* ---------- 大門場景（80×64，原創） ---------- */
const gates = `
  <!-- 島嶼 2：石拱門、紅旗幟、火炬、綠色豬徽章 -->
  <symbol id="g-arch" viewBox="0 0 80 64">
    <rect width="80" height="64" rx="6" fill="#7dd3fc"/>
    <path d="M0 44q20-6 40-2t40-4v26H0z" fill="#65a30d"/>
    <path d="M6 40l6-10 6 10zM62 40l6-12 6 12z" fill="#15803d"/>
    <path d="M24 58V28q16-16 32 0v30z" fill="#bae6fd"/>
    <path d="M34 58l3-18h6l3 18z" fill="#fde68a"/>
    <path d="M38 34v6M38 34h5" stroke="#92400e" stroke-width="1.2"/>
    <rect x="10" y="18" width="14" height="40" rx="1.5" fill="#b45309" stroke="#451a03" stroke-width="1.2"/>
    <rect x="56" y="18" width="14" height="40" rx="1.5" fill="#b45309" stroke="#451a03" stroke-width="1.2"/>
    <path d="M17 22Q40-6 63 22" stroke="#d97706" stroke-width="9" fill="none"/>
    <path d="M17 22Q40-6 63 22" stroke="#451a03" stroke-width="1" fill="none" stroke-dasharray="3 4"/>
    <path d="M11.5 26h11v16l-5.5-4-5.5 4zM57.5 26h11v16l-5.5-4-5.5 4z" fill="#dc2626" stroke="#7f1d1d" stroke-width=".8"/>
    <circle cx="17" cy="32" r="2.6" fill="#fde68a"/><circle cx="63" cy="32" r="2.6" fill="#fde68a"/>
    <rect x="12" y="13" width="10" height="5" rx="1" fill="#78350f"/><rect x="58" y="13" width="10" height="5" rx="1" fill="#78350f"/>
    <path d="M17 14q-4-5 0-10 4 5 0 10zM63 14q-4-5 0-10 4 5 0 10z" fill="#f97316"/>
    <path d="M17 13q-2-3 0-5 2 2 0 5zM63 13q-2-3 0-5 2 2 0 5z" fill="#fde047"/>
    <circle cx="40" cy="8.5" r="6" fill="#22c55e" stroke="#14532d" stroke-width="1.2"/>
    <ellipse cx="40" cy="9.5" rx="3" ry="2" fill="#86efac"/>
    <circle cx="39" cy="9.5" r=".6" fill="#14532d"/><circle cx="41" cy="9.5" r=".6" fill="#14532d"/>
  </symbol>

  <!-- 島嶼 3、4：石雕瀑布門 -->
  <symbol id="g-waterfall" viewBox="0 0 80 64">
    <rect width="80" height="64" rx="6" fill="#14532d"/>
    <path d="M0 10q8-8 16 0t16-2 16 2 16-2 16 2v-10H0z" fill="#166534"/>
    <rect x="8" y="12" width="64" height="46" rx="4" fill="#78716c" stroke="#292524" stroke-width="1.4"/>
    <path d="M8 22h64M8 34h16M56 34h16M8 46h16M56 46h16" stroke="#57534e" stroke-width="1"/>
    <rect x="22" y="3" width="36" height="14" rx="3" fill="#a8a29e" stroke="#292524" stroke-width="1.2"/>
    <rect x="28" y="7" width="6" height="4" rx="1" fill="#292524"/><rect x="46" y="7" width="6" height="4" rx="1" fill="#292524"/>
    <rect x="35" y="12" width="10" height="3" rx="1" fill="#57534e"/>
    <circle cx="15" cy="28" r="4" fill="#a8a29e" stroke="#292524"/><circle cx="65" cy="28" r="4" fill="#a8a29e" stroke="#292524"/>
    <path d="M26 58V24q14-8 28 0v34z" fill="#0ea5e9" stroke="#292524" stroke-width="1.2"/>
    <path d="M31 26v28M36 24v32M41 24v32M46 25v30M50 26v28" stroke="#e0f2fe" stroke-width="1.4" stroke-dasharray="5 3"/>
    <ellipse cx="40" cy="58" rx="20" ry="4" fill="#38bdf8"/>
    <ellipse cx="40" cy="57" rx="14" ry="2" fill="#e0f2fe" fill-opacity=".7"/>
    <path d="M4 60q4-10 10-6M76 60q-4-10-10-6M6 20q4 4 2 10M74 20q-4 4-2 10" stroke="#22c55e" stroke-width="2.2" fill="none"/>
    <circle cx="10" cy="56" r="2" fill="#f472b6"/><circle cx="70" cy="56" r="2" fill="#facc15"/>
  </symbol>

  <!-- 島嶼 5：綠色石像巨臉、熔岩口 -->
  <symbol id="g-lava" viewBox="0 0 80 64">
    <rect width="80" height="64" rx="6" fill="#052e16"/>
    <path d="M0 18q10-6 14 4M80 18q-10-6-14 4M0 40q8-4 10 6M80 40q-8-4-10 6" stroke="#16a34a" stroke-width="3" fill="none"/>
    <rect x="12" y="4" width="56" height="56" rx="16" fill="#4d7c0f" stroke="#1a2e05" stroke-width="1.6"/>
    <path d="M18 12h44" stroke="#3f6212" stroke-width="3"/>
    <path d="M22 22l12 3M58 22l-12 3" stroke="#1a2e05" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="29" cy="29" rx="5" ry="3.5" fill="#1a2e05"/><ellipse cx="51" cy="29" rx="5" ry="3.5" fill="#1a2e05"/>
    <circle cx="29" cy="29" r="1.5" fill="#fbbf24"/><circle cx="51" cy="29" r="1.5" fill="#fbbf24"/>
    <path d="M36 32h8l-1 5h-6z" fill="#3f6212"/>
    <path d="M26 60V46q14-10 28 0v14z" fill="#ea580c" stroke="#1a2e05" stroke-width="1.4"/>
    <path d="M31 60V49q9-6 18 0v11z" fill="#fbbf24"/>
    <path d="M36 60V52q4-3 8 0v8z" fill="#fef3c7"/>
    <path d="M26 46l3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 2-3" stroke="#f5f5f4" stroke-width="1.4" fill="none"/>
    <path d="M14 52q-4 4-2 10M66 52q4 4 2 10" stroke="#22c55e" stroke-width="2" fill="none"/>
  </symbol>`;

/** 把 sprite 注入到 <body> 最前面（只執行一次） */
export function injectSprite() {
  if (document.getElementById('icon-sprite')) return;
  const holder = document.createElement('div');
  holder.innerHTML = `<svg id="icon-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;inline-size:0;block-size:0;overflow:hidden">${chestBase}${items}${monsters}${gates}</svg>`;
  document.body.prepend(holder.firstElementChild);
}

/** 產生 <svg><use></svg> */
export const icon = (id, cls = 'ico') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;
