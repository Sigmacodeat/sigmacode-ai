import 'regenerator-runtime/runtime';
import { createRoot } from 'react-dom/client';
import './locales/i18n';
import App from './App';
import './style.css';
import './mobile.css';
import { ApiErrorBoundaryProvider } from './hooks/ApiErrorBoundaryContext';
import 'katex/dist/katex.min.css';
// Wichtig: KaTeX JS vor dem copy-tex Plugin laden, damit das Plugin seine Hooks registrieren kann
import 'katex/dist/katex.min.js';
import 'katex/dist/contrib/copy-tex.js';
import { initAnalytics } from './analytics/gtm';

const container = document.getElementById('root');
const root = createRoot(container);

// Initialize analytics (no-op outside production or without required envs)
initAnalytics();

root.render(
  <ApiErrorBoundaryProvider>
    <App />
  </ApiErrorBoundaryProvider>,
);
