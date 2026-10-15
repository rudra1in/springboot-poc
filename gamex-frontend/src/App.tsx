import { Routes, Route, Navigate } from 'react-router-dom';
import SportPage from '@/pages/org/SportPage';

export default function App() {
  return (
    <Routes>
      {/* Sport module routes */}
      <Route path="/configuration/sports/new" element={<SportPage />} />
      <Route path="/configuration/sports/:id/edit" element={<SportPage />} />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/configuration/sports/new" replace />} />
    </Routes>
  );
}
