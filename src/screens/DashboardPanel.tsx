import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import {
  CERT_SLICES,
  TIME_SERIES,
  UNIT_SLICES,
  sliceTotal,
  type CertStatus,
  type CountSlice,
  type MonthId,
  type TimeGrain,
  type TimePoint,
  type UnitGroup,
} from '../data/dashboard';
import { useI18n } from '../i18n/LocaleProvider';
import type { Messages } from '../i18n/messages';

export interface DashboardPanelProps {
  onClose: () => void;
}

const DRAW_MS = '520ms';

function formatCount(locale: string, value: number) {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US').format(value);
}

function formatPercent(locale: string, value: number, total: number) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  const text = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(pct);
  return `${text}%`;
}

function axisMax(value: number) {
  if (value <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exp;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * exp;
}

function sliceName(slice: CountSlice, m: Messages) {
  return slice.name ?? m.dashboard.other;
}

function timeLabel(point: TimePoint, m: Messages) {
  if (point.quarter && point.year) return m.dashboard.quarter(point.quarter, point.year);
  if (point.id in m.dashboard.months && point.year) {
    return { name: m.dashboard.months[point.id as MonthId], year: String(point.year) };
  }
  return String(point.year ?? point.id);
}

export function DashboardPanel({ onClose }: DashboardPanelProps) {
  const { locale, m } = useI18n();
  const [group, setGroup] = useState<UnitGroup>('wilaya');
  const [grain, setGrain] = useState<TimeGrain>('monthly');
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const unitSlices = UNIT_SLICES[group];
  const unitTotal = sliceTotal(unitSlices);
  const certTotal = sliceTotal(CERT_SLICES);
  const series = TIME_SERIES[grain];

  return (
    <section
      aria-label={m.nav.dashboard}
      style={{
        position: 'relative',
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--gray-50)',
        boxShadow: 'var(--shadow-panel)',
        overflow: 'hidden',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity var(--duration-slow) var(--ease-out), transform var(--duration-slow) var(--ease-out)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 8px 0' }}>
        <button
          type="button"
          title={m.common.close}
          aria-label={m.common.close}
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-panel)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-page)',
            color: 'var(--gray-600)',
            cursor: 'pointer',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '4px 16px 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 14,
            alignItems: 'stretch',
          }}
        >
          <Card
            icon={<ChartIcon />}
            iconBg="#E8F1FF"
            title={m.dashboard.pointsByUnit}
            control={(
              <FilterSelect
                label={m.dashboard.pointsByUnit}
                value={group}
                onChange={(value) => setGroup(value as UnitGroup)}
                options={[
                  { value: 'wilaya', label: m.dashboard.byWilaya },
                  { value: 'moughataa', label: m.dashboard.byMoughataa },
                  { value: 'commune', label: m.dashboard.byCommune },
                ]}
              />
            )}
          >
            <DonutBlock
              slices={unitSlices}
              total={unitTotal}
              caption={m.dashboard.totalPoints}
              locale={locale}
              labelFor={(slice) => sliceName(slice, m)}
            />
          </Card>

          <Card
            icon={<BadgeIcon />}
            iconBg="#E7F8EE"
            title={m.dashboard.certStatus}
          >
            <DonutBlock
              slices={CERT_SLICES}
              total={certTotal}
              caption={m.dashboard.totalApplications}
              locale={locale}
              labelFor={(slice) => m.dashboard[slice.id as CertStatus]}
            />
          </Card>

          <Card
            icon={<ChartIcon />}
            iconBg="#E8F1FF"
            title={m.dashboard.pointsOverTime}
            control={(
              <FilterSelect
                label={m.dashboard.pointsOverTime}
                value={grain}
                onChange={(value) => setGrain(value as TimeGrain)}
                options={[
                  { value: 'monthly', label: m.dashboard.monthly },
                  { value: 'quarterly', label: m.dashboard.quarterly },
                  { value: 'yearly', label: m.dashboard.yearly },
                ]}
              />
            )}
          >
            <BarChart series={series} axisLabel={m.dashboard.pointCountAxis} locale={locale} messages={m} />
          </Card>

          <Card
            icon={<DocIcon />}
            iconBg="#E8F1FF"
            title={m.dashboard.totalCertTitle}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: '18px 4px 8px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', color: '#2F6FE0', lineHeight: 1 }}>
                  {formatCount(locale, certTotal)}
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                  {m.dashboard.totalCertTitle}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, width: '100%' }}>
                {CERT_SLICES.map((slice) => (
                  <StatusTile
                    key={slice.id}
                    label={m.dashboard[slice.id]}
                    value={formatCount(locale, slice.value)}
                    tone={slice.id}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({
  icon,
  iconBg,
  title,
  control,
  children,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  control?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-panel)',
        borderRadius: 16,
        boxShadow: '0 1px 2px rgba(18, 36, 74, 0.04)',
        padding: '16px 16px 14px',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span
          aria-hidden="true"
          style={{
            width: 32,
            height: 32,
            flex: '0 0 auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            background: iconBg,
          }}
        >
          {icon}
        </span>
        <h2 style={{ margin: '6px 0 0', flex: 1, minWidth: 0, fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', lineHeight: 1.35 }}>
          {title}
        </h2>
        {control}
      </header>
      {children}
    </article>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label style={{ position: 'relative', flex: '0 0 auto' }}>
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          height: 32,
          maxWidth: 168,
          padding: '0 26px 0 12px',
          borderRadius: 8,
          border: '1px solid var(--border-panel)',
          background: 'var(--surface-page)',
          color: 'var(--gray-700)',
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <span aria-hidden="true" style={{
        position: 'absolute',
        top: '50%',
        right: 10,
        width: 6,
        height: 6,
        borderRight: '1.5px solid var(--gray-500)',
        borderBottom: '1.5px solid var(--gray-500)',
        transform: 'translateY(-70%) rotate(45deg)',
        pointerEvents: 'none',
      }} />
    </label>
  );
}

function DonutBlock({
  slices,
  total,
  caption,
  locale,
  labelFor,
}: {
  slices: CountSlice[];
  total: number;
  caption: string;
  locale: string;
  labelFor: (slice: CountSlice) => string;
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
      <Donut slices={slices} total={total} caption={caption} locale={locale} active={active} />
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {slices.map((slice) => {
          const dim = active !== null && active !== slice.id;
          return (
            <li
              key={slice.id}
              onMouseEnter={() => setActive(slice.id)}
              onMouseLeave={() => setActive(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: '10px minmax(0, 1fr) auto auto',
                gap: 8,
                alignItems: 'center',
                fontSize: 13,
                color: 'var(--gray-700)',
                opacity: dim ? 0.35 : 1,
                transition: 'opacity var(--duration-fast) var(--ease-standard)',
              }}
            >
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: slice.color }} />
              <span style={{ minWidth: 0, lineHeight: 1.25 }}>{labelFor(slice)}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 650, whiteSpace: 'nowrap' }}>{formatCount(locale, slice.value)}</span>
              <span style={{ minWidth: 48, textAlign: 'right', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                {formatPercent(locale, slice.value, total)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Donut({
  slices,
  total,
  caption,
  locale,
  active,
}: {
  slices: CountSlice[];
  total: number;
  caption: string;
  locale: string;
  active: string | null;
}) {
  const [drawn, setDrawn] = useState(false);
  const signature = slices.map((slice) => `${slice.id}:${slice.value}`).join('|');

  useEffect(() => {
    setDrawn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setDrawn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [signature]);

  const size = 196;
  const stroke = 24;
  const radius = (size - stroke) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = slices.length > 1 ? 4 : 0;
  let cursor = 0;
  const segments = slices.map((slice) => {
    const length = total > 0 ? (slice.value / total) * circumference : 0;
    const draw = Math.max(0, length - gap);
    const segment = { ...slice, draw, offset: cursor + gap / 2, length };
    cursor += length;
    return segment;
  });

  return (
    <div style={{ position: 'relative', width: size, height: size, flex: '0 0 auto' }}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={caption}>
      <g transform={`rotate(-90 ${center} ${center})`}>
        {segments.map((segment) => (
          <circle
            key={segment.id}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${drawn ? segment.draw : 0} ${circumference}`}
            strokeDashoffset={-segment.offset}
            opacity={active !== null && active !== segment.id ? 0.28 : 1}
            style={{ transition: `stroke-dasharray ${DRAW_MS} var(--ease-out), opacity var(--duration-fast) var(--ease-standard)` }}
          />
        ))}
      </g>
      {segments.map((segment) => {
        const share = total > 0 ? segment.length / circumference : 0;
        if (share < 0.07) return null;
        const mid = segment.offset + segment.draw / 2;
        const angle = (mid / circumference) * Math.PI * 2 - Math.PI / 2;
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        return (
          <text
            key={`${segment.id}-pct`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="10"
            fontWeight="700"
            style={{ opacity: drawn ? 1 : 0, transition: 'opacity var(--duration-slow) var(--ease-out)' }}
          >
            {formatPercent(locale, segment.value, total)}
          </text>
        );
      })}
    </svg>
    <div
      style={{
        position: 'absolute',
        left: stroke + 10,
        right: stroke + 10,
        top: '50%',
        transform: 'translateY(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy-900)', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>
        {formatCount(locale, total)}
      </div>
      <div style={{ marginTop: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.03em', lineHeight: 1.2, color: 'var(--text-muted)' }}>
        {caption}
      </div>
    </div>
    </div>
  );
}

function BarChart({
  series,
  axisLabel,
  locale,
  messages,
}: {
  series: TimePoint[];
  axisLabel: string;
  locale: string;
  messages: Messages;
}) {
  const [drawn, setDrawn] = useState(false);
  const signature = series.map((point) => `${point.id}:${point.value}`).join('|');
  const max = axisMax(Math.max(...series.map((point) => point.value), 0));
  const ticks = [0, 1, 2, 3, 4].map((step) => Math.round((max / 4) * step));

  useEffect(() => {
    setDrawn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setDrawn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [signature]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '18px 44px minmax(0, 1fr)', gap: 8, minHeight: 240 }}>
      <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap', alignSelf: 'center' }}>
        {axisLabel}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', paddingBottom: 36 }}>
        {ticks.map((tick) => (
          <span key={tick} style={{ fontSize: 10, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
            {formatCount(locale, tick)}
          </span>
        ))}
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 8, minHeight: 180, paddingBottom: 36 }}>
        {ticks.map((tick) => (
          <span
            key={`line-${tick}`}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `calc(36px + ${(tick / max) * 180}px)`,
              borderTop: '1px solid var(--gray-100)',
            }}
          />
        ))}
        {series.map((point, index) => {
          const label = timeLabel(point, messages);
          const height = max > 0 ? (point.value / max) * 180 : 0;
          return (
            <div key={point.id} style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0, height: 180 }}>
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  bottom: drawn ? height + 4 : 4,
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#2F6FE0',
                  fontVariantNumeric: 'tabular-nums',
                  transition: `bottom ${DRAW_MS} var(--ease-out)`,
                  transitionDelay: `${index * 30}ms`,
                }}
              >
                {formatCount(locale, point.value)}
              </span>
              <div
                style={{
                  position: 'absolute',
                  left: '19%',
                  right: '19%',
                  bottom: 0,
                  height: drawn ? height : 0,
                  borderRadius: '6px 6px 2px 2px',
                  background: 'linear-gradient(180deg, #5B95F5 0%, #2F6FE0 100%)',
                  transition: `height ${DRAW_MS} var(--ease-out)`,
                  transitionDelay: `${index * 30}ms`,
                }}
              />
              <span style={barLabelStyle}>
                {typeof label === 'string' ? label : (
                  <>
                    {label.name}
                    <br />
                    {label.year}
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const barLabelStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: '100%',
  marginTop: 6,
  fontSize: 9,
  lineHeight: 1.15,
  textAlign: 'center',
  color: 'var(--text-muted)',
};

const TILE_TONE: Record<CertStatus, { bg: string; fg: string }> = {
  approved: { bg: '#E8F8EE', fg: '#1F8A3B' },
  pending: { bg: '#FFF6E0', fg: '#B7791F' },
  rejected: { bg: '#FDECEC', fg: '#C53639' },
  underReview: { bg: '#E8F2FC', fg: '#1F69A8' },
};

function StatusTile({ label, value, tone }: { label: string; value: string; tone: CertStatus }) {
  const colors = TILE_TONE[tone];
  return (
    <div style={{ background: colors.bg, borderRadius: 12, padding: '12px 8px', textAlign: 'center', minWidth: 0 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: colors.fg, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ marginTop: 4, fontSize: 11, color: colors.fg, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19V9M12 19V5M19 19v-7" stroke="#2F6FE0" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.2-2.8 7.2-7 9-4.2-1.8-7-4.8-7-9V6l7-3z" stroke="#1F8A3B" strokeWidth="1.8" />
      <path d="M9 12l2 2 4-4" stroke="#1F8A3B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="#2F6FE0" strokeWidth="1.8" />
      <path d="M14 3v5h5M8 13h8M8 17h5" stroke="#2F6FE0" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
