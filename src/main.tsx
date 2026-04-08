import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import { CatalogProvider } from './context/CatalogContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogProvider>
        <AlbumsProvider>
          <App />
        </AlbumsProvider>
      </CatalogProvider>
    </BrowserRouter>
  </StrictMode>
);
