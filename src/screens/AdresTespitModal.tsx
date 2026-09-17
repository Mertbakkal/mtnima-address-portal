import { useRef, useState, type CSSProperties, type ChangeEvent, type ReactNode } from 'react';
import { Button } from '../components/core/Button';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';

export interface AdresTespitModalProps {
  onClose: () => void;
}

type Phase = 'intro' | 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: 'Privacy' },
  { id: 2, label: 'Application type' },
  { id: 3, label: 'User details' },
  { id: 4, label: 'Documents' },
] as const;

const DISTRICT_OPTIONS = ['Tevragh Zeina', 'Ksar', 'Dar Naim', 'Teyaret'];
const TYPE_OPTIONS = ['New address detection', 'Address correction', 'Detection for official document'];
const FORM_OPTIONS = ['Individual', 'Corporate', 'Via proxy'];

const headerBtnStyle: CSSProperties = {
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

const fieldStyle: CSSProperties = {
  width: '100%',
  height: 42,
  borderRadius: 'var(--radius-md)',
};

function PinIcon() {
  return (
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-md)',
      background: 'var(--green-100, #e8f5e9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 auto',
    }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" fill="var(--green-600, #2e7d32)" />
        <circle cx="12" cy="10" r="2.5" fill="#fff" />
      </svg>
    </div>
  );
}

function DocPenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h4M9 17h6" />
      <path d="M16.5 14.5l2 2-3.5 1.5.8-3.8 2.2-.2z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-600)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 16V6" />
      <path d="M8 10l4-4 4 4" />
      <path d="M4 18h16" />
    </svg>
  );
}

function Stepper({ active }: { active: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, padding: '8px 4px 4px' }}>
      {STEPS.map((step, i) => {
        const done = active > step.id;
        const current = active === step.id;
        const tone = done || current ? 'var(--surface-accent)' : 'var(--gray-300)';
        return (
          <div key={step.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minWidth: 0 }}>
            {i > 0 && (
              <div style={{
                position: 'absolute',
                top: 14,
                right: '50%',
                width: '100%',
                height: 3,
                background: active >= step.id ? 'var(--surface-accent)' : 'var(--gray-200)',
                zIndex: 0,
              }} />
            )}
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: current || done ? 'var(--surface-accent)' : 'var(--gray-100)',
              border: `2px solid ${tone}`,
              color: current || done ? '#fff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              zIndex: 1,
              position: 'relative',
            }}>
              {done ? '✓' : step.id}
            </div>
            <div style={{
              marginTop: 8,
              fontSize: 11,
              textAlign: 'center',
              color: current ? 'var(--text-heading)' : 'var(--text-muted)',
              fontWeight: current ? 700 : 500,
              lineHeight: 1.25,
              maxWidth: 110,
            }}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: '0 0 0 4px', listStyle: 'none', display: 'grid', gap: 10 }}>
      {items.map((item) => (
        <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-body)', lineHeight: 1.45 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--surface-accent)', marginTop: 6, flex: '0 0 auto' }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function UploadZone({
  label,
  optional,
  formats,
  fileName,
  onPick,
}: {
  label: string;
  optional?: boolean;
  formats: string;
  fileName: string | null;
  onPick: (name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: 14, alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.4 }}>• {label}</div>
        {optional && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Optional</div>}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          border: '1.5px dashed var(--cyan-400)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--cyan-50, #f0fafd)',
          padding: '14px 12px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          textAlign: 'center',
        }}
      >
        <UploadIcon />
        <div style={{ fontSize: 12, color: 'var(--text-heading)', fontWeight: 600 }}>
          {fileName || 'Click to upload or drag and drop'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Accepted formats: {formats}</div>
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpeg,.jpg,.pdf,.doc,.docx"
          hidden
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (f) onPick(f.name);
          }}
        />
      </button>
    </div>
  );
}

function ModalShell({
  minimized,
  onMinimize,
  onClose,
  children,
  footer,
}: {
  minimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-label="Address Detection Application"
      style={{
        width: minimized ? 360 : 760,
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: minimized ? undefined : 'calc(100vh - 48px)',
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
          color: 'var(--text-on-accent)',
        }}>
          Address Detection Application
        </h2>
        <button type="button" title={minimized ? 'Restore' : 'Minimize'} aria-label={minimized ? 'Restore' : 'Minimize'} onClick={onMinimize} style={headerBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button type="button" title="Close" aria-label="Close" onClick={onClose} style={headerBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>
      {!minimized && (
        <>
          <div style={{ padding: '20px 24px 8px', overflow: 'auto', flex: 1, minHeight: 0 }}>
            {children}
          </div>
          {footer}
        </>
      )}
    </div>
  );
}

function WizardHeader() {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
      <PinIcon />
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 4 }}>
          Address Detection Application
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 }}>
          Complete your application easily by filling in the required information step by step for your address detection process.
        </div>
      </div>
    </div>
  );
}

export function AdresTespitButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Address Detection"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 34,
        padding: '0 16px 0 12px',
        border: 'none',
        borderRadius: 999,
        cursor: 'pointer',
        color: '#fff',
        fontFamily: 'var(--font-ui)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.02em',
        background: 'linear-gradient(90deg, #0a6e8a 0%, #08b8e6 100%)',
        boxShadow: 'var(--shadow-sm)',
        whiteSpace: 'nowrap',
      }}
    >
      <DocPenIcon />
      ADDRESS DETECTION
    </button>
  );
}

export function AdresTespitModal({ onClose }: AdresTespitModalProps) {
  const [minimized, setMinimized] = useState(false);
  const [phase, setPhase] = useState<Phase>('intro');
  const [introOk, setIntroOk] = useState(false);
  const [privacyOk, setPrivacyOk] = useState(false);
  const [district, setDistrict] = useState('');
  const [appType, setAppType] = useState('');
  const [appForm, setAppForm] = useState('');
  const [idValue, setIdValue] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [fileAddress, setFileAddress] = useState<string | null>(null);
  const [fileProxy, setFileProxy] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const footerBar = (left: ReactNode, right: ReactNode) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '14px 24px 18px',
      borderTop: '1px solid var(--border-panel)',
    }}>
      {left}
      {right}
    </div>
  );

  if (phase === 'intro') {
    return (
      <ModalShell minimized={minimized} onMinimize={() => setMinimized((m) => !m)} onClose={onClose} footer={footerBar(
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-body)', cursor: 'pointer' }}>
          <input type="checkbox" checked={introOk} onChange={(e) => setIntroOk(e.target.checked)} />
          I have read and understood
        </label>,
        <Button variant="primary" disabled={!introOk} onClick={() => introOk && setPhase(1)}>Continue</Button>,
      )}>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--text-body)', lineHeight: 1.5 }}>
          To complete your application, please prepare the following documents electronically before you begin.
        </p>
        <div style={{
          border: '1px solid var(--cyan-300)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 18px',
          background: 'var(--surface-page)',
        }}>
          <BulletList items={[
            'Lease agreement or title deed, utility bill (electricity, water, gas), insurance policy, or another document showing the address',
            'Signature circular / power of attorney',
            'Color photo of ID front and back',
          ]} />
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      minimized={minimized}
      onMinimize={() => setMinimized((m) => !m)}
      onClose={onClose}
      footer={
        phase === 4
          ? footerBar(
            <Button variant="secondary" onClick={() => setPhase(3)}>Back</Button>,
            <Button variant="success" onClick={onClose}>
              Send application for SMS approval
            </Button>,
          )
          : footerBar(
            <Button variant="secondary" onClick={() => setPhase((phase === 1 ? 'intro' : (phase - 1)) as Phase)}>Back</Button>,
            <Button
              variant="primary"
              disabled={phase === 1 && !privacyOk}
              onClick={() => {
                if (phase === 1 && !privacyOk) return;
                setPhase((phase + 1) as Phase);
              }}
            >
              Next
            </Button>,
          )
      }
    >
      <WizardHeader />
      <Stepper active={phase} />

      {phase === 1 && (
        <div style={{ marginTop: 18, display: 'grid', gap: 16 }}>
          <div style={{
            border: '1px solid var(--cyan-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            background: 'var(--cyan-50, #f0fafd)',
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-heading)', marginBottom: 10 }}>Required documents</div>
            <BulletList items={[
              'Water, electricity, and gas subscription procedures',
              'Business opening license procedures',
              'Urban renewal (rent support), civil registry declaration procedures',
            ]} />
          </div>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-body)', lineHeight: 1.45, cursor: 'pointer' }}>
            <input type="checkbox" checked={privacyOk} onChange={(e) => setPrivacyOk(e.target.checked)} style={{ marginTop: 3 }} />
            <span>
              I have read, understood, and agree to the{' '}
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--red-600)', fontWeight: 700, textDecoration: 'none' }}>
                Privacy Notice
              </a>
              {' '}regarding the processing of my personal data.
            </span>
          </label>
        </div>
      )}

      {phase === 2 && (
        <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
          <Select options={DISTRICT_OPTIONS} value={district} placeholder="Select district" onChange={(e) => setDistrict(e.target.value)} style={fieldStyle} />
          <Select options={TYPE_OPTIONS} value={appType} placeholder="Select application type" onChange={(e) => setAppType(e.target.value)} style={fieldStyle} />
          <Select options={FORM_OPTIONS} value={appForm} placeholder="Select application form" onChange={(e) => setAppForm(e.target.value)} style={fieldStyle} />
        </div>
      )}

      {phase === 3 && (
        <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <Input placeholder="ID" value={idValue} onChange={(e) => setIdValue(e.target.value)} aria-label="ID" style={fieldStyle} />
            <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} aria-label="Date of birth" style={fieldStyle} />
            <Button
              variant="primary"
              onClick={() => setFullName('Mohamed Fall')}
              style={{ height: 42, whiteSpace: 'nowrap' }}
            >
              Verify person
            </Button>
          </div>
          <Input placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} aria-label="Full name" style={fieldStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 8 }}>
            <div style={{
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-field)',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-body)',
              background: 'var(--surface-sunken)',
            }}>
              +222
            </div>
            <Input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Phone number" style={fieldStyle} />
          </div>
        </div>
      )}

      {phase === 4 && (
        <div style={{ marginTop: 18, display: 'grid', gap: 18 }}>
          <UploadZone
            label="Lease agreement, title deed, utility bill (electricity, water, gas, insurance), or another document showing the address"
            formats=".png, .jpeg, .jpg, .pdf"
            fileName={fileAddress}
            onPick={setFileAddress}
          />
          <UploadZone
            label="Signature circular / power of attorney"
            optional
            formats=".png, .jpeg, .jpg, .pdf, .doc, .docx"
            fileName={fileProxy}
            onPick={setFileProxy}
          />
          <UploadZone
            label="ID front and back (color)"
            formats=".png, .jpeg, .jpg, .pdf"
            fileName={fileId}
            onPick={setFileId}
          />
        </div>
      )}
    </ModalShell>
  );
}
