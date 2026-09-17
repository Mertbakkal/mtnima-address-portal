import type { CSSProperties } from 'react';

export const ICON_NAMES = [
  'nav-home', 'nav-hierarchy', 'nav-tasks', 'nav-bell', 'nav-user',
  'tool-street-draw', 'tool-street-info', 'tool-address-point', 'tool-numbering', 'tool-address-move', 'tool-address-info',
  'map-info', 'map-pan', 'map-select-box', 'map-measure', 'map-pin', 'map-undo', 'map-print', 'map-layers',
  'section-location', 'section-road-link', 'section-basic-info', 'section-network', 'section-field-record',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

const DEFAULT_BASE = '/assets/icons/';

export interface IconProps {
  name: IconName | string;
  size?: number;
  alt?: string;
  base?: string;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, size = 24, alt, base = DEFAULT_BASE, style, className }: IconProps) {
  const decorative = alt === undefined || alt === '';
  return (
    <img
      src={base + name + '.png'}
      alt={decorative ? '' : alt}
      aria-hidden={decorative ? 'true' : undefined}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, display: 'block', flex: '0 0 auto', objectFit: 'contain', ...style }}
    />
  );
}
