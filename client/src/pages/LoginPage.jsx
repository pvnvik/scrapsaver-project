import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.user);

      // Go to auctions if recycler, dashboard otherwise
      if (res.data.user.role === 'recycler') {
        navigate('/auctions');
      } else if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-root">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="logo" style={{ fontSize: '2rem' }}>
            <img src={logo} alt="ScrapSaver Logo" style={{ height: '48px' }} />
            ScrapSaver
          </div>
        </div>
        <h2>Log in</h2>
        {error && <p className="error-text">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="primary-btn full-width">
          Continue
        </button>
        <p className="auth-switch">
          New to ScrapSaver? <Link to="/register"><b>Create an account</b></Link>
        </p>
      </form>
    </div>
  );
}
