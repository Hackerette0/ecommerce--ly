// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../libs/axios.js'; 
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', { username, password });      

      if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            navigate('/profile'); 
        }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg = err.response?.data?.message || 'Login failed. Check credentials.';
      setError(errorMsg);
    }
  };
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#FFF5F7',
    }}>
      <div style={{
        background: 'white',
        padding: '40px 50px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(241, 26, 0, 0.08)',
        maxWidth: '420px',
        width: '100%',
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#F11A00',
          marginBottom: '32px',
          fontSize: '28px',
        }}>
          Login to ōly
        </h2>

        {error && (
          <p style={{
            color: '#F11A00',
            background: '#FFECEC',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#444',
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              required
              placeholder="yourusername"
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#444',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px',
                border: '1px solid #ddd',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: '#F11A00',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '17px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#d10f00')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#F11A00')}
          >
            Sign In
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#666',
        }}>
          Don't have an account?{' '}
          <a
            href="/register"
            style={{
              color: '#F11A00',
              fontWeight: '500',
              textDecoration: 'none',
            }}
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;