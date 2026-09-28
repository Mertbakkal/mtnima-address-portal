import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Switch } from '../components/forms/Switch';
import { Button } from '../components/core/Button';
import { LanguageSwitcher, type Language } from '../components/navigation/LanguageSwitcher';
import { useI18n } from '../i18n/LocaleProvider';
import type { Locale } from '../i18n/messages';

export interface LoginScreenProps {
  onLogin: () => void;
  locale?: string;
  onLocaleChange?: (code: string) => void;
}

export function LoginScreen({ onLogin, locale: localeProp, onLocaleChange }: LoginScreenProps) {
  const { locale, setLocale, m } = useI18n();
  const value = localeProp ?? locale;
  const languages: Language[] = [
    { code: 'en', label: m.lang.english },
    { code: 'fr', label: m.lang.french },
  ];
  const change = (code: string) => {
    if (code === 'en' || code === 'fr') setLocale(code as Locale);
    onLocaleChange?.(code);
  };
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
        <Select placeholder={m.login.selectDomain} options={['MTNIMA — DSI Adressage', m.login.domainDigital]} style={{ height: 40 }} />
        <Input placeholder={m.login.usernameOrEmail} style={{ height: 40 }} aria-label={m.login.username} />
        <Input type="password" placeholder={m.login.password} style={{ height: 40 }} aria-label={m.login.password} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Switch label={m.login.remember} />
          <a href="#" style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>{m.login.forgot}</a>
        </div>
        <Button type="submit" style={{ alignSelf: 'center', marginTop: 14, minWidth: 96 }}>{m.login.submit}</Button>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan-600)', marginTop: 6 }}>1.3.5</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LanguageSwitcher value={value} onChange={change} languages={languages} />
        </div>
      </form>
    </div>
  );
}
