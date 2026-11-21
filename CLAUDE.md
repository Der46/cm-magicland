# CLAUDE.md — 魔法王國資訊站

Coin Master「魔法王國（Magical Land）」活動的玩家攻略資訊網站。純靜態網站，部署在 GitHub Pages，**沒有建置步驟、沒有 npm 相依**。

## 專案結構

```
index.html            單頁入口（HTML 骨架 + data-i18n 標記）
assets/css/style.css  全部樣式（@layer 分層）
assets/js/app.js      主程式：繪製各區塊、事件委派、主題切換
assets/js/i18n.js     i18n：語言偵測、載入 JSON、t()、套用 data-i18n
assets/js/data.js     所有遊戲資料（大門、怪物、藥水、語言清單、道具圖示）
locales/*.json        9 種語言的翻譯字串
favicon.svg
.nojekyll             讓 GitHub Pages 跳過 Jekyll
```

## 本機預覽

ES Modules 與 `fetch()` 不能用 `file://` 開啟，請起一個靜態伺服器：

```bash
python -m http.server 8000
# 開 http://localhost:8000/?lang=en
```

## 必須維持的需求（不可移除）

1. **RWD**：手機（≥320px）到桌機都要正常；導覽列在 `width < 60rem` 時變第二列可水平捲動。
2. **9 種語言**：`zh-TW`（預設 / fallback）、`en`、`vi`、`ja`、`ko`、`th`、`id`、`es`、`pt`。語言清單在 `data.js` 的 `LANGUAGES`，選單顯示母語名稱。
3. **頁尾署名**：`© {year} 大佬群CSL製作`，`{year}` 由 `app.js` 以 `new Date().getFullYear()` 帶入（`#year`）。此文字**不翻譯**。
4. **浮水印**：標題 `h1` 旁的 `.watermark` 斜放緞帶（`rotate: -12deg`），文字固定為「大佬群CSL製作」，**不翻譯、不可刪除**。
5. **現代寫法**：原生 ES Modules（top-level await）、CSS `@layer`、原生巢狀、`light-dark()`、`color-mix()`、container queries、`:has()`、scroll-driven animation、Popover API + `@starting-style`、View Transitions API、邏輯屬性、media query range syntax。不要引入框架或打包工具。

## i18n 規則

- HTML 靜態文字：加 `data-i18n="section.key"`；屬性用 `data-i18n-attr="aria-label:key;title:key2"`。
- JS 動態文字：`t('section.key', { param })`，字串內用 `{param}` 佔位。
- **新增 key 時 9 個 locale 檔都要加**，key 結構必須完全一致（缺 key 會 fallback 到 zh-TW）。
- 語言決定順序：`?lang=` → `localStorage['magicland.lang']` → `navigator.languages` → `zh-TW`。切換語言會更新 `<html lang>` 與網址參數。
- 數字：完整數字用 `Intl.NumberFormat(目前語言)`；遊戲單位（K / M）用 `fmtGame()`，**無條件捨去**（1,267,000 → 1.26M），與原始表格一致。

## 資料規則（data.js）

- 道具一律用 id（`energy`、`bomb`、`goldKey`…），顯示名稱在 `locales/*.json` 的 `items`，圖示在 `ICONS`。新增道具三處都要補。
- 道具物件：`{ id, qty?, amount?, note?, isNew? }`；`qty` 顯示「×n」，`amount` 是數值（能量 10K、兔子幣 600）。
- `MONSTERS` 的順序依照原始圖表（2,3,4,5,6,7,8,10,11,9,12,13,14），不要自行排序。
- `POTIONS.zoneX[].flags` 為三個陣列，分別是 🚩0/3、🚩1/3、🚩2/3 每一格的藥水量。**更新數字後要驗證每欄加總等於來源表的小計**。
- 第五區 300K 🚩2/3 的最後三格是獨眼怪（`cyclops: { flag: 2, from: 6 }`）。

## 資料來源

- 大門與鑰匙：社群整理圖「Gates and Keys」。
- 怪物：「14 怪物版・兔子幣版本」表，資料日期 2026.08.04（`MONSTERS_VERSION`）。
- 藥水需求：`第四區.pdf`、`第五區.pdf`（魔法王國只走紅旗藥水需求・一般版）。

本站不使用遊戲官方圖片素材，道具以 emoji 表示。

## 部署

推送到 `main` 分支即自動由 GitHub Pages（Deploy from branch: `main` / root）發佈。
