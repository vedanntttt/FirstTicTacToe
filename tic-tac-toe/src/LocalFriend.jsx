import { useState } from 'react'

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

function LocalFriend({ onBack }) {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div>
      <h2>Play with Local Friend</h2>
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
              cursor: value || winner ? 'not-allowed' : 'pointer',
            }}
          >
            {value}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleRestart}>Restart</button>
        <button onClick={onBack} style={{ marginLeft: '1rem' }}>Back to Menu</button>
      </div>
    </div>
  );
}

export default LocalFriend