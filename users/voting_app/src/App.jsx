import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Candidates/Home';
import CandidateProfile from './components/Candidates/CandidateProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/candidate/:id" element={<CandidateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;