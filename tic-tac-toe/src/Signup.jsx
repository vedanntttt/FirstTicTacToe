import { useState } from 'react';

function Signup({ onSignup, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
      } else {
        onSignup();
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
      <h2 style={{ color: '#3730a3', fontSize: '2.5rem', marginBottom: '1rem', textShadow: '2px 2px 8px #e0e7ff' }}>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 300 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '0.8rem', borderRadius: 8, border: '1px solid #a1c4fd', fontSize: '1rem' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '0.8rem', borderRadius: 8, border: '1px solid #a1c4fd', fontSize: '1rem' }} />
        <input type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ padding: '0.8rem', borderRadius: 8, border: '1px solid #a1c4fd', fontSize: '1rem' }} />
        <button type="submit" disabled={loading} style={{ background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)', color: '#3730a3', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', padding: '0.8rem', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
        {error && <div style={{ color: '#b91c1c', fontWeight: 'bold', marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={onBack} style={{ background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)', color: '#b91c1c', fontWeight: 'bold', border: 'none', borderRadius: '8px', padding: '0.7rem 1.2rem', cursor: 'pointer' }}>Back to Login</button>
      </div>
    </div>
  );
}

export default Signup;
