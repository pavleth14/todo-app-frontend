import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const register = async () => {    

    setError('');

    if (password !== passwordConfirm) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password, password_confirmation: passwordConfirm}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Greška pri registraciji');
        return;
      }

      localStorage.setItem('token', data.token);
      alert('Uspešno registrovan!');

      navigate('/login');
    } catch {
      setError('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', paddingTop: 50 }}>
      <h2 style={{textAlign: 'center'}}>Registration</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={passwordConfirm}
        onChange={e => setPasswordConfirm(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button onClick={register} style={{ width: '30%' }}>
        Register
      </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
