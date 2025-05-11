import { useState } from 'react'
import './App.css'
import VsComputer from './VsComputer'
import LocalFriend from './LocalFriend'
import OnlinePlayer from './OnlinePlayer'
import Login from './Login';
import Signup from './Signup';

function App() {
  const [mode, setMode] = useState('menu')
  const [authStep, setAuthStep] = useState('login'); // 'login' | 'signup' | 'authed'

  const handleBack = () => setMode('menu')

  // Show login/signup until authed
  if (authStep !== 'authed') {
    if (authStep === 'login') {
      return (
        <Login
          onLogin={() => setAuthStep('authed')}
          onSignup={() => setAuthStep('signup')}
          onSkip={() => setAuthStep('authed')}
        />
      );
    }
    if (authStep === 'signup') {
      return (
        <Signup
          onSignup={() => setAuthStep('authed')}
          onBack={() => setAuthStep('login')}
        />
      );
    }
  }

  return (
    <div className="App" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafc 0%, #a1c4fd 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
    }}>
      {mode === 'menu' && (
        <>
          <h1 style={{
            fontSize: '3.5rem',
            color: '#3730a3',
            marginBottom: '0.5rem',
            letterSpacing: '2px',
            textShadow: '2px 2px 8px #e0e7ff',
          }}>
            Tic-Tac-Toe
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#b91c1c',
            marginBottom: '2rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}>
            Choose your game mode and challenge your friends or the computer!
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            maxWidth: 350,
            margin: '0 auto',
            width: '100%',
          }}>
            <button style={{
              background: 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)',
              color: '#3730a3',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(55,48,163,0.08)',
              transition: 'transform 0.1s',
              cursor: 'pointer',
            }} onClick={() => setMode('vs-computer')}>
              🎮 Play vs Computer
            </button>
            <button style={{
              background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)',
              color: '#b91c1c',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(185,28,28,0.08)',
              transition: 'transform 0.1s',
              cursor: 'pointer',
            }} onClick={() => setMode('local-friend')}>
              👥 Play with Local Friend
            </button>
            <button style={{
              background: 'linear-gradient(90deg, #fdfbfb 0%, #ebedee 100%)',
              color: '#059669',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(5,150,105,0.08)',
              transition: 'transform 0.1s',
              cursor: 'pointer',
            }} onClick={() => setMode('online-player')}>
              🌐 Play Online
            </button>
          </div>
          <div style={{ marginTop: '3rem', opacity: 0.7 }}>
            <span style={{ fontSize: '2.5rem', color: '#fbbf24', margin: '0 0.5rem' }}>❌</span>
            <span style={{ fontSize: '2.5rem', color: '#60a5fa', margin: '0 0.5rem' }}>⭕</span>
            <span style={{ fontSize: '2.5rem', color: '#fbbf24', margin: '0 0.5rem' }}>❌</span>
            <span style={{ fontSize: '2.5rem', color: '#60a5fa', margin: '0 0.5rem' }}>⭕</span>
          </div>
        </>
      )}
      {mode === 'vs-computer' && <VsComputer onBack={handleBack} />}
      {mode === 'local-friend' && <LocalFriend onBack={handleBack} />}
      {mode === 'online-player' && <OnlinePlayer onBack={handleBack} />}
    </div>
  )
}

export default App