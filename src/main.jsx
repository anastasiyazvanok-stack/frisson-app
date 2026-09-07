import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Keyboard, KeyboardStyle } from '@capacitor/keyboard'

Keyboard.setStyle({ style: KeyboardStyle.Dark }).catch(() => {})

function StartupError({ configuration = false }) {
  return <main role="alert" style={{ minHeight: '100dvh', display: 'grid', placeContent: 'center', padding: 28, background: '#06030a', color: '#eee', fontFamily: 'system-ui', textAlign: 'center' }}>
    <h1>FRISSON</h1>
    <p>{configuration ? 'Эта версия приложения ещё не настроена.' : 'Не удалось открыть приложение.'}</p>
    <p>{configuration ? 'Необходимо завершить настройку подключения. Попробуйте позже.' : 'Попробуйте обновить страницу. Если ошибка повторяется, сообщите нам.'}</p>
    <button onClick={() => window.location.reload()} style={{ padding: 14 }}>Повторить</button>
  </main>;
}

class StartupBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StartupError /> : this.props.children; }
}

const root = createRoot(document.getElementById('root'));
const configured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
if (!configured) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in this build.');
  root.render(<StartupError configuration />);
} else {
  root.render(<div role="status" style={{ padding: 32, color: '#eee' }}>FRISSON · Загрузка…</div>);
  import('./App.jsx').then(({ default: App }) => {
    root.render(<StrictMode><StartupBoundary><App /></StartupBoundary></StrictMode>);
  }).catch(() => root.render(<StartupError />));
}

if (import.meta.env.PROD && 'serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      console.warn('Offline installation is unavailable; the app remains usable online.');
    });
  });
}
