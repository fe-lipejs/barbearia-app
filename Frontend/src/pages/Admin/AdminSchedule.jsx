import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminSchedule() {
  const navigate = useNavigate();
  const [barbeiros, setBarbeiros] = useState([]);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState('');
  
  const [grade, setGrade] = useState([
    { dia: 1, nome: 'Segunda', inicio: '08:00', fim: '18:00' },
    { dia: 2, nome: 'Terça', inicio: '08:00', fim: '18:00' },
    { dia: 3, nome: 'Quarta', inicio: '08:00', fim: '18:00' },
    { dia: 4, nome: 'Quinta', inicio: '08:00', fim: '18:00' },
    { dia: 5, nome: 'Sexta', inicio: '08:00', fim: '18:00' },
    { dia: 6, nome: 'Sábado', inicio: '08:00', fim: '13:00' },
  ]);

  useEffect(() => {
    fetch('http://localhost:3000/api/barbearia/barbeiros')
      .then(res => res.json())
      .then(dados => setBarbeiros(dados));
  }, []);

  const salvarGrade = async () => {
    if (!selectedBarbeiro) return alert("Selecione um barbeiro!");
    const res = await fetch('http://localhost:3000/api/admin/horarios-trabalho', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barbeiro_id: selectedBarbeiro, grade })
    });
    if (res.ok) alert("✅ Agenda atualizada!");
  };

  return (
    <div className="mobile-screen admin-screen">
      <div className="admin-header">
        <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
        <h2>Configurar Agenda</h2>
      </div>

      <div className="admin-info-card">
        <h3>Profissional</h3>
        <select 
          style={{width: '100%', padding: '12px', borderRadius: '10px', background: '#2a2a2a', color: 'white', border: '1px solid #444'}}
          value={selectedBarbeiro} 
          onChange={(e) => setSelectedBarbeiro(e.target.value)}
        >
          <option value="">Escolha o barbeiro...</option>
          {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
      </div>

      <div className="admin-info-card">
        <h3>Horários por Dia</h3>
        {grade.map((d, index) => (
          <div key={d.dia} className="grade-row">
            <span className="day-label">{d.nome}</span>
            <div className="time-inputs">
              <input type="time" className="time-field" value={d.inicio} onChange={e => {
                const nova = [...grade]; nova[index].inicio = e.target.value; setGrade(nova);
              }} />
              <span style={{color: '#666'}}>-</span>
              <input type="time" className="time-field" value={d.fim} onChange={e => {
                const nova = [...grade]; nova[index].fim = e.target.value; setGrade(nova);
              }} />
            </div>
          </div>
        ))}
        <button className="admin-btn-action" onClick={salvarGrade}>SALVAR ALTERAÇÕES</button>
      </div>
    </div>
  );
}

export default AdminSchedule;