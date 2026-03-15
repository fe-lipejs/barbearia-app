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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    if (user) setUsuarioLogado(user);
  }, []);

  const timeSlots = [
    { time: "09:00", available: true },
    { time: "10:00", available: false },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
  ];

  // --- LÓGICA DO CALENDÁRIO ORGANIZADO ---
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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
                onClick={() => setSelectedDate(day)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <h3 className="section-title">Horários</h3>
      <div className="time-grid">
        {timeSlots.map(slot => (
          <button 
            key={slot.time}
            className={`time-btn ${selectedTime === slot.time ? 'selected' : ''} ${!slot.available ? 'busy' : ''}`}
            disabled={!slot.available}
            onClick={() => setSelectedTime(slot.time)}
          >
            {slot.time}
          </button>
        ))}
      </div>

      <button className="confirm-btn" onClick={handleConfirm}>
        CONFIRMAR AGENDAMENTO
      </button>
    </div>
  );
}

export default Appointment;