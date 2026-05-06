import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import { GallerySearchProvider } from './context/GallerySearchContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GallerySearchProvider>
        <AlbumsProvider>
          <App />
        </AlbumsProvider>
      </GallerySearchProvider>
    </BrowserRouter>
  </StrictMode>
);
