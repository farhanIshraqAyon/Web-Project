import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Registry from './pages/Registry';
import { Elections, CivicDuty, Admin } from './pages/Placeholders';
import SubmitEvidence from './pages/SubmitEvidence';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="registry" element={<Registry />} />
          <Route path="submit" element={<SubmitEvidence />} />
          <Route path="elections" element={<Elections />} />
          <Route path="civic-duty" element={<CivicDuty />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
