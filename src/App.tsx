import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomeGallery } from './pages/HomeGallery';
import { LookDetail } from './pages/LookDetail';
import { AlbumsList } from './pages/AlbumsList';
import { AlbumDetail } from './pages/AlbumDetail';
import { SearchProvider } from './context/SearchContext';

export default function App() {
  return (
    <SearchProvider>
    <Layout>
      <Routes>
        <Route path="/" element={<HomeGallery />} />
        <Route path="/look/:lookId" element={<LookDetail />} />
        <Route path="/albums" element={<AlbumsList />} />
        <Route path="/albums/:albumId" element={<AlbumDetail />} />
      </Routes>
    </Layout>
    </SearchProvider>
  );
}
