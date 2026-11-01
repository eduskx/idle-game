import { useCallback } from 'react';
import { useGame } from '../store/gameStore';
import { formatNumber, translate, type TKey, type TParams } from '.';

export function useT() {
  const lang = useGame().settings.language;
  const t = useCallback((key: TKey | string, params?: TParams) => translate(lang, key, params), [lang]);
  const n = useCallback((value: number) => formatNumber(value, lang), [lang]);
  return { t, n, lang };
}
