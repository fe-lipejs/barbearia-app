import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Admin.css';

function AdminServices() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [servicos, setServicos] = useState([]);
  
  // Estados para o novo serviço
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('30');
  const [icone, setIcone] = useState('✂️');

  const carregarServicos = () => {
    fetch('http://localhost:3000/api/barbearia/servicos')
      .then(res => res.json())
      .then(dados => setServicos(dados));
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const handleSalvarServico = async () => {
    if (!nome || !preco) return alert("Preencha nome e preço!");
    
    // NOTA: Em um app real, você faria um POST para o backend aqui.
    // Como estamos estruturando a interface, vou simular o envio:
    try {
      const res = await fetch('http://localhost:3000/api/admin/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco, duracao, icone })
      });
      if (res.ok) {
        alert("✅ Serviço cadastrado com sucesso!");
        setNome(''); setPreco('');
        carregarServicos();
      }
    } catch (err) {
      console.error(err);
    }
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
          <h2 style={{fontSize: '18px', margin: 0}}>Serviços</h2>
        </div>
        <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
      </header>

      {/* NOVO SERVIÇO */}
      <div className="admin-info-card">
        <h3>Cadastrar Novo Serviço</h3>
        
        <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
          <div style={{flex: 1}}>
            <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>Ícone (Emoji)</label>
            <input type="text" className="time-field" style={{width: '100%', fontSize: '18px'}} value={icone} onChange={e => setIcone(e.target.value)} />
          </div>
          <div style={{flex: 4}}>
            <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>Nome do Serviço</label>
            <input type="text" className="time-field" style={{width: '100%', textAlign: 'left'}} placeholder="Ex: Degradê + Barba" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
        </div>

        <div style={{display: 'flex', gap: '10px'}}>
          <div style={{flex: 1}}>
            <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>Preço (R$)</label>
            <input type="number" className="time-field" style={{width: '100%'}} placeholder="45.00" value={preco} onChange={e => setPreco(e.target.value)} />
          </div>
          <div style={{flex: 1}}>
            <label style={{fontSize: '12px', color: 'var(--text-muted)'}}>Duração</label>
            <select className="time-field" style={{width: '100%'}} value={duracao} onChange={e => setDuracao(e.target.value)}>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1 hora</option>
              <option value="90">1h 30m</option>
            </select>
          </div>
        </div>

        <button className="admin-btn-action" onClick={handleSalvarServico}>SALVAR SERVIÇO</button>
      </div>

      {/* LISTA DE SERVIÇOS */}
      <div className="admin-info-card">
        <h3>Serviços Ativos</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {servicos.map(s => (
            <div key={s.id} className="grade-row" style={{padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <span style={{fontSize: '24px'}}>{s.icone || '✂️'}</span>
                <div>
                  <p style={{margin: 0, fontSize: '14px', fontWeight: 'bold'}}>{s.nome}</p>
                  <p style={{margin: 0, fontSize: '12px', color: 'var(--text-muted)'}}>⏱ {s.duracao || 30} min | 💰 R$ {s.preco}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminServices;