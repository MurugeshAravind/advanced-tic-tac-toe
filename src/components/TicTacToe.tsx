import useTicTacToe from "../hooks/useTicTacToe";
import type { CSSProperties } from "react";

const TicTacToe = ({ boardSize }: { boardSize: number }) => {
    const { board, resetGame, getStatusMessage, handleClick } = useTicTacToe(boardSize);
  return (
    <div className="game auto" style={{'--board-size': boardSize} as CSSProperties}>
        <div className="status">
            {getStatusMessage()}
        <button className="reset-game" onClick={resetGame}>Reset Game</button>
        </div>
        <div className="board"> 
            {
                board.map((b, index) => <button className="cell" key={index} onClick={() => handleClick(index)} disabled={b !== null}>{b}</button>)
            }
        </div>
    </div>
  )
}

export default TicTacToe