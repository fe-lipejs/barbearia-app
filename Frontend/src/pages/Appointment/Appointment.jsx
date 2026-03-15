import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Appointment.css';

function Appointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const barbeiroId = queryParams.get('barbeiroId');

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]); // Horários do banco
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    if (user) setUsuarioLogado(user);
  }, []);

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // BUSCA HORÁRIOS REAIS QUANDO MUDA A DATA
  useEffect(() => {
    if (selectedDate && barbeiroId) {
      setLoadingSlots(true);
      const dataFormatada = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
      
      fetch(`http://localhost:3000/api/barbearia/disponibilidade?barbeiro_id=${barbeiroId}&data=${dataFormatada}`)
        .then(res => res.json())
        .then(dados => {
          setAvailableSlots(dados);
          setLoadingSlots(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingSlots(false);
        });
    }
  }, [selectedDate, barbeiroId]);

  const handleConfirm = async () => {
    if (!usuarioLogado) { navigate('/login'); return; }
    if (!selectedDate || !selectedTime) { alert("Selecione data e hora!"); return; }

    const dataFormatada = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;

    try {
      const response = await fetch('http://localhost:3000/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioLogado.id,
          barbeiro_id: barbeiroId,
          servico_id: 1, 
          data_reserva: dataFormatada,
          horario: selectedTime
        })
      });
      if ((await response.json()).success) {
        alert("✅ Horário reservado!");
        navigate('/');
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="mobile-screen appointment-screen">
      <div className="appointment-header">
        <button className="icon-btn" onClick={() => navigate('/')}>←</button>
        <span className="page-title">Agendamento</span>
        <div className="profile-pic">👤</div>
      </div>

      <div className="calendar-card">
        <h3 className="section-title">Março 2026</h3>
        
        <div className="weekday-header">
          {weekdays.map(d => <span key={d}>{d}</span>)}
        </div>

        <div className="calendar-grid">
          {emptyDays.map(e => <div key={`e-${e}`} className="day-empty"></div>)}
          {daysArray.map(day => {
            const isPast = day < today.getDate();
            return (
              <button 
                key={day} 
                className={`day-btn ${selectedDate === day ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
                disabled={isPast}
                onClick={() => {
                  setSelectedDate(day);
                  setSelectedTime(null); // Reseta a hora ao mudar o dia
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <h3 className="section-title">Horários Disponíveis</h3>
      <div className="time-grid">
        {loadingSlots ? (
          <p className="status-msg">Carregando horários...</p>
        ) : availableSlots.length > 0 ? (
          availableSlots.map(hora => (
            <button 
              key={hora} 
              className={`time-btn ${selectedTime === hora ? 'selected' : ''}`}
              onClick={() => setSelectedTime(hora)}
            >
              {hora}
            </button>
          ))
        ) : (
          <p className="status-msg">{selectedDate ? "Nenhum horário disponível." : "Selecione um dia primeiro."}</p>
        )}
      </div>

      <button className="confirm-btn" onClick={handleConfirm} disabled={!selectedTime}>
        CONFIRMAR AGENDAMENTO
      </button>
    </div>
  );
}

export default Appointment;