import { useState } from 'react';
import { TicTacToe, GridSelector, MIN_GRID_SIZE } from '@/features/game';
import './App.css';

function App() {
    const [boardSize, setBoardSize] = useState(MIN_GRID_SIZE);

    return (
        <>
            <GridSelector gridSize={boardSize} onChange={setBoardSize} />
            <TicTacToe boardSize={boardSize} key={boardSize} />
        </>
    );
}

export default App;
