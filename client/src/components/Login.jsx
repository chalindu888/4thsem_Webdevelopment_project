import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/client' // Register එකේ පාවිච්චි කළ api client එකම මෙහිදීත් පාවිච්චි කරන්න

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { 
        email, 
        password 
      });
      
      // JWT Token සහ User විස්තර LocalStorage එකේ ගබඩා කිරීම
      localStorage.setItem('secureai_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // සාර්ථකව Login වූ පසු Dashboard වෙත යැවීම
      navigate('/dashboard');

    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>ගිණුමට ඇතුළු වීම (Login)</h2>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <form onSubmit={handleLogin}>
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
        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;