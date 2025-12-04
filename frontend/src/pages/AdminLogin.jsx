import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('aura_admin_token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto' }}>
      <div className="aura-card">
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Admin login</h1>
        <p style={{ fontSize: '14px', color: 'var(--aura-text-muted)', marginBottom: '16px' }}>
          Sign in to manage events, invites, and check‑ins.
        </p>
        {error && <div className="aura-error" style={{ marginBottom: '12px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="aura-input"
              placeholder="admin@aura.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="aura-input"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="aura-btn aura-btn-primary" style={{ width: '100%', marginTop: '4px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
