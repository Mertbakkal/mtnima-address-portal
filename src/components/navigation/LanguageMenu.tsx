import { useEffect, useRef, useState } from 'react';
import { IconButton } from '../core/IconButton';
import { useI18n } from '../../i18n/LocaleProvider';
import type { Locale } from '../../i18n/messages';

const OPTIONS: { code: Locale; labelKey: 'english' | 'french' }[] = [
  { code: 'en', labelKey: 'english' },
  { code: 'fr', labelKey: 'french' },
];

export function LanguageMenu() {
  const { locale, setLocale, m } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <IconButton
        shape="rail"
        active={open}
        icon={
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: open ? '#fff' : 'var(--cyan-600)',
          }}>
            {locale === 'fr' ? 'FR' : 'EN'}
          </span>
        }
        label={m.lang.menu}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div
          role="menu"
          aria-label={m.lang.menu}
          style={{
            position: 'absolute',
            left: 'calc(100% + 8px)',
            bottom: 0,
            minWidth: 160,
            padding: 6,
            background: 'var(--surface-page)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-panel)',
            border: '1px solid var(--border-panel)',
            zIndex: 30,
          }}
        >
          {OPTIONS.map((opt) => {
            const on = locale === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                lang={opt.code}
                onClick={() => {
                  setLocale(opt.code);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: on ? 'var(--surface-tint)' : 'transparent',
                  color: 'var(--text-body)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ width: 28, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-accent)' }}>
                  {opt.code === 'fr' ? 'FR' : 'EN'}
                </span>
                {m.lang[opt.labelKey]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
