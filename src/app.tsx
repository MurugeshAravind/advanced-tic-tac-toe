import { useState, useEffect, useCallback } from 'react';
import { TicTacToe, GridSelector, MIN_GRID_SIZE } from '@/features/game';
import LoginPage from '@/pages/login-page';
import { getAuthenticatedUser, logout } from '@/services/auth';
import { fetchGames, type GameRecord } from '@/services/game-history';
import './app.css';

function App() {
    const [boardSize, setBoardSize] = useState(MIN_GRID_SIZE);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<GameRecord[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);

    useEffect(() => {
        getAuthenticatedUser()
            .then(setUsername)
            .finally(() => setLoading(false));
    }, []);

    const handleSignOut = async () => {
        await logout();
        setUsername(null);
    };

    const handleToggleHistory = useCallback(async () => {
        if (!showHistory) {
            setHistoryLoading(true);
            setHistoryError(null);
            try {
                const games = await fetchGames();
                setHistory(games);
            } catch {
                setHistoryError('Failed to load history. Please try again.');
            } finally {
                setHistoryLoading(false);
            }
        }
        setShowHistory(prev => !prev);
    }, [showHistory]);

    if (loading) return <div className="app-loading">Loading...</div>;

    if (!username) return <LoginPage onSuccess={setUsername} />;

    return (
        <>
            <div className="app-header">
                <span className="app-user">👤 {username}</span>
                <button className="app-history" onClick={handleToggleHistory}>
                    {showHistory ? 'Back to Game' : 'My History'}
                </button>
                <button className="app-signout" onClick={handleSignOut}>Sign Out</button>
            </div>

            {showHistory ? (
                <div className="history-container">
                    <h2>Game History</h2>
                    {historyLoading ? (
                        <p>Loading...</p>
                    ) : historyError ? (
                        <p className="history-error">{historyError}</p>
                    ) : history.length === 0 ? (
                        <p>No games played yet.</p>
                    ) : (
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Result</th>
                                    <th>Board Size</th>
                                    <th>Played At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(g => (
                                    <tr key={g.gameId}>
                                        <td>{g.winner}</td>
                                        <td>{g.boardSize}x{g.boardSize}</td>
                                        <td>{new Date(g.playedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <>
                    <GridSelector gridSize={boardSize} onChange={setBoardSize} />
                    <TicTacToe boardSize={boardSize} key={boardSize} />
                </>
            )}
        </>
    );
}

export default App;
