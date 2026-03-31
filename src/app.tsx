import { useState, useEffect, useCallback } from 'react';
import { TicTacToe, GridSelector, MIN_GRID_SIZE } from '@/features/game';
import LoginPage from '@/pages/login-page';
import { getAuthenticatedUser, logout } from '@/services/auth';
import { fetchGames, fetchLeaderboard, type GameRecord, type LeaderboardEntry } from '@/services/game-history';
import './app.css';

function App() {
    const [boardSize, setBoardSize] = useState(MIN_GRID_SIZE);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<'game' | 'history' | 'leaderboard'>('game');
    const [history, setHistory] = useState<GameRecord[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

    useEffect(() => {
        getAuthenticatedUser()
            .then(setUsername)
            .finally(() => setLoading(false));
    }, []);

    const handleSignOut = useCallback(async () => {
        await logout();
        setUsername(null);
    }, []);

    const handleToggleHistory = useCallback(async () => {
        if (activeView !== 'history') {
            setHistoryLoading(true);
            setHistoryError(null);
            setActiveView('history');
            try {
                const games = await fetchGames();
                setHistory(games);
            } catch {
                setHistoryError('Failed to load history. Please try again.');
            } finally {
                setHistoryLoading(false);
            }
        } else {
            setActiveView('game');
        }
    }, [activeView]);

    const handleToggleLeaderboard = useCallback(async () => {
        if (activeView !== 'leaderboard') {
            setLeaderboardLoading(true);
            setLeaderboardError(null);
            setActiveView('leaderboard');
            try {
                const entries = await fetchLeaderboard();
                setLeaderboard(entries);
            } catch {
                setLeaderboardError('Failed to load leaderboard. Please try again.');
            } finally {
                setLeaderboardLoading(false);
            }
        } else {
            setActiveView('game');
        }
    }, [activeView]);

    if (loading) return <div className="app-loading">Loading...</div>;

    if (!username) return <LoginPage onSuccess={setUsername} />;

    return (
        <>
            <div className="app-header">
                <span className="app-user">👤 {username}</span>
                <button className="app-history" onClick={handleToggleHistory}>
                    {activeView === 'history' ? 'Back to Game' : 'My History'}
                </button>
                <button className="app-history" onClick={handleToggleLeaderboard}>
                    {activeView === 'leaderboard' ? 'Back to Game' : 'Leaderboard'}
                </button>
                <button className="app-signout" onClick={handleSignOut}>Sign Out</button>
            </div>

            {activeView === 'history' ? (
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
            ) : activeView === 'leaderboard' ? (
                <div className="history-container">
                    <h2>Leaderboard</h2>
                    {leaderboardLoading ? (
                        <p>Loading...</p>
                    ) : leaderboardError ? (
                        <p className="history-error">{leaderboardError}</p>
                    ) : leaderboard.length === 0 ? (
                        <p>No entries yet.</p>
                    ) : (
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>Wins</th>
                                    <th>Draws</th>
                                    <th>Total Games</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, i) => (
                                    <tr key={entry.userId}>
                                        <td>#{i + 1}</td>
                                        <td>{entry.username}</td>
                                        <td>{entry.wins}</td>
                                        <td>{entry.draws}</td>
                                        <td>{entry.totalGames}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="game-area">
                    <GridSelector gridSize={boardSize} onChange={setBoardSize} />
                    <TicTacToe boardSize={boardSize} username={username} key={boardSize} />
                </div>
            )}
        </>
    );
}

export default App;
