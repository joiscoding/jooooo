import { Routes, Route } from 'react-router-dom';
import { LookbookLayout } from './components/LookbookLayout';
import { LandingPage } from './pages/LandingPage';
import { HomeGallery } from './pages/HomeGallery';
import { LookDetail } from './pages/LookDetail';
import { AlbumsList } from './pages/AlbumsList';
import { AlbumDetail } from './pages/AlbumDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/lookbook"
        element={
          <LookbookLayout>
            <HomeGallery />
          </LookbookLayout>
        }
      />
      <Route
        path="/look/:lookId"
        element={
          <LookbookLayout>
            <LookDetail />
          </LookbookLayout>
        }
      />
      <Route
        path="/albums"
        element={
          <LookbookLayout>
            <AlbumsList />
          </LookbookLayout>
        }
      />
      <Route
        path="/albums/:albumId"
        element={
          <LookbookLayout>
            <AlbumDetail />
          </LookbookLayout>
        }
      />
    </Routes>
  );
}
