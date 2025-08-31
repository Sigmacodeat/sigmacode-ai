import React, { useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRecoilState } from 'recoil';
import { cn } from '~/utils';
import store from '~/store';

/**
 * LanguageToggle
 * - Minimaler EN/DE-Schalter für Header/Landing
 * - Persistenz via Cookie 'lang' + Recoil store.lang
 * - Setzt document.documentElement.lang client-seitig
 */
export default function LanguageToggle({ className }: { className?: string }) {
  const [lang, setLang] = useRecoilState(store.lang);

  // documentElement.lang synchron halten (nur Client)
  useEffect(() => {
    if (typeof document !== 'undefined' && lang) {
      requestAnimationFrame(() => {
        document.documentElement.lang = lang;
      });
    }
  }, [lang]);

  const setLanguage = useCallback(
    (value: 'de-DE' | 'en-US') => {
      setLang(value);
      Cookies.set('lang', value, { expires: 365 });
    },
    [setLang],
  );

  const isDE = lang?.toLowerCase()?.startsWith('de');
  const isEN = lang?.toLowerCase()?.startsWith('en');

  return (
    <div className={cn('inline-flex items-center', className)}>
      <div role="group" aria-label="Language selector" className="inline-flex rounded-md border border-border p-0.5">
        <button
          type="button"
          className={cn(
            'rounded px-2 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-border',
            isDE ? 'bg-surface-hover text-text-primary' : 'text-text-secondary hover:bg-surface-hover',
          )}
          aria-pressed={isDE}
          onClick={() => setLanguage('de-DE')}
        >
          DE
        </button>
        <button
          type="button"
          className={cn(
            'rounded px-2 py-1 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-border',
            isEN ? 'bg-surface-hover text-text-primary' : 'text-text-secondary hover:bg-surface-hover',
          )}
          aria-pressed={isEN}
          onClick={() => setLanguage('en-US')}
        >
          EN
        </button>
      </div>
    </div>
  );
}
