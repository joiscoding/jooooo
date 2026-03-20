import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingLayout } from './components/LandingLayout';
import { LandingPage } from './pages/LandingPage';
import { HomeGallery } from './pages/HomeGallery';
import { LookDetail } from './pages/LookDetail';
import { AlbumsList } from './pages/AlbumsList';
import { AlbumDetail } from './pages/AlbumDetail';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingLayout>
            <LandingPage />
          </LandingLayout>
        }
      />
      <Route path="/gallery" element={<Layout><HomeGallery /></Layout>} />
      <Route path="/look/:lookId" element={<Layout><LookDetail /></Layout>} />
      <Route path="/albums" element={<Layout><AlbumsList /></Layout>} />
      <Route path="/albums/:albumId" element={<Layout><AlbumDetail /></Layout>} />
    </Routes>
  );
}
