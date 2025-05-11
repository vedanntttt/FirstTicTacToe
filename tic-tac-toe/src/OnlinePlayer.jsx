import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const socket = io('http://localhost:4000'); // Change if your server runs elsewhere

function OnlinePlayer({ onBack }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [status, setStatus] = useState('Waiting for opponent...');
  const [roomId, setRoomId] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    socket.emit('joinGame');

    socket.on('gameStart', ({ symbol, room }) => {
      setPlayerSymbol(symbol);
      setRoomId(room);
      setStatus(symbol === 'X' ? 'Your turn' : "Opponent's turn");
      setSquares(Array(9).fill(null));
      setXIsNext(true);
      setGameOver(false);
    });

    socket.on('move', ({ squares: newSquares, xIsNext }) => {
      setSquares(newSquares);
      setXIsNext(xIsNext);
      const winner = calculateWinner(newSquares);
      if (winner) {
        setStatus(winner === playerSymbol ? 'You win!' : 'You lose!');
        setGameOver(true);
      } else if (newSquares.every(Boolean)) {
        setStatus('Draw!');
        setGameOver(true);
      } else {
        setStatus(xIsNext === (playerSymbol === 'X') ? 'Your turn' : "Opponent's turn");
      }
    });

    socket.on('opponentLeft', () => {
      setStatus('Opponent left. Waiting for new opponent...');
      setPlayerSymbol(null);
      setRoomId(null);
      setSquares(Array(9).fill(null));
      setGameOver(false);
    });

    return () => {
      socket.off('gameStart');
      socket.off('move');
      socket.off('opponentLeft');
    };
  }, [playerSymbol]);

  function handleClick(i) {
    if (!playerSymbol || gameOver || squares[i]) return;
    if ((xIsNext && playerSymbol !== 'X') || (!xIsNext && playerSymbol !== 'O')) return;
    const nextSquares = squares.slice();
    nextSquares[i] = playerSymbol;
    socket.emit('move', { room: roomId, squares: nextSquares, xIsNext: !xIsNext });
  }

  function handleRestart() {
    if (roomId) {
      socket.emit('restart', { room: roomId });
    }
  }

  useEffect(() => {
    socket.on('restart', () => {
      setSquares(Array(9).fill(null));
      setXIsNext(true);
      setGameOver(false);
      setStatus(playerSymbol === 'X' ? 'Your turn' : "Opponent's turn");
    });
    return () => socket.off('restart');
  }, [playerSymbol]);

  return (
    <div>
      <h2>Play Online</h2>
      <div style={{ margin: '1rem 0' }}>{status}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '15px', justifyContent: 'center', margin: '30px 0' }}>
        {squares.map((value, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{ 
              width: 100, 
              height: 100, 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              background: value ? (value === 'X' ? '#e0e7ff' : '#fee2e2') : '#fff',
              color: value === 'X' ? '#3730a3' : '#b91c1c',
              border: '3px solid #888',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'background 0.2s, color 0.2s',
              cursor: value || gameOver || !playerSymbol ? 'not-allowed' : 'pointer',
            }}
          >
            {value}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleRestart} disabled={!playerSymbol || !roomId}>Restart</button>
        <button onClick={onBack} style={{ marginLeft: '1rem' }}>Back to Menu</button>
      </div>
    </div>
  );
}

export default OnlinePlayer