import { useEffect } from 'react';
import { AppShell } from './screens/AppShell';

export default function App() {
  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  return <AppShell />;
}
