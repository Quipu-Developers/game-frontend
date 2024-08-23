import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/login';
import Game from './page/game';
import End from './page/end';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/game" element={<Game />} />
        <Route path="/end" element={<End />} />
      </Routes>
    </Router>
  );
}

export default App;
