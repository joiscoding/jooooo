import { createElement } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomeGallery } from './pages/HomeGallery';
import { LookDetail } from './pages/LookDetail';
import { AlbumsList } from './pages/AlbumsList';
import { AlbumDetail } from './pages/AlbumDetail';

export default function App() {
  return createElement(Layout, {
    children: createElement(
      Routes,
      null,
      createElement(Route, {
        path: '/',
        element: createElement(HomeGallery),
      }),
      createElement(Route, {
        path: '/look/:lookId',
        element: createElement(LookDetail),
      }),
      createElement(Route, {
        path: '/albums',
        element: createElement(AlbumsList),
      }),
      createElement(Route, {
        path: '/albums/:albumId',
        element: createElement(AlbumDetail),
      })
    ),
  });
}
