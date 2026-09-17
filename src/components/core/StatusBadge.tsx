import type { CSSProperties, ReactNode } from 'react';

export type StatusTone = 'success' | 'pending' | 'danger' | 'info' | 'neutral';

const tones: Record<StatusTone, CSSProperties> = {
  success: { background: 'var(--status-success-bg)', color: 'var(--status-success-fg)' },
  pending: { background: 'var(--status-pending-bg)', color: 'var(--status-pending-fg)' },
  danger: { background: 'var(--status-danger-bg)', color: 'var(--status-danger-fg)' },
  info: { background: 'var(--status-info-bg)', color: 'var(--status-info-fg)' },
  neutral: { background: 'var(--status-neutral-bg)', color: 'var(--status-neutral-fg)' },
};
const solidTones: Record<StatusTone, string> = {
  success: 'var(--status-success-solid)', pending: 'var(--status-pending-solid)',
  danger: 'var(--status-danger-solid)', info: 'var(--status-info-solid)', neutral: 'var(--gray-500)',
};

export interface StatusBadgeProps {
  children?: ReactNode;
  tone?: StatusTone;
  solid?: boolean;
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

export function StatusBadge({ children, tone = 'neutral', solid = false, size = 'md', style }: StatusBadgeProps) {
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: size === 'sm' ? '20px' : '26px',
      padding: size === 'sm' ? '0 var(--space-4)' : '0 var(--space-6)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-ui)', fontSize: size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)',
      fontWeight: 'var(--weight-semibold)', lineHeight: 1, whiteSpace: 'nowrap',
      ...(solid ? { background: solidTones[tone], color: 'var(--text-on-accent)' } : t),
      ...style,
    }}>{children}</span>
  );
}
