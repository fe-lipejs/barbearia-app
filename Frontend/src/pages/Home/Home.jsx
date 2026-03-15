import React, { useState, useEffect } from 'react'; // Adicionamos useState e useEffect
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    // 1. ESTADOS: Criamos "caixas" para guardar os dados que virão do MySQL
    const [barbeiros, setBarbeiros] = useState([]);
    const [servicos, setServicos] = useState([]);
    
    // 2. USUÁRIO: Pegamos os dados de quem logou lá no localStorage
    const usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

    // 3. BUSCA NO BANCO: Essa função roda assim que você abre o app
    useEffect(() => {
        // Busca Barbeiros no seu Node.js
        fetch('http://localhost:3000/api/barbearia/barbeiros')
            .then(res => res.json())
            .then(dados => setBarbeiros(dados))
            .catch(err => console.error("Erro ao carregar barbeiros", err));

        // Busca Serviços no seu Node.js
        fetch('http://localhost:3000/api/barbearia/servicos')
            .then(res => res.json())
            .then(dados => setServicos(dados))
            .catch(err => console.error("Erro ao carregar serviços", err));
    }, []);

    // Função para deslogar
    const handleLogout = () => {
        localStorage.removeItem('usuario');
        window.location.reload(); // Recarrega a página para atualizar o topo
    };

    return (
        <div className="mobile-screen home-screen">

            {/* Cabeçalho Dinâmico */}
            <div className="home-header">
                <div className="menu-icon">☰</div>
                
                {/* Se o usuário estiver logado, mostra o nome e o botão sair */}
                {usuarioLogado ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            Olá, {usuarioLogado.nome.split(' ')[0]}!
                        </span>
                        <button onClick={handleLogout} className="logout-small-btn">
                            (Sair)
                        </button>
                    </div>
                ) : (
                    <button className="profile-btn" onClick={() => navigate('/login')}>
                        👤
                    </button>
                )}
            </div>

            {/* Banner de Promoção */}
            <div className="promo-banner">
                <div className="promo-text">
                    <p className="promo-subtitle">FATHER'S DAY SPECIAL OFFER</p>
                    <h2 className="promo-title">30% OFF</h2>
                    <p className="promo-desc">FOR THOSE OVER 45 YEARS OLD</p>
                </div>
                <div className="promo-icon">👨🏻‍🦳</div>
            </div>

            <h3 className="section-title">Categories</h3>
            <div className="categories-tabs">
                <span className="tab">All</span>
                <span className="tab active">Services</span>
                <span className="tab">Price</span>
                <span className="tab">Promo</span>
            </div>

            {/* 4. LISTA DE SERVIÇOS DINÂMICA */}
            <div className="services-list">
                {servicos.map((s) => (
                    <div key={s.id} className="service-item">
                        <div className="service-icon">{s.icone}</div>
                        <p>{s.nome}</p>
                    </div>
                ))}
            </div>

            <h3 className="section-title">Available Barbers</h3>
            
            {/* 5. LISTA DE BARBEIROS DINÂMICA */}
            <div className="barbers-list">
                {barbeiros.map((b) => (
                    <div 
                        key={b.id} 
                        className="barber-card" 
                        onClick={() => navigate(`/agendamento?barbeiroId=${b.id}`)}
                    >
                        <div className="barber-pic">{b.icone}</div>
                        <p className="barber-name">{b.nome}</p>
                        <p className="barber-rating">
                            {'⭐'.repeat(b.estrelas)}<br />
                            <span>{b.votos} Votes</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;