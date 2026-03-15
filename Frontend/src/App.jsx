import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Appointment from './pages/Appointment/Appointment';
import MyAppointments from './pages/MyAppointments/MyAppointments';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminSchedule from './pages/Admin/AdminSchedule';
import './styles/global.css'; // Verifique se o caminho está correto!

function App() {
  const [tema, setTema] = useState('classic');

  useEffect(() => {
    // 1. Busca o tema no seu banco
    fetch('http://localhost:3000/api/barbearia/config/tema')
      .then(res => res.json())
      .then(data => {
        const novoTema = data.valor || 'classic';
        setTema(novoTema);
        
        // 2. AQUI O SEGREDO: Aplica o [data-theme] no <html> ou <body>
        // Isso ativa as variáveis do seu global.css
        document.documentElement.setAttribute('data-theme', novoTema);
      })
      .catch(err => {
        console.error("Erro ao carregar tema:", err);
        document.documentElement.setAttribute('data-theme', 'classic');
      });
  }, []);

  return (
    <Router>
      {/* O app-container é o fundo que reage ao tema (--bg-outside) */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agendamento" element={<Appointment />} />
          <Route path="/meus-agendamentos" element={<MyAppointments />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/schedule" element={<AdminSchedule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;