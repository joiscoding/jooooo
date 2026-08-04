import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import { CopyFeedbackProvider } from './context/CopyFeedbackContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CopyFeedbackProvider>
        <AlbumsProvider>
          <App />
        </AlbumsProvider>
      </CopyFeedbackProvider>
    </BrowserRouter>
  </StrictMode>
);
