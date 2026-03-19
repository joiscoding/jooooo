import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AlbumsProvider } from './context/AlbumsContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LookDetailPage } from './pages/LookDetailPage';
import { AlbumsPage } from './pages/AlbumsPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AlbumsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="looks/:id" element={<LookDetailPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="albums/:id" element={<AlbumDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AlbumsProvider>
    </BrowserRouter>
  );
}
