import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onOfflineReady() {
      window.dispatchEvent(new CustomEvent('cbmmg-pwa-offline-ready'));
    },
  });
}

createRoot(document.getElementById('root')!).render(<App />);
