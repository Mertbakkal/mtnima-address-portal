import { useState, type CSSProperties } from 'react';

export interface Language {
  code: string;
  label: string;
  dir?: 'ltr' | 'rtl';
  flag?: string;
}

export interface LanguageSwitcherProps {
  languages?: Language[];
  value?: string;
  onChange?: (code: string) => void;
  style?: CSSProperties;
}

export function LanguageSwitcher({ languages = [], value, onChange, style }: LanguageSwitcherProps) {
  const [internal, setInternal] = useState(value ?? languages[0]?.code);
  const cur = value !== undefined ? value : internal;
  const pick = (c: string) => { if (value === undefined) setInternal(c); onChange?.(c); };
  const active = languages.find((l) => l.code === cur) || languages[0] || ({} as Language);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-6)', ...style }}>
      {languages.map((l) => {
        const on = l.code === cur;
        return (
          <button key={l.code} type="button" lang={l.code} dir={l.dir} aria-pressed={on} onClick={() => pick(l.code)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
              minHeight: 'var(--touch-target-min)', padding: '0 var(--space-4)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: l.dir === 'rtl' ? 'var(--font-arabic)' : 'var(--font-ui)',
              fontSize: 'var(--text-sm)', fontWeight: on ? 'var(--weight-semibold)' : 'var(--weight-regular)',
              color: on ? 'var(--text-accent)' : 'var(--text-muted)',
              borderBottom: on ? '2px solid var(--cyan-500)' : '2px solid transparent',
              transition: 'var(--transition-control)',
            }}>
            {l.flag ? <img src={l.flag} alt="" aria-hidden="true" width={18} height={12} style={{ display: 'block' }} /> : null}
            {l.label}
          </button>
        );
      })}
      <span aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{active.label}</span>
    </div>
  );
}
