import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { HomeGallery } from './pages/HomeGallery';
import { LookDetail } from './pages/LookDetail';
import { AlbumsList } from './pages/AlbumsList';
import { AlbumDetail } from './pages/AlbumDetail';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/lookbook" element={<HomeGallery />} />
        <Route path="/look/:lookId" element={<LookDetail />} />
        <Route path="/albums" element={<AlbumsList />} />
        <Route path="/albums/:albumId" element={<AlbumDetail />} />
      </Routes>
    </Layout>
  );
}
