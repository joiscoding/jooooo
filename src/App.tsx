import { Routes, Route } from 'react-router-dom';
import { FascoLanding } from './pages/FascoLanding';
import './fasco.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FascoLanding />} />
    </Routes>
  );
}
