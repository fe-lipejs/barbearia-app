import React from 'react';
import './App.css';

function Home({ onBack }) {
  return (
    <div className="home-screen">
      {/* Cabeçalho */}
      <div className="home-header">
        <button className="icon-btn" onClick={onBack}>←</button>
        <div className="profile-pic">👤</div>
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

      {/* Abas de Categorias */}
      <h3 className="section-title">Categories</h3>
      <div className="categories-tabs">
        <span className="tab">All</span>
        <span className="tab active">Services</span>
        <span className="tab">Price</span>
        <span className="tab">Promo</span>
      </div>

      {/* Ícones de Serviços */}
      <div className="services-list">
        <div className="service-item">
          <div className="service-icon">✂️</div>
          <p>Haircut</p>
        </div>
        <div className="service-item">
          <div className="service-icon">🪒</div>
          <p>Shaving</p>
        </div>
        <div className="service-item">
          <div className="service-icon">🧴</div>
          <p>Creambath</p>
        </div>
      </div>

      {/* Lista de Barbeiros */}
      <h3 className="section-title">Available Barbers</h3>
      <div className="barbers-list">
        <div className="barber-card">
          <div className="barber-pic">👨🏼‍🦰</div>
          <p className="barber-name">Edwin</p>
          <p className="barber-rating">⭐⭐⭐⭐⭐<br/><span>340 Votes</span></p>
        </div>
        <div className="barber-card">
          <div className="barber-pic">👩🏻</div>
          <p className="barber-name">Cindy</p>
          <p className="barber-rating">⭐⭐⭐⭐⭐<br/><span>240 Votes</span></p>
        </div>
        <div className="barber-card">
          <div className="barber-pic">👦🏻</div>
          <p className="barber-name">Bryan</p>
          <p className="barber-rating">⭐⭐⭐⭐⭐<br/><span>230 Votes</span></p>
        </div>
      </div>
    </div>
  );
}

export default Home;