import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Greška pri loginu');
        return;
      }

      localStorage.setItem('token', data.token);
      onLogin();
      navigate('/todos');

    } catch {
      setError('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', paddingTop: 50 }}>
      <h2 style={{textAlign: 'center'}}>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 20 }}
      />
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button onClick={login} style={{ width: '30%' }}>
        Login
      </button>
      </div>    
      <div style={{display: 'flex', justifyContent: 'center'}}>        
      <p style={{cursor: 'pointer'}} onClick={() => navigate('/register')}>
        You have not account? <span style={{textDecoration: 'underline'}}>Register</span>
      </p>
      </div>  
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
