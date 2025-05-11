import { useState } from 'react';

function Login({ onLogin, onSignup, onSkip }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        onLogin();
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f9fafc 0%, #a1c4fd 100%)', width: '100vw',
    }}>
      <h2 style={{ color: '#3730a3', fontSize: '2.5rem', marginBottom: '1rem', textShadow: '2px 2px 8px #e0e7ff' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 300 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '0.8rem', borderRadius: 8, border: '1px solid #a1c4fd', fontSize: '1rem' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '0.8rem', borderRadius: 8, border: '1px solid #a1c4fd', fontSize: '1rem' }} />
        <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)', color: '#3730a3', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', padding: '0.8rem', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <div style={{ color: '#b91c1c', fontWeight: 'bold', marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button onClick={onSignup} style={{ background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)', color: '#b91c1c', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', cursor: 'pointer' }}>Go to Signup</button>
        <button onClick={onSkip} style={{ background: 'linear-gradient(90deg, #fdfbfb 0%, #ebedee 100%)', color: '#059669', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', cursor: 'pointer' }}>Skip</button>
      </div>
    </div>
  );
}

export default Login;
