
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PlayingGamePage from './pages/PlayingGamePage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage'
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
       
 
        <Route path="/liveGame" element={<PlayingGamePage />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;