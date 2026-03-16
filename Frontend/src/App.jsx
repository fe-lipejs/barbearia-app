import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Appointment from './pages/Appointment/Appointment';
import MyAppointments from './pages/MyAppointments/MyAppointments';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminSchedule from './pages/Admin/AdminSchedule';
import AdminServices from './pages/Admin/AdminServices';
import './styles/global.css';

function App() {
  useEffect(() => {
    fetch('http://localhost:3000/api/barbearia/config/tema')
      .then(res => res.json())
      .then(data => {
        const novoTema = data.valor || 'classic';
        document.documentElement.setAttribute('data-theme', novoTema);
      })
      .catch(() => {
        document.documentElement.setAttribute('data-theme', 'classic');
      });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/agendamento" element={<Appointment />} />
          <Route path="/meus-agendamentos" element={<MyAppointments />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/schedule" element={<AdminSchedule />} />
          <Route path="/admin/servicos" element={<AdminServices />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;