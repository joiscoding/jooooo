import { StrictMode } from 'react';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  createElement(
    StrictMode,
    null,
    createElement(
      BrowserRouter,
      null,
      createElement(
        ThemeProvider,
        null,
        createElement(AlbumsProvider, null, createElement(App)),
      ),
    ),
  ),
);
