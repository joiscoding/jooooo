import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import App from './App';
import './index.css';
import './abc-overrides.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AlbumsProvider>
        <App />
      </AlbumsProvider>
    </BrowserRouter>
  </StrictMode>
);
