import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomeGallery } from './pages/HomeGallery';
import { LookDetail } from './pages/LookDetail';
import { AlbumsList } from './pages/AlbumsList';
import { AlbumDetail } from './pages/AlbumDetail';
import { WebhookLab } from './pages/WebhookLab';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeGallery />} />
        <Route path="/look/:lookId" element={<LookDetail />} />
        <Route path="/albums" element={<AlbumsList />} />
        <Route path="/albums/:albumId" element={<AlbumDetail />} />
        <Route path="/webhooks" element={<WebhookLab />} />
      </Routes>
    </Layout>
  );
}
