// 魔法王國資料 — 所有數字皆來自社群整理的原始圖表 / PDF（見 CLAUDE.md「資料來源」）。
// 文字一律以 i18n key 表示，實際顯示文字在 /locales/*.json。

/** 道具圖示（emoji，與語言無關） */
export const ICONS = {
  energy: '🔋',
  bomb: '💣',
  cannon: '🎯',
  rustyKey: '🗝️',
  goldKey: '🔑',
  chest: '🎁',
  purpleChest: '🎁',
  lightningChest: '⚡',
  jesterChest: '🤡',
  blueCrownChest: '👑',
  redCrownChest: '👑',
  royalChest: '🏰',
  seasonChest: '🏆',
  thunderCoin: '🌩️',
  goldCard: '🟨',
  blueCard: '🟦',
  jokerCard: '🃏',
  bunnyCoin: '🐰',
  gems: '💎',
  frame: '🖼️',
  background: '🏝️',
  mystery: '❓',
};

/**
 * 道具：{ id, qty?, amount?, note?, isNew? }
 *  - qty    → 顯示「名稱 ×qty」
 *  - amount → 顯示「名稱 amount」（能量、兔子幣、寶石等數值型）
 *  - note   → 額外說明（原樣字串，例如 '×2'、'5–12'）
 */

/** 大門與鑰匙 */
export const GATES = {
  bronze: [
    { no: 1, island: 2, cost: 2, rewards: [{ id: 'chest', qty: 3 }, { id: 'frame', isNew: true }, { id: 'background', isNew: true }] },
    { no: 2, island: 3, cost: 5, rewards: [{ id: 'bomb', qty: 3, note: '×2' }, { id: 'cannon', qty: 3 }] },
    { no: 3, island: 4, cost: 15, rewards: [{ id: 'lightningChest', qty: 2 }, { id: 'energy', amount: 10_000, qty: 2 }, { id: 'goldKey', qty: 1 }] },
    { no: 4, island: 4, cost: 10, rewards: [{ id: 'bunnyCoin', amount: 600, qty: 2 }, { id: 'lightningChest', qty: 2 }, { id: 'purpleChest', qty: 1 }] },
  ],
  gold: [
    { no: 1, island: 2, cost: 3, rewards: [{ id: 'purpleChest', qty: 3 }, { id: 'thunderCoin', qty: 3 }] },
    { no: 2, island: 3, cost: 2, rewards: [{ id: 'redCrownChest', qty: 4 }, { id: 'jesterChest', qty: 1 }] },
    { no: 3, island: 4, cost: 5, rewards: [{ id: 'purpleChest', qty: 4 }, { id: 'energy', amount: 10_000 }] },
    { no: 4, island: 5, cost: 7, rewards: [{ id: 'bunnyCoin', amount: 400, qty: 2 }, { id: 'mystery', qty: 3 }] },
    { no: 5, island: 5, cost: 10, rewards: [{ id: 'lightningChest', qty: 5 }] },
  ],
};

/** 怪物（14 怪物版・兔子幣版本；不含第一區共 13 隻） */
export const MONSTERS_VERSION = '2026.08.04';

export const MONSTERS = [
  {
    zone: 2, no: 2, name: 'chief', total: 61_000,
    stages: [
      { hp: 6_000, reward: [{ id: 'energy', amount: 600 }], cost: 12_000 },
      { hp: 10_000, reward: [{ id: 'energy', amount: 1_000 }], cost: 22_000 },
      { hp: 15_000, reward: [{ id: 'jesterChest', qty: 1 }], cost: 27_000 },
    ],
    final: [{ id: 'gems', amount: 100 }, { id: 'chest', qty: 3 }],
  },
  {
    zone: 3, no: 3, name: 'maskPriest', priority: true, total: 175_000,
    stages: [
      { hp: 16_000, reward: [{ id: 'bomb', qty: 1 }], cost: 31_000 },
      { hp: 28_000, reward: [{ id: 'bomb', qty: 2 }], cost: 58_000 },
      { hp: 36_000, reward: [{ id: 'rustyKey', qty: 1 }], cost: 86_000 },
    ],
    final: [{ id: 'bomb', qty: 3 }, { id: 'rustyKey', qty: 2 }],
  },
  {
    zone: 3, no: 4, name: 'maskPriest', total: 609_000,
    stages: [
      { hp: 60_000, reward: [{ id: 'blueCrownChest', qty: 1 }], cost: 121_000 },
      { hp: 95_000, reward: [{ id: 'thunderCoin', qty: 1 }], cost: 182_000 },
      { hp: 140_000, reward: [{ id: 'thunderCoin', qty: 3 }], cost: 306_000 },
    ],
    final: [{ id: 'thunderCoin', qty: 2 }, { id: 'bomb', qty: 2 }],
  },
  {
    zone: 3, no: 5, name: 'maskPriest', total: 200_000,
    stages: [
      { hp: 15_000, reward: [{ id: 'goldCard', qty: 1 }], cost: 30_000 },
      { hp: 30_000, reward: [{ id: 'blueCard', qty: 1 }], cost: 59_000 },
      { hp: 55_000, reward: [{ id: 'jokerCard', qty: 1 }], cost: 111_000 },
    ],
    final: [{ id: 'seasonChest', qty: 2 }, { id: 'jokerCard', qty: 1 }],
  },
  {
    zone: 4, no: 6, name: 'vineChucky', total: 653_000,
    stages: [
      { hp: 70_000, reward: [{ id: 'bomb', qty: 1 }], cost: 136_000 },
      { hp: 100_000, reward: [{ id: 'bomb', qty: 2 }], cost: 227_000 },
      { hp: 155_000, reward: [{ id: 'goldKey', qty: 1 }], cost: 290_000 },
    ],
    final: [{ id: 'bomb', qty: 2 }, { id: 'goldKey', qty: 2 }],
  },
  {
    zone: 4, no: 7, name: 'vineChucky', total: 1_610_000,
    stages: [
      { hp: 150_000, reward: [{ id: 'redCrownChest', qty: 1 }], cost: 322_000 },
      { hp: 250_000, reward: [{ id: 'energy', amount: 20_000 }], cost: 508_000 },
      { hp: 365_000, reward: [{ id: 'energy', amount: 25_000 }], cost: 780_000 },
    ],
    final: [{ id: 'jesterChest', qty: 2 }, { id: 'jokerCard', qty: 1 }, { id: 'royalChest', qty: 1 }],
  },
  {
    zone: 4, no: 8, name: 'vineChucky', priority: true, total: 597_000,
    stages: [
      { hp: 60_000, reward: [{ id: 'bomb', qty: 1 }], cost: 128_000 },
      { hp: 95_000, reward: [{ id: 'bomb', qty: 2 }], cost: 185_000 },
      { hp: 140_000, reward: [{ id: 'cannon', qty: 1 }], cost: 284_000 },
    ],
    final: [{ id: 'bomb', qty: 14 }, { id: 'cannon', qty: 2 }],
  },
  {
    zone: 5, no: 10, name: 'lavaMonster', total: 1_100_000,
    stages: [
      { hp: 110_000, reward: [{ id: 'blueCard', qty: 1 }], cost: 200_000 },
      { hp: 185_000, reward: [{ id: 'energy', amount: 10_000 }], cost: 383_000 },
      { hp: 250_000, reward: [{ id: 'energy', amount: 25_000 }], cost: 520_000 },
    ],
    final: [{ id: 'blueCard', qty: 1 }, { id: 'seasonChest', qty: 1 }, { id: 'energy', amount: 5_000, qty: 2 }],
  },
  {
    zone: 5, no: 11, name: 'lavaMonster', total: 1_400_000,
    stages: [
      { hp: 140_000, reward: [{ id: 'redCrownChest', qty: 1 }], cost: 280_000 },
      { hp: 225_000, reward: [{ id: 'goldKey', qty: 1 }], cost: 500_000 },
      { hp: 325_000, reward: [{ id: 'energy', amount: 25_000 }], cost: 660_000 },
    ],
    final: [{ id: 'goldKey', qty: 1 }, { id: 'redCrownChest', qty: 1 }, { id: 'bunnyCoin', amount: 250, qty: 2 }],
  },
  {
    zone: 5, no: 9, name: 'lavaMonster', total: 1_890_000,
    stages: [
      { hp: 180_000, reward: [{ id: 'goldKey', qty: 1 }], cost: 370_000 },
      { hp: 300_000, reward: [{ id: 'energy', amount: 15_000 }], cost: 630_000 },
      { hp: 420_000, reward: [{ id: 'energy', amount: 25_000 }], cost: 890_000 },
    ],
    final: [{ id: 'goldKey', qty: 2 }, { id: 'bunnyCoin', amount: 800, qty: 2 }],
  },
  {
    zone: 5, no: 12, name: 'lavaMonster', total: 3_210_000,
    stages: [
      { hp: 295_000, reward: [{ id: 'energy', amount: 15_000 }], cost: 540_000 },
      { hp: 515_000, reward: [{ id: 'energy', amount: 25_000 }], cost: 1_210_000 },
      { hp: 665_000, reward: [{ id: 'energy', amount: 35_000 }], cost: 1_460_000 },
    ],
    final: [{ id: 'bunnyCoin', amount: 600, qty: 3 }, { id: 'bunnyCoin', amount: 800, qty: 3 }],
  },
  {
    zone: 5, no: 13, name: 'lavaMonster', total: 4_110_000,
    stages: [
      { hp: 400_000, reward: [{ id: 'energy', amount: 30_000 }], cost: 900_000 },
      { hp: 675_000, reward: [{ id: 'energy', amount: 45_000 }], cost: 1_390_000 },
      { hp: 875_000, reward: [{ id: 'energy', amount: 65_000 }], cost: 1_820_000 },
    ],
    final: [{ id: 'lightningChest', note: '5–12' }, { id: 'bunnyCoin', amount: 600, qty: 3 }, { id: 'bunnyCoin', amount: 1_000, qty: 2 }],
  },
  {
    zone: 5, no: 14, name: 'cyclops', total: 1_230_000, mustPass: true,
    stages: [
      { hp: 125_000, reward: [{ id: 'bomb', qty: 2 }], cost: 250_000 },
      { hp: 185_000, reward: [{ id: 'bomb', qty: 3 }], cost: 414_000 },
      { hp: 280_000, reward: [{ id: 'cannon', qty: 1 }], cost: 567_000 },
    ],
    finalKey: 'monsters.cyclopsFinal',
  },
];

/**
 * 只走紅旗的藥水需求（一般版）。
 * flags[0..2] 分別為 🚩0/3、🚩1/3、🚩2/3 階段，每個數字是一格需要的藥水。
 * 已用腳本驗證：各欄加總 = PDF 上的「小計」，各下注加總 = 「總計」。
 */
export const POTIONS = {
  zone4: [
    { bet: '10K', flags: [[2000, 3000, 3000, 6000, 4000, 7000, 5000], [8000, 10000, 6000, 13000, 8000, 16000, 12000, 15000], [17000, 20000, 25000, 45000, 35000, 60000, 65000]] },
    { bet: '20K', flags: [[8000, 9500, 10000, 12000, 9000, 13000], [11000, 12000, 10000, 12000, 14000, 13000, 20000, 13000, 20000], [12000, 12000, 18000, 30000, 20000, 45000, 20000, 45000, 55000, 30000, 40000, 60000, 40000, 65000, 90000, 120000]] },
    { bet: '35K', flags: [[10000, 15000, 11000, 16000, 12000, 20000, 22000], [18000, 17000, 18000, 25000, 18000, 20000, 37000], [30000, 32000, 25000, 50000, 32000, 37000, 70000, 55000, 70000, 85000, 100000, 60000, 82000, 110000, 95000, 130000, 100000, 150000]] },
    { bet: '70K', flags: [[12000, 15000, 12000, 25000, 36000], [15000, 40000, 50000, 70000, 48000, 70000, 44000, 70000, 60000], [55000, 90000, 80000, 70000, 90000, 100000, 77000, 110000, 85000, 120000, 100000, 90000, 200000]] },
  ],
  zone5: [
    { bet: '40K', flags: [[40000, 55000], [52000, 45000, 54000, 37000, 43000, 50000, 67000, 88000, 88000], [75000, 70000, 80000, 100000, 120000, 100000, 125000]] },
    { bet: '65K', flags: [[75000, 90000, 120000, 30000, 32000, 34000, 36000, 50000, 50000, 55000, 70000, 90000, 100000], [45000, 55000, 65000, 85000, 70000, 80000, 100000, 130000, 180000, 200000], [150000, 130000, 180000, 240000, 240000]] },
    { bet: '100K', flags: [[180000, 50000, 60000, 85000, 110000, 90000, 120000, 140000], [75000, 100000, 80000, 100000, 130000, 150000, 70000, 120000, 150000], [80000, 85000, 95000, 100000, 150000, 180000, 230000, 175000, 200000, 300000]] },
    // 300K 🚩2/3 最後三格（250K / 414K / 567K）是獨眼怪（10 倍直走測試）
    { bet: '300K', flags: [[100000, 190000, 130000, 160000, 200000, 150000, 180000, 220000, 250000], [250000, 300000, 160000, 200000, 260000, 260000, 330000, 400000, 400000, 650000, 650000], [450000, 550000, 600000, 550000, 650000, 700000, 250000, 414000, 567000]], cyclops: { flag: 2, from: 6 } },
  ],
};

export const LANGUAGES = [
  { code: 'zh-TW', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ไทย' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];
