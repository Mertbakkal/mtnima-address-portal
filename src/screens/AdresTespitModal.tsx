import { useRef, useState, type CSSProperties, type ChangeEvent, type ReactNode } from 'react';
import { Button } from '../components/core/Button';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { useI18n } from '../i18n/LocaleProvider';
import { catalogOptions } from '../i18n/messages';

export interface AdresTespitModalProps {
  onClose: () => void;
}

type Phase = 'intro' | 1 | 2 | 3 | 4;

const DISTRICT_OPTIONS = ['Tevragh Zeina', 'Ksar', 'Dar Naim', 'Teyaret'];
const TYPE_VALUES = ['New address detection', 'Address correction', 'Detection for official document'] as const;
const FORM_VALUES = ['Individual', 'Corporate', 'Via proxy'] as const;

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
  const { m } = useI18n();
  const steps = [
    { id: 1, label: m.detect.privacy },
    { id: 2, label: m.detect.appType },
    { id: 3, label: m.detect.userDetails },
    { id: 4, label: m.detect.documents },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, padding: '8px 4px 4px' }}>
      {steps.map((step, i) => {
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
  const { m } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: 14, alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.4 }}>• {label}</div>
        {optional && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{m.common.optional}</div>}
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
          {fileName || m.detect.upload}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.detect.accepted(formats)}</div>
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
  const { m } = useI18n();
  return (
    <div
      role="dialog"
      aria-label={m.detect.title}
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
          {m.detect.title}
        </h2>
        <button type="button" title={minimized ? m.common.restore : m.common.minimize} aria-label={minimized ? m.common.restore : m.common.minimize} onClick={onMinimize} style={headerBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button type="button" title={m.common.close} aria-label={m.common.close} onClick={onClose} style={headerBtnStyle}>
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
  const { m } = useI18n();
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
      <PinIcon />
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-heading)', marginBottom: 4 }}>
          {m.detect.title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45 }}>
          {m.detect.wizardLead}
        </div>
      </div>
    </div>
  );
}

export function AdresTespitButton({ onClick }: { onClick: () => void }) {
  const { m } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={m.nav.addressDetection}
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
      {m.nav.addressDetectionButton}
    </button>
  );
}

export function AdresTespitModal({ onClose }: AdresTespitModalProps) {
  const { m } = useI18n();
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
          {m.detect.readUnderstood}
        </label>,
        <Button variant="primary" disabled={!introOk} onClick={() => introOk && setPhase(1)}>{m.common.continue}</Button>,
      )}>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--text-body)', lineHeight: 1.5 }}>
          {m.detect.prepareDocs}
        </p>
        <div style={{
          border: '1px solid var(--cyan-300)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 18px',
          background: 'var(--surface-page)',
        }}>
          <BulletList items={[
            m.detect.docLease,
            m.detect.docProxy,
            m.detect.docId,
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
            <Button variant="secondary" onClick={() => setPhase(3)}>{m.common.back}</Button>,
            <Button variant="success" onClick={onClose}>
              {m.detect.sendSms}
            </Button>,
          )
          : footerBar(
            <Button variant="secondary" onClick={() => setPhase((phase === 1 ? 'intro' : (phase - 1)) as Phase)}>{m.common.back}</Button>,
            <Button
              variant="primary"
              disabled={phase === 1 && !privacyOk}
              onClick={() => {
                if (phase === 1 && !privacyOk) return;
                setPhase((phase + 1) as Phase);
              }}
            >
              {m.common.next}
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
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-heading)', marginBottom: 10 }}>{m.detect.requiredDocs}</div>
            <BulletList items={[
              m.detect.reqWater,
              m.detect.reqBusiness,
              m.detect.reqUrban,
            ]} />
          </div>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-body)', lineHeight: 1.45, cursor: 'pointer' }}>
            <input type="checkbox" checked={privacyOk} onChange={(e) => setPrivacyOk(e.target.checked)} style={{ marginTop: 3 }} />
            <span>
              {m.detect.privacyAgreeBefore}{' '}
              <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--red-600)', fontWeight: 700, textDecoration: 'none' }}>
                {m.detect.privacyNotice}
              </a>
              {' '}{m.detect.privacyAgreeAfter}
            </span>
          </label>
        </div>
      )}

      {phase === 2 && (
        <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
          <Select options={DISTRICT_OPTIONS} value={district} placeholder={m.detect.selectDistrict} onChange={(e) => setDistrict(e.target.value)} style={fieldStyle} />
          <Select options={catalogOptions(m.catalog, TYPE_VALUES)} value={appType} placeholder={m.detect.selectType} onChange={(e) => setAppType(e.target.value)} style={fieldStyle} />
          <Select options={catalogOptions(m.catalog, FORM_VALUES)} value={appForm} placeholder={m.detect.selectForm} onChange={(e) => setAppForm(e.target.value)} style={fieldStyle} />
        </div>
      )}

      {phase === 3 && (
        <div style={{ marginTop: 18, display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <Input placeholder={m.detect.id} value={idValue} onChange={(e) => setIdValue(e.target.value)} aria-label={m.detect.id} style={fieldStyle} />
            <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} aria-label={m.detect.birthDate} style={fieldStyle} />
            <Button
              variant="primary"
              onClick={() => setFullName('Mohamed Fall')}
              style={{ height: 42, whiteSpace: 'nowrap' }}
            >
              {m.detect.verifyPerson}
            </Button>
          </div>
          <Input placeholder={m.detect.enterFullName} value={fullName} onChange={(e) => setFullName(e.target.value)} aria-label={m.demand.fullName} style={fieldStyle} />
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
            <Input placeholder={m.detect.phone} value={phone} onChange={(e) => setPhone(e.target.value)} aria-label={m.detect.phone} style={fieldStyle} />
          </div>
        </div>
      )}

      {phase === 4 && (
        <div style={{ marginTop: 18, display: 'grid', gap: 18 }}>
          <UploadZone
            label={m.detect.docLeaseLong}
            formats=".png, .jpeg, .jpg, .pdf"
            fileName={fileAddress}
            onPick={setFileAddress}
          />
          <UploadZone
            label={m.detect.docProxy}
            optional
            formats=".png, .jpeg, .jpg, .pdf, .doc, .docx"
            fileName={fileProxy}
            onPick={setFileProxy}
          />
          <UploadZone
            label={m.catalog.idColor}
            formats=".png, .jpeg, .jpg, .pdf"
            fileName={fileId}
            onPick={setFileId}
          />
        </div>
      )}
    </ModalShell>
  );
}
