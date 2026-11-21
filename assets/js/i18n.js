// 輕量 i18n：載入 /locales/<code>.json，提供 t()、套用 [data-i18n] 與語言偵測。
import { LANGUAGES } from './data.js';

const FALLBACK = 'zh-TW';
const STORAGE_KEY = 'magicland.lang';
const cache = new Map();
let current = FALLBACK;
let dict = {};
let fallbackDict = {};

const supported = new Set(LANGUAGES.map((l) => l.code));

/** 依 ?lang= → localStorage → 瀏覽器語言 → 預設 的順序決定語言 */
export function detectLanguage() {
  const fromUrl = new URL(location.href).searchParams.get('lang');
  if (fromUrl && supported.has(fromUrl)) return fromUrl;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && supported.has(saved)) return saved;
  } catch { /* 隱私模式等情況可能無法存取 */ }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const lower = tag.toLowerCase();
    if (lower.startsWith('zh')) return 'zh-TW';
    const base = lower.split('-')[0];
    if (supported.has(base)) return base;
  }
  return FALLBACK;
}

async function load(code) {
  if (!cache.has(code)) {
    const res = await fetch(new URL(`../../locales/${code}.json`, import.meta.url));
    if (!res.ok) throw new Error(`Locale ${code} failed: ${res.status}`);
    cache.set(code, await res.json());
  }
  return cache.get(code);
}

const lookup = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj);

/** 取得翻譯字串，支援 {name} 參數 */
export function t(key, params = {}) {
  const raw = lookup(dict, key) ?? lookup(fallbackDict, key) ?? key;
  return String(raw).replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}

export const getLanguage = () => current;

let requestId = 0;

/** 切換語言；回傳 false 表示此次請求已被更新的請求取代（快速連點時避免舊結果覆蓋新結果） */
export async function setLanguage(code) {
  if (!supported.has(code)) code = FALLBACK;
  const id = ++requestId;
  const [next, fb] = await Promise.all([load(code), load(FALLBACK)]);
  if (id !== requestId) return false;
  [dict, fallbackDict] = [next, fb];
  current = code;

  document.documentElement.lang = code;
  try { localStorage.setItem(STORAGE_KEY, code); } catch { /* ignore */ }

  const url = new URL(location.href);
  url.searchParams.set('lang', code);
  history.replaceState(null, '', url);

  applyStatic();
  return true;
}

/** 套用 HTML 上的靜態翻譯：data-i18n（textContent）、data-i18n-attr="attr:key;attr2:key2" */
export function applyStatic(root = document) {
  for (const el of root.querySelectorAll('[data-i18n]')) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of root.querySelectorAll('[data-i18n-attr]')) {
    for (const pair of el.dataset.i18nAttr.split(';')) {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    }
  }
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
}
