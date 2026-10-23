import { createElement as h } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomeGallery } from './pages/HomeGallery';
import { LookDetail } from './pages/LookDetail';
import { AlbumsList } from './pages/AlbumsList';
import { AlbumDetail } from './pages/AlbumDetail';

export default function App() {
  return h(
    Layout,
    null,
    h(
      Routes,
      null,
      h(Route, { path: '/', element: h(HomeGallery) }),
      h(Route, { path: '/look/:lookId', element: h(LookDetail) }),
      h(Route, { path: '/albums', element: h(AlbumsList) }),
      h(Route, { path: '/albums/:albumId', element: h(AlbumDetail) })
    )
  );
}
