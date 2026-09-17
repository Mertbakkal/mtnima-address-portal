import { useState, type CSSProperties, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  readOnlyLook?: boolean;
  style?: CSSProperties;
}

export function Textarea({ rows = 3, disabled = false, readOnlyLook = false, style, ...rest }: TextareaProps) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      rows={rows} disabled={disabled}
      onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
      style={{
        width: '100%', minWidth: 0, resize: 'vertical',
        padding: 'var(--space-4) var(--space-5)',
        fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)',
        color: disabled ? 'var(--text-disabled)' : 'var(--text-body)',
        background: disabled || readOnlyLook ? 'var(--surface-sunken)' : 'var(--surface-page)',
        border: '1px solid var(--border-field)', borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-inset-field)', outline: 'none', transition: 'var(--transition-control)',
        ...(focus ? { borderColor: 'var(--border-field-focus)', boxShadow: 'var(--focus-ring)' } : null),
        ...style,
      }}
      {...rest}
    />
  );
}
