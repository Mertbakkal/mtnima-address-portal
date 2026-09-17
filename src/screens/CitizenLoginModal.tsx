import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { Button } from '../components/core/Button';
import { Icon } from '../components/core/Icon';

export interface CitizenLoginModalProps {
  onClose: () => void;
}

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

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.1A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.1 4.2" />
      <path d="M6.1 6.1C3.9 7.8 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.9-.8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function IconField({
  icon,
  trailing,
  children,
}: {
  icon: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      height: 'var(--control-height-lg)',
      padding: '0 var(--space-5)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-field)',
      background: 'var(--surface-page)',
      boxShadow: 'var(--shadow-inset-field)',
    }}>
      <span style={{ display: 'flex', color: 'var(--text-muted)', flex: '0 0 auto' }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {trailing}
    </div>
  );
}

const fieldInputStyle: CSSProperties = {
  width: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  padding: 0,
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-body)',
  height: '100%',
};

export function CitizenLoginModal({ onClose }: CitizenLoginModalProps) {
  const [minimized, setMinimized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="Login"
      style={{
        width: minimized ? 320 : 420,
        maxWidth: 'calc(100vw - 24px)',
        background: 'var(--surface-page)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-panel)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: '12px 14px',
          background: 'var(--surface-accent)',
          color: 'var(--text-on-accent)',
        }}
      >
        <h2
          style={{
            margin: 0,
            flex: 1,
            minWidth: 0,
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--weight-semibold)',
            lineHeight: 'var(--leading-snug)',
            color: 'var(--text-on-accent)',
          }}
        >
          Login
        </h2>
        <button
          type="button"
          title={minimized ? 'Restore' : 'Minimize'}
          aria-label={minimized ? 'Restore' : 'Minimize'}
          onClick={() => setMinimized((m) => !m)}
          style={headerBtnStyle}
        >
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
        <form onSubmit={handleSubmit} style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h3
              style={{
                margin: '0 0 8px',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-heading)',
                lineHeight: 'var(--leading-snug)',
              }}
            >
              Log into your account
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-muted)',
                lineHeight: 'var(--leading-normal)',
              }}
            >
              You can log in with your username and password.
            </p>
          </div>

          <IconField icon={<Icon name="nav-user" size={18} />}>
            <input
              type="text"
              name="username"
              autoComplete="username"
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username or Email"
              style={fieldInputStyle}
            />
          </IconField>

          <IconField
            icon={<LockIcon />}
            trailing={
              <button
                type="button"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  flex: '0 0 auto',
                }}
              >
                <EyeIcon open={showPassword} />
              </button>
            }
          >
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              style={fieldInputStyle}
            />
          </IconField>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary">
              <CheckIcon />
              Login
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
