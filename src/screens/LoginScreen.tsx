import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Switch } from '../components/forms/Switch';
import { Button } from '../components/core/Button';
import { LanguageSwitcher, type Language } from '../components/navigation/LanguageSwitcher';

const LANGUAGES: Language[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'tr', label: 'Türkçe' },
];

export interface LoginScreenProps {
  onLogin: () => void;
  locale: string;
  onLocaleChange: (code: string) => void;
}

export function LoginScreen({ onLogin, locale, onLocaleChange }: LoginScreenProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <img
        src="/assets/bg-login-only.png"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}
        style={{
          position: 'relative',
          width: 538,
          background: '#fff',
          padding: '34px 50px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: 'var(--shadow-md)',
          borderRadius: 'var(--radius-lg)',
        }}>
        <img src="/assets/logo-mauritanie.jpg" alt="MAURITANIE" style={{ height: 72, objectFit: 'contain', alignSelf: 'center' }} />
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--label-500)', marginBottom: 8 }}>MAURITANIE</div>
        <Select placeholder="Select domain" options={['MTNIMA — DSI Adressage', 'Mauritania Digital Addressing']} style={{ height: 40 }} />
        <Input placeholder="Username or email" style={{ height: 40 }} aria-label="Username" />
        <Input type="password" placeholder="Password" style={{ height: 40 }} aria-label="Password" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Switch label="Remember me" />
          <a href="#" style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>I forgot my password</a>
        </div>
        <Button type="submit" style={{ alignSelf: 'center', marginTop: 14, minWidth: 96 }}>Log in</Button>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan-600)', marginTop: 6 }}>1.3.5</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher value={locale} onChange={onLocaleChange} languages={LANGUAGES} />
        </div>
      </form>
    </div>
  );
}
