import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar'; 
import './Home.css';

function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [barbeiros, setBarbeiros] = useState([]);
    const [servicos, setServicos] = useState([]);
    const navigate = useNavigate();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        fetch('http://localhost:3000/api/barbearia/barbeiros')
            .then(res => res.json())
            .then(dados => setBarbeiros(dados));

        fetch('http://localhost:3000/api/barbearia/servicos')
            .then(res => res.json())
            .then(dados => setServicos(dados));
    }, []);

    return (
        <div className="mobile-screen home-screen">
            {/* Menu Lateral Único */}
            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Header Único e Elegante */}
            <header className="home-header">
                <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>
                    <div className="bar"></div>
                    <div className="bar" style={{ width: '15px' }}></div>
                    <div className="bar"></div>
                </button>

                {usuarioLogado ? (
                    <div className="user-greeting" onClick={() => setIsMenuOpen(true)}>
                        <span>Olá, <strong>{usuarioLogado.nome.split(' ')[0]}</strong></span>
                        <div className="avatar-small">👤</div>
                    </div>
                ) : (
                    <button className="profile-btn" onClick={() => navigate('/login')}>👤</button>
                )}
            </header>

            {/* Conteúdo do App */}
            <div className="promo-banner">
                <div className="promo-text">
                    <p className="promo-subtitle">FATHER'S DAY SPECIAL OFFER</p>
                    <h2 className="promo-title">30% OFF</h2>
                </div>
                <div className="promo-icon">👨🏻‍🦳</div>
            </div>

            <h3 className="section-title">Categorias</h3>
            <div className="categories-tabs">
                <span className="tab active">Serviços</span>
                <span className="tab">Preços</span>
            </div>

            <div className="services-list">
                {servicos.map((s) => (
                    <div key={s.id} className="service-item">
                        <div className="service-icon">{s.icone || '✂️'}</div>
                        <p>{s.nome}</p>
                    </div>
                ))}
            </div>

            <h3 className="section-title">Barbeiros Disponíveis</h3>
            <div className="barbers-list">
                {barbeiros.map((b) => (
                    <div key={b.id} className="barber-card" onClick={() => navigate(`/agendamento?barbeiroId=${b.id}`)}>
                        <div className="barber-pic">{b.icone || '👤'}</div>
                        <p className="barber-name">{b.nome}</p>
                        <p className="barber-rating">{'⭐'.repeat(b.estrelas || 5)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;