import TicTacToe from './components/TicTacToe';
import './App.css';
import { useState } from 'react';

function App() {;
  const [boardSize, setBoardSize] = useState(3);

  return (
    <>
    <span>Number of grids needed</span>
    <input id="ip" placeholder='Number of grids needed' type="number" value={boardSize} min={3} max={5} onChange={(e) => setBoardSize(Number(e.target.value))} />
    <TicTacToe boardSize={boardSize} key={boardSize} />
    </>
  )
}

export default App
