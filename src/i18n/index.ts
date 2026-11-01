import { de } from './de';
import { en, type Dictionary } from './en';

export type Language = 'de' | 'en';
export const DICTIONARIES: Record<Language, Dictionary> = { de, en };

/** All dot-separated leaf paths of the dictionary, e.g. "nav.battle". */
type Paths<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Paths<T[K], `${P}${K}.`>;
}[keyof T & string];

export type TKey = Paths<Dictionary>;
export type TParams = Record<string, string | number>;

function lookup(dict: Dictionary, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
}

export function translate(lang: Language, key: TKey | string, params?: TParams): string {
  const text = lookup(DICTIONARIES[lang], key) ?? lookup(en, key) ?? key;
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (_, name: string) =>
    params[name] !== undefined ? String(params[name]) : `{${name}}`,
  );
}

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/** Compact number formatting for idle-game sized numbers. */
export function formatNumber(n: number, lang: Language = 'en'): string {
  if (!Number.isFinite(n)) return '∞';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs < 1000) {
    return sign + (abs < 10 && abs % 1 !== 0 ? abs.toFixed(1) : Math.floor(abs).toString());
  }
  const tier = Math.floor(Math.log10(abs) / 3);
  if (tier < SUFFIXES.length) {
    const scaled = abs / 1000 ** tier;
    const digits = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
    return (
      sign +
      scaled.toLocaleString(lang, { maximumFractionDigits: digits, minimumFractionDigits: digits }) +
      SUFFIXES[tier]
    );
  }
  return sign + abs.toExponential(2).replace('+', '');
}

export function formatDuration(seconds: number): string {
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
