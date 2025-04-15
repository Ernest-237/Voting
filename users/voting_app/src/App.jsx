import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Candidates/Home';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Admin/AdminLogin'
import VoiceCompetition from './components/Chant/VoiceCompetition';
import CandidatePage from './components/Candidates/CandidatePage';

function App() {
  return (
    <Router>   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/candidate/:id" element={<CandidatePage />} />
        <Route path="/thevoice" element={<VoiceCompetition />} />
      </Routes>
    </Router>
  );
}

export default App;