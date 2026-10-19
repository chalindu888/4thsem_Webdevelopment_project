import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // Page එක Refresh වීම වළකී
    setError('');

    try {
      // Backend එකට දත්ත යැවීම
      const data = await registerUser({ name, email, password });
      
      alert(data.message); // "ලියාපදිංචිය සාර්ථකයි!"
      
      // සාර්ථක වූ පසු Login පිටුවට යැවීම
      navigate('/login');

    } catch (err) {
      // Backend එකෙන් එන Error එක පෙන්වීම (උදා: Email එක දැනටමත් ඇත)
      setError(err.message || 'რමක් වැරදුණි.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>නව ගිණුමක් සෑදීම (Signup)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: '10px' }}>
          يلات: <br />
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          Email: <br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          Password: <br />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;