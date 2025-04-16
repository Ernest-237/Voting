import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Candidates/Home';
import AdminPage from './components/Admin/AdminPage';
import MonetbilSyncUtility from './components/Admin/MonetbilSyncUtility';
import CandidatePage from './components/Candidates/CandidatePage';

function App() {
  return (
    <Router>   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/util" element={<MonetbilSyncUtility />} />
        <Route path="/candidate/:id" element={<CandidatePage />} />
      </Routes>
    </Router>
  );
}

export default App;