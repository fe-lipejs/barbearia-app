import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar'; 
import './Admin.css';

function AdminDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

  return (
    <div className="mobile-screen admin-screen">
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="admin-header" style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
        <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>
          <div className="bar"></div>
          <div className="bar" style={{ width: '15px' }}></div>
          <div className="bar"></div>
        </button>
        <h2 style={{fontSize: '18px', margin: 0}}>Painel Admin</h2>
        <div className="avatar-small">⚙️</div>
      </header>

      <div className="admin-menu-grid">
        <div className="menu-card" onClick={() => navigate('/admin/schedule')}>
          <span className="icon">📅</span>
          <p>Agenda e Horários</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/admin/servicos')}>
          <span className="icon">✂️</span>
          <p>Serviços</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/admin/clientes')}>
          <span className="icon">👥</span>
          <p>Clientes</p>
        </div>

        <div className="menu-card" onClick={() => navigate('/admin/config')}>
          <span className="icon">🎨</span>
          <p>Cores e Banners</p>
        </div>
      </div>

      <div className="admin-info-card">
        <h3>Status do Sistema</h3>
        <p style={{fontSize: '14px', color: 'var(--text-main)'}}>Logado como: <strong>{usuarioLogado?.nome}</strong></p>
      </div>

      <button className="admin-btn-logout" onClick={() => {
        localStorage.removeItem('usuario');
        navigate('/login');
      }}>SAIR DO SISTEMA</button>
    </div>
  );
}

export default AdminDashboard;