import { useState, type ChangeEventHandler, type CSSProperties } from 'react';
import { Input } from './Input';

export interface SearchFieldProps {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  onSearch?: () => void;
  id?: string;
  buttonLabel?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function SearchField({
  value, onChange, placeholder = 'Enter a name...', onSearch, id, buttonLabel = 'Search', disabled = false, style,
}: SearchFieldProps) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0, ...style }}>
      <Input id={id} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} />
      <button
        type="button" title={buttonLabel} aria-label={buttonLabel} disabled={disabled} onClick={onSearch}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          width: '28px', height: '28px', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', borderRadius: 'var(--radius-sm)', padding: 0,
          background: hover && !disabled ? 'var(--surface-tint)' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer', transition: 'var(--transition-control)',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={disabled ? 'var(--gray-400)' : 'var(--icon-default)'} strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" />
        </svg>
      </button>
    </div>
  );
}
