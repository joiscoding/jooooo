import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  createElement(
    StrictMode,
    null,
    createElement(
      BrowserRouter,
      null,
      createElement(AlbumsProvider, null, createElement(App))
    )
  )
);
