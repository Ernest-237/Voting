import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Candidates/Home';
import CandidatePage from './components/Candidates/CandidatePage';

function App() {
  return (
    <Router>   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/candidate/:id" element={<CandidatePage />} />
      </Routes>
    </Router>
  );
}

export default App;