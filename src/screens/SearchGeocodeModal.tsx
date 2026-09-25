import { useState, type CSSProperties } from 'react';
import { Button } from '../components/core/Button';
import { IconButton } from '../components/core/IconButton';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import {
  DEFAULT_BASE_GRID,
  getBaseGridOptions,
  resolveGeocode,
  type GeocodeResult,
} from '../data/geocodeSearch';

export interface SearchGeocodeModalProps {
  onClose: () => void;
  onSearch: (result: GeocodeResult) => void;
}

function digitsOnly3(value: string): string {
  return value.replace(/\D/g, '').slice(0, 3);
}

function GlobeSearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7.5" stroke="#fff" strokeWidth="1.6" />
      <ellipse cx="11" cy="11" rx="3.2" ry="7.5" stroke="#fff" strokeWidth="1.4" />
      <path d="M3.5 11h15M11 3.5c2.2 2.4 2.2 12.6 0 15M11 3.5c-2.2 2.4-2.2 12.6 0 15" stroke="#fff" strokeWidth="1.2" />
      <circle cx="11" cy="10" r="2.2" fill="#fff" />
      <path d="M11 12.2V16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.5" cy="17.5" r="3.2" stroke="#fff" strokeWidth="1.6" />
      <path d="M19.8 19.8L22 22" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SearchGeocodeButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      shape="round"
      tone="solid"
      icon={<GlobeSearchIcon size={18} />}
      label="Search Geocode"
      onClick={onClick}
      style={{ width: 40, height: 40 }}
    />
  );
}

export function SearchGeocodeModal({ onClose, onSearch }: SearchGeocodeModalProps) {
  const [grid, setGrid] = useState(DEFAULT_BASE_GRID);
  const [abscissa, setAbscissa] = useState('');
  const [ordinate, setOrdinate] = useState('');

  const canSearch = /^\d{3}$/.test(abscissa) && /^\d{3}$/.test(ordinate);

  const handleSearch = () => {
    const result = resolveGeocode(grid, abscissa, ordinate);
    if (!result) return;
    onSearch(result);
    onClose();
  };

  const headerBtn: CSSProperties = {
    width: 28,
    height: 28,
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    padding: 0,
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    background: 'transparent',
    color: 'var(--text-on-accent)',
  };

  const fieldLabel: CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--weight-semibold)',
    color: 'var(--text-heading)',
    textAlign: 'center',
  };

  return (
    <div
      role="dialog"
      aria-label="Search Geocode"
      style={{
        width: 320,
        maxWidth: 'calc(100vw - 24px)',
        background: 'var(--surface-page)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-panel)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: '12px 14px',
        background: 'var(--surface-accent)',
        color: 'var(--text-on-accent)',
      }}>
        <h2 style={{
          margin: 0,
          flex: 1,
          minWidth: 0,
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--weight-semibold)',
          lineHeight: 'var(--leading-snug)',
          color: 'var(--text-on-accent)',
          textAlign: 'center',
        }}>
          Search Geocode
        </h2>
        <button type="button" title="Close" aria-label="Close" onClick={onClose} style={headerBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={fieldLabel}>Base Grid</label>
          <Select
            options={getBaseGridOptions()}
            value={grid}
            onChange={(e) => setGrid(e.target.value)}
            aria-label="Base Grid"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ ...fieldLabel, textAlign: 'left' }}>Abscissa :</label>
            <Input
              mono
              value={abscissa}
              placeholder="XXX"
              maxLength={3}
              inputMode="numeric"
              aria-label="Abscissa"
              onChange={(e) => setAbscissa(digitsOnly3(e.target.value))}
              style={{ textAlign: 'center', letterSpacing: '0.12em' }}
            />
          </div>
          <div>
            <label style={{ ...fieldLabel, textAlign: 'left' }}>Ordinate :</label>
            <Input
              mono
              value={ordinate}
              placeholder="YYY"
              maxLength={3}
              inputMode="numeric"
              aria-label="Ordinate"
              onChange={(e) => setOrdinate(digitsOnly3(e.target.value))}
              style={{ textAlign: 'center', letterSpacing: '0.12em' }}
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={!canSearch}
          onClick={handleSearch}
          style={{ width: '100%' }}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
