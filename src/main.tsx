import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app/App';
import './styles/global.css';
import './styles/auth.css';
import './styles/landing.css';
import './styles/home.css';
import './styles/categories.css';
import './styles/quiz-play.css';
import './styles/defis.css';
import './styles/gains-profile.css';

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
