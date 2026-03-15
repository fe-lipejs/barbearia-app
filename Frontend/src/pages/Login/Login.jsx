import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const dados = await response.json();

      if (dados.success) {
        localStorage.setItem('usuario', JSON.stringify(dados.user));
        
        // Direciona conforme o cargo
        if (dados.user.tipo === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setErro(dados.message || "E-mail ou senha inválidos");
      }
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="mobile-screen login-screen">
      <div className="login-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
      </div>
      
      <div className="login-container">
        <div className="login-titles">
          <h1>Bem-vindo</h1>
          <p>Faça login para agendar seu estilo</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {erro && <div className="error-box">{erro}</div>}
          
          <button type="submit" className="login-submit-btn">ENTRAR</button>
        </form>

        <div className="login-footer">
          <p>Ainda não tem conta? <span onClick={() => navigate('/registro')}>Cadastre-se</span></p>
        </div>
      </div>
    </div>
  );
}

export default Login;