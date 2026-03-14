import { TicTacToe } from './features/tic-tac-toe';
import './App.css';
import { useState } from 'react';

function App() {;
  const [boardSize, setBoardSize] = useState(3);

  return (
    <>
   <div className="input">
    <label htmlFor="ip">Grid (between 3 to 5):</label>
    <input id="ip" placeholder='Number of grids needed' type="range" value={boardSize} min={3} max={5} onChange={(e) => setBoardSize(Number(e.target.value))} />
   </div>
    <TicTacToe boardSize={boardSize} key={boardSize} />
    </>
  )
}

export default App
