import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // O nosso "motorista" de rotas
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (dados.success) {
        // --- ADICIONE ESTA LINHA ABAIXO ---
        localStorage.setItem('usuario', JSON.stringify(dados.user));
        
        alert(`Bem-vindo(a), ${dados.user.nome}!`);
        navigate('/');
      } else {
        setErro(dados.message);
      }
  };

  return (
    // Reutilizamos a classe global "mobile-screen"
    <div className="mobile-screen login-screen">
      
      {/* Botão para voltar para a página inicial */}
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Voltar
      </button>

      <div className="logo-container">
        <h1 className="logo-text">BARBERSHOP</h1>
        <p className="est-text">EST ✂ 20</p>
      </div>

      <p className="description">
        Acesse sua conta para gerenciar seus agendamentos ou configure o seu salão.
      </p>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="USUÁRIO"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="SENHA"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="login-button">
          ENTRAR
        </button>
      </form>

      <a href="#" className="create-account">
        Criar uma conta
      </a>
    </div>
  );
}

export default Login;