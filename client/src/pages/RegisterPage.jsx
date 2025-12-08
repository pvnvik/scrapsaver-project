import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.png';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, role });
      login(res.data.token, res.data.user);
      if (role === 'recycler') {
        navigate('/auctions');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-root">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <img src={logo} alt="ScrapSaver Logo" style={{ height: '48px' }} />
        </div>
        <h2>Create account</h2>
        {error && <p className="error-text">{error}</p>}
        <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
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
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">Donor</option>
          <option value="recycler">Recycler</option>
        </select>
        <button type="submit" className="primary-btn full-width">
          Sign up
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
