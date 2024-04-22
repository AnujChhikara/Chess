
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PlayingGamePage from './pages/PlayingGamePage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
       
 
        <Route path="/liveGame" element={<PlayingGamePage />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;