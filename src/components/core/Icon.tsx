import type { CSSProperties } from 'react';

export const ICON_NAMES = [
  'nav-home', 'nav-hierarchy', 'nav-tasks', 'nav-bell', 'nav-user',
  'tool-street-draw', 'tool-street-info', 'tool-address-point', 'tool-numbering', 'tool-address-move', 'tool-address-info',
  'map-info', 'map-pan', 'map-select-box', 'map-measure', 'map-pin', 'map-undo', 'map-print', 'map-layers',
  'rail-star', 'rail-info', 'rail-pan', 'rail-clear', 'rail-satellite', 'rail-locate', 'rail-extent', 'rail-measure', 'rail-cloud', 'rail-target',
  'section-location', 'section-road-link', 'section-basic-info', 'section-network', 'section-field-record',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

const DEFAULT_BASE = '/assets/icons/';
const SVG_ICON_NAMES = new Set([
  'rail-star', 'rail-info', 'rail-pan', 'rail-clear', 'rail-satellite',
  'rail-locate', 'rail-extent', 'rail-measure', 'rail-cloud', 'rail-target',
]);

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
  const ext = SVG_ICON_NAMES.has(name) ? '.svg' : '.png';
  return (
    <img
      src={base + name + ext}
      alt={decorative ? '' : alt}
      aria-hidden={decorative ? 'true' : undefined}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, display: 'block', flex: '0 0 auto', objectFit: 'contain', ...style }}
    />
  );
}
