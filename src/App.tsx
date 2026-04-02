import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SearchRouteSync } from './components/SearchRouteSync';
import { HomeGallery } from './pages/HomeGallery';
import { LookDetail } from './pages/LookDetail';
import { AlbumsList } from './pages/AlbumsList';
import { AlbumDetail } from './pages/AlbumDetail';

export default function App() {
  return (
    <Layout>
      <SearchRouteSync />
      <Routes>
        <Route path="/" element={<HomeGallery />} />
        <Route path="/look/:lookId" element={<LookDetail />} />
        <Route path="/albums" element={<AlbumsList />} />
        <Route path="/albums/:albumId" element={<AlbumDetail />} />
      </Routes>
    </Layout>
  );
}
