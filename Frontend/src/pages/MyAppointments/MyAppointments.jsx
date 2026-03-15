// src/pages/MyAppointments/MyAppointments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAppointments.css';

function MyAppointments() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    if (!usuarioLogado) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:3000/api/agendamentos/usuario/${usuarioLogado.id}`)
      .then(res => res.json())
      .then(dados => setAgendamentos(dados))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="mobile-screen my-appointments-screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <h2>Minhas Reservas</h2>
        <div className="spacer"></div>
      </div>

      <div className="appointments-list">
        {agendamentos.length === 0 ? (
          <p className="empty-msg">Você ainda não tem agendamentos.</p>
        ) : (
          agendamentos.map(ag => (
            <div key={ag.id} className="appointment-card">
              <div className="card-header">
                <span className="date">{new Date(ag.data_reserva).toLocaleDateString('pt-BR')}</span>
                <span className={`status-badge ${ag.status}`}>{ag.status}</span>
              </div>
              <div className="card-body">
                <div className="info">
                  <span className="icon">{ag.barbeiro_icone}</span>
                  <div>
                    <p className="main-text">{ag.barbeiro_nome}</p>
                    <p className="sub-text">{ag.servico_nome}</p>
                  </div>
                </div>
                <div className="time">{ag.horario.substring(0, 5)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyAppointments;