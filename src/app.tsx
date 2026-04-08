import { useState, useEffect, useCallback, type FormEvent } from 'react';
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
    const [playerNames, setPlayerNames] = useState<{ X: string; O: string } | null>(null);
    const [xInput, setXInput] = useState('');
    const [oInput, setOInput] = useState('');

    useEffect(() => {
        getAuthenticatedUser()
            .then(setUsername)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (username) setXInput(prev => prev || username.split('@')[0]);
    }, [username]);

    const handleSignOut = useCallback(async () => {
        await logout();
        setUsername(null);
        setPlayerNames(null);
        setXInput('');
        setOInput('');
    }, []);

    const handleStartGame = useCallback((e: FormEvent) => {
        e.preventDefault();
        if (xInput.trim() && oInput.trim()) {
            setPlayerNames({ X: xInput.trim(), O: oInput.trim() });
        }
    }, [xInput, oInput]);

    const handleChangePlayers = useCallback(() => {
        setPlayerNames(null);
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
                <span className="app-user" title={username}>👤 {username.split('@')[0]}</span>
                <button className={`app-history${activeView === 'history' ? ' active' : ''}`} onClick={handleToggleHistory}>
                    {activeView === 'history' ? 'Back to Game' : 'My History'}
                </button>
                <button className={`app-history${activeView === 'leaderboard' ? ' active' : ''}`} onClick={handleToggleLeaderboard}>
                    {activeView === 'leaderboard' ? 'Back to Game' : 'Leaderboard'}
                </button>
                {activeView === 'game' && playerNames && (
                    <button className="app-history" onClick={handleChangePlayers}>Change Players</button>
                )}
                <button className="app-signout" onClick={handleSignOut}>Sign Out</button>
            </div>

            {activeView === 'history' ? (
                <div className="history-container">
                    <h2>Recent Games</h2>
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
                                    <th>Won By</th>
                                    <th>Board Size</th>
                                    <th>Played At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...history]
                                    .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
                                    .slice(0, 2)
                                    .map(g => (
                                    <tr key={g.gameId}>
                                        <td data-label="Won By">{g.winner === 'Draw' ? 'Draw' : g.winner.replace(/ Won$/, '')}</td>
                                        <td data-label="Board">{g.boardSize}x{g.boardSize}</td>
                                        <td data-label="Played At">{new Date(g.playedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : activeView === 'leaderboard' ? (
                <div className="history-container leaderboard">
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
                                        <td data-label="Rank">#{i + 1}</td>
                                        <td data-label="Player">{entry.username}</td>
                                        <td data-label="Wins">{entry.wins}</td>
                                        <td data-label="Draws">{entry.draws}</td>
                                        <td data-label="Total">{entry.totalGames}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="game-area">
                    <h1 className="game-title">TIC TAC TOE</h1>
                    {!playerNames ? (
                        <form className="player-setup" onSubmit={handleStartGame}>
                            <p className="player-setup-title">Who's Playing?</p>
                            <div className="player-setup-cards">
                                <div className="player-setup-card player-setup-x">
                                    <label htmlFor="player-x-name">Player X</label>
                                    <input
                                        id="player-x-name"
                                        type="text"
                                        value={xInput}
                                        onChange={e => setXInput(e.target.value)}
                                        placeholder="Enter name"
                                        autoFocus
                                        maxLength={20}
                                    />
                                </div>
                                <span className="player-setup-vs">VS</span>
                                <div className="player-setup-card player-setup-o">
                                    <label htmlFor="player-o-name">Player O</label>
                                    <input
                                        id="player-o-name"
                                        type="text"
                                        value={oInput}
                                        onChange={e => setOInput(e.target.value)}
                                        placeholder="Enter name"
                                        maxLength={20}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="player-setup-start"
                                disabled={!xInput.trim() || !oInput.trim()}
                            >
                                Start Game
                            </button>
                        </form>
                    ) : (
                        <>
                            <GridSelector gridSize={boardSize} onChange={setBoardSize} />
                            <TicTacToe boardSize={boardSize} username={username} playerNames={playerNames} key={boardSize} />
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default App;
