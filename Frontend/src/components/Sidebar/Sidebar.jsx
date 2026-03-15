import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('usuario'));
  const isAdmin = user?.tipo === 'admin';

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div className={`menu-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-info">
            <div className="avatar">👤</div>
            <div>
              <p className="user-name">{user?.nome || 'Convidado'}</p>
              <p className="user-role">{isAdmin ? 'Administrador' : 'Cliente'}</p>
            </div>
          </div>
          <button className="close-menu" onClick={onClose}>×</button>
        </div>

        <nav className="sidebar-links">
          <div className="nav-item" onClick={() => handleNavigation('/')}>
            <span className="icon">🏠</span> Home
          </div>

          {!isAdmin && (
            <div className="nav-item" onClick={() => handleNavigation('/meus-agendamentos')}>
              <span className="icon">📅</span> Minhas Reservas
            </div>
          )}

          {isAdmin && (
            <>
              <div className="nav-label">Gerenciamento</div>
              <div className="nav-item" onClick={() => handleNavigation('/admin')}>
                <span className="icon">📊</span> Dashboard
              </div>
              <div className="nav-item" onClick={() => handleNavigation('/admin/schedule')}>
                <span className="icon">⏰</span> Horários dos Barbeiros
              </div>
            </>
          )}

          <div className="nav-label">Conta</div>
          <div className="nav-item" onClick={() => handleNavigation('/perfil')}>
            <span className="icon">👤</span> Meu Perfil
          </div>
          <div className="nav-item logout" onClick={logout}>
            <span className="icon">🚪</span> Sair
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;