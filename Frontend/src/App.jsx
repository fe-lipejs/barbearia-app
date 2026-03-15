// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';

// Importando as páginas
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Appointment from './pages/Appointment/Appointment'; // PÁGINA NOVA IMPORTADA

function App() {
  // Esse estado será alimentado pelo Banco de Dados no futuro
  const [theme, setTheme] = useState('classic'); 

  return (
    <div className="app-container" data-theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* NOVA ROTA ADICIONADA: /agendamento */}
          <Route path="/agendamento" element={<Appointment />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;