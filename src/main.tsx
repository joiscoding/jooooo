import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import { ThemeProvider, initializeThemeClass } from './context/ThemeContext';
import App from './App';
import './index.css';

initializeThemeClass();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AlbumsProvider>
          <App />
        </AlbumsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
