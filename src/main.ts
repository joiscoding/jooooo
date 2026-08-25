import { createElement as h, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  h(StrictMode, null, h(BrowserRouter, null, h(AlbumsProvider, null, h(App))))
);
