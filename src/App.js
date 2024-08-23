import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './page/lobby';
import Game from './page/waitingRoom';
import End from './page/end';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/game" element={<Game />} />
        <Route path="/end" element={<End />} />
      </Routes>
    </Router>
  );
}

export default App;
