import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './styles/tailwind.css';
import { AppProviders } from './providers/AppProviders';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

const rawBase = import.meta.env.BASE_URL;
const basename = rawBase === '/' ? undefined : rawBase.replace(/\/$/, '');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);
