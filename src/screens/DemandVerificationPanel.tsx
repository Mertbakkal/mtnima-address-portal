import type { CSSProperties } from 'react';
import { Button } from '../components/core/Button';
import { PhotoThumb } from '../components/panels/PhotoThumb';
import type { AddressDemand } from '../data/addressDemand';

export interface DemandVerificationPanelProps {
  demand: AddressDemand;
  onClose: () => void;
}

const navyButton: CSSProperties = {
  background: 'var(--navy-800)',
  borderColor: 'var(--navy-800)',
  color: '#fff',
  borderRadius: 'var(--radius-md)',
  height: 'auto',
  minHeight: 40,
  whiteSpace: 'normal',
  textAlign: 'center',
  padding: '8px 12px',
};

export function DemandVerificationPanel({ demand, onClose }: DemandVerificationPanelProps) {
  return (
    <aside aria-label="Demand verification" style={{
      width: 340,
      maxWidth: '100%',
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-panel)',
      border: '1px solid var(--border-panel)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-panel)',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: '14px 14px 10px',
        borderBottom: '1px solid var(--border-panel)',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--text-heading)',
          }}>Demand verification</h2>
          <div style={{
            marginTop: 4,
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: 'var(--gray-800)',
          }}>{demand.identifier}</div>
        </div>
        <button
          type="button"
          title="Close"
          aria-label="Close demand"
          onClick={onClose}
          style={{
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
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" stroke="var(--gray-600)" strokeWidth="2.4" strokeLinecap="round" fill="none" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 14px 18px', display: 'grid', gap: 14, alignContent: 'start' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <PhotoThumb src={demand.photos[0] ?? undefined} caption="Photo 1" alt="Demand photo 1" width={140} height={100} />
          <PhotoThumb src={demand.photos[1] ?? undefined} caption="Photo 2" alt="Demand photo 2" width={140} height={100} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-heading)', marginBottom: 8 }}>Information</div>
          <InfoLine label="ID" value={demand.identifier} mono />
          <InfoLine label="Full name" value={demand.fullName} />
          <InfoLine label="Phone number" value={demand.phone} />
          <InfoLine label="Document" value={demand.documents[0]} />
          <InfoLine label="Document" value={demand.documents[1]} />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <Button block style={navyButton}>Show demand on the map</Button>
          <Button block style={navyButton}>Change the demand address</Button>
          <Button block variant="success" style={{ height: 'auto', minHeight: 44, whiteSpace: 'normal', textAlign: 'center', padding: '8px 12px' }}>
            Accept the demand (and certify the address)
          </Button>
          <Button block variant="danger" style={{ ...navyButton, background: 'var(--red-500)', borderColor: 'var(--red-500)', color: '#fff' }}>
            Do not accept
          </Button>
        </div>
      </div>
    </aside>
  );
}

function InfoLine({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '108px minmax(0, 1fr)', gap: 8, padding: '4px 0', fontSize: 13, lineHeight: 1.4 }}>
      <span style={{ color: 'var(--label-500)' }}>{label}</span>
      <span style={{ color: 'var(--gray-800)', fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
