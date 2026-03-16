import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Admin.css';

const gradePadrao = [
  { dia: 0, nome: 'Domingo', inicio: '08:00', fim: '12:00', almoco_in: '', almoco_out: '', ativo: false }, // Geralmente começa desativado
  { dia: 1, nome: 'Segunda', inicio: '08:00', fim: '18:00', almoco_in: '12:00', almoco_out: '13:00', ativo: true },
  { dia: 2, nome: 'Terça', inicio: '08:00', fim: '18:00', almoco_in: '12:00', almoco_out: '13:00', ativo: true },
  { dia: 3, nome: 'Quarta', inicio: '08:00', fim: '18:00', almoco_in: '12:00', almoco_out: '13:00', ativo: true },
  { dia: 4, nome: 'Quinta', inicio: '08:00', fim: '18:00', almoco_in: '12:00', almoco_out: '13:00', ativo: true },
  { dia: 5, nome: 'Sexta', inicio: '08:00', fim: '18:00', almoco_in: '12:00', almoco_out: '13:00', ativo: true },
  { dia: 6, nome: 'Sábado', inicio: '08:00', fim: '13:00', almoco_in: '', almoco_out: '', ativo: true },
];
function AdminSchedule() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [barbeiros, setBarbeiros] = useState([]);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState('');
  
  const [dataBloqueioGeral, setDataBloqueioGeral] = useState('');
  const [listaBloqueios, setListaBloqueios] = useState([]); // Guarda os feriados
  
  const [grade, setGrade] = useState(gradePadrao);

  // Carrega Barbeiros e Feriados ao abrir a tela
  useEffect(() => {
    fetch('http://localhost:3000/api/barbearia/barbeiros')
      .then(res => res.json())
      .then(dados => setBarbeiros(dados));

    carregarBloqueios();
  }, []);

  const carregarBloqueios = () => {
    fetch('http://localhost:3000/api/admin/bloqueios-gerais')
      .then(res => res.json())
      .then(dados => setListaBloqueios(dados))
      .catch(err => console.error("Erro ao carregar bloqueios", err));
  };

  // Toda vez que você escolhe um barbeiro, busca a grade real dele
  useEffect(() => {
    if (!selectedBarbeiro) {
      setGrade(gradePadrao);
      return;
    }

    fetch(`http://localhost:3000/api/admin/horarios-trabalho/${selectedBarbeiro}`)
      .then(async res => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then(dadosNoBanco => {
        if (dadosNoBanco.length > 0) {
          const gradeAtualizada = gradePadrao.map(diaPadrao => {
            const diaSalvo = dadosNoBanco.find(d => d.dia_semana === diaPadrao.dia);
            if (diaSalvo) {
              return {
                ...diaPadrao,
                inicio: diaSalvo.hora_inicio?.substring(0, 5) || diaPadrao.inicio,
                fim: diaSalvo.hora_fim?.substring(0, 5) || diaPadrao.fim,
                almoco_in: diaSalvo.almoco_inicio?.substring(0, 5) || '',
                almoco_out: diaSalvo.almoco_fim?.substring(0, 5) || '',
                ativo: diaSalvo.ativo === 1 || diaSalvo.ativo === true
              };
            }
            return diaPadrao;
          });
          setGrade(gradeAtualizada);
        } else {
          setGrade(gradePadrao);
        }
      })
      .catch(err => {
        console.error("Erro ao buscar grade. O barbeiro deve ser novo.", err);
        setGrade(gradePadrao);
      });
  }, [selectedBarbeiro]);

  const handleUpdateGrade = (index, campo, valor) => {
    const novaGrade = [...grade];
    novaGrade[index][campo] = valor;
    setGrade(novaGrade);
  };

  const salvarGrade = async () => {
    if (!selectedBarbeiro) return alert("Selecione um barbeiro!");
    const res = await fetch('http://localhost:3000/api/admin/horarios-trabalho', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barbeiro_id: selectedBarbeiro, grade })
    });
    if (res.ok) alert("✅ Agenda semanal salva!");
  };

  // Adiciona um bloqueio
  const bloquearBarbearia = async () => {
    if (!dataBloqueioGeral) return alert("Selecione uma data!");
    const res = await fetch('http://localhost:3000/api/admin/bloqueio-geral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: dataBloqueioGeral, motivo: "Fechado" })
    });
    if (res.ok) {
      alert("🏢 Data bloqueada!");
      setDataBloqueioGeral('');
      carregarBloqueios(); // Atualiza a lista na hora
    }
  };

  // Remove um bloqueio
  const removerBloqueio = async (id) => {
    if(!window.confirm("Deseja reabrir a loja neste dia?")) return;
    
    const res = await fetch(`http://localhost:3000/api/admin/bloqueio-geral/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      carregarBloqueios(); // Atualiza a lista na hora
    }
  };

  // Função para formatar a data que vem do banco (YYYY-MM-DD para DD/MM/YYYY)
  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    // Compensa o fuso horário
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="mobile-screen admin-screen">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="admin-header" style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>
            <div className="bar"></div>
            <div className="bar" style={{ width: '15px' }}></div>
            <div className="bar"></div>
          </button>
          <h2>Agenda</h2>
        </div>
        <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
      </header>

      {/* GESTÃO DE FERIADOS / LOJA FECHADA */}
      <div className="admin-info-card" style={{borderColor: 'rgba(255,77,77,0.3)'}}>
        <h3 style={{color: '#ff4d4d'}}>Gerenciar Datas Fechadas</h3>
        <p style={{fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px'}}>Bloqueia a barbearia inteira para todos os profissionais.</p>
        
        <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
          <input type="date" className="time-field" style={{flex: 1, width: 'auto'}} value={dataBloqueioGeral} onChange={e => setDataBloqueioGeral(e.target.value)} />
          <button className="admin-btn-logout" style={{margin: 0, padding: '10px'}} onClick={bloquearBarbearia}>BLOQUEAR</button>
        </div>

        {/* Lista de dias bloqueados */}
        {listaBloqueios.length > 0 && (
          <div style={{background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {listaBloqueios.map(b => (
              <div key={b.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px'}}>
                <span style={{fontSize: '14px'}}>🗓️ {formatarData(b.data_bloqueio)}</span>
                <button onClick={() => removerBloqueio(b.id)} style={{background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '16px'}}>🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GESTÃO INDIVIDUAL */}
      <div className="admin-info-card">
        <h3>Grade do Profissional</h3>
        <select className="time-field" style={{width: '100%'}} value={selectedBarbeiro} onChange={(e) => setSelectedBarbeiro(e.target.value)}>
          <option value="">Escolha o profissional...</option>
          {barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
        </select>
      </div>

      {/* GRADE DE HORÁRIOS */}
      <div className="admin-info-card">
        <h3>Semana e Almoço</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          {grade.map((d, index) => (
            <div key={d.dia} className="grade-row" style={{opacity: d.ativo ? 1 : 0.4}}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span className="day-label">{d.nome}</span>
                <label style={{fontSize: '10px', color: 'var(--accent)', marginTop: '4px'}}>
                  <input type="checkbox" checked={d.ativo} onChange={e => handleUpdateGrade(index, 'ativo', e.target.checked)} /> Trabalha?
                </label>
              </div>

              {d.ativo && (
                <div className="time-inputs" style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                  <div style={{display: 'flex', gap: '5px', marginBottom: '4px'}}>
                    <input type="time" className="time-field" value={d.inicio} onChange={e => handleUpdateGrade(index, 'inicio', e.target.value)} />
                    <input type="time" className="time-field" value={d.fim} onChange={e => handleUpdateGrade(index, 'fim', e.target.value)} />
                  </div>
                  <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                    <span style={{fontSize: '10px', color: 'var(--text-muted)'}}>Almoço:</span>
                    <input type="time" className="time-field" style={{padding: '4px 8px', width: '70px'}} value={d.almoco_in} onChange={e => handleUpdateGrade(index, 'almoco_in', e.target.value)} />
                    <input type="time" className="time-field" style={{padding: '4px 8px', width: '70px'}} value={d.almoco_out} onChange={e => handleUpdateGrade(index, 'almoco_out', e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="admin-btn-action" onClick={salvarGrade}>SALVAR GRADE DELE</button>
      </div>
    </div>
  );
}

export default AdminSchedule;