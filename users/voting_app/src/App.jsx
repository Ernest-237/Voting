import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Candidates/Home';
import CandidatePage from './components/Candidates/CandidatePage';
import PaymentPopup from './components/Candidates/PaymentPopup';

function App() {
  return (
    <Router>   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voteinfo" element={<PaymentPopup/>} />
        <Route path="/candidate/:id" element={<CandidatePage />} />
      </Routes>
    </Router>
  );
}

export default App;