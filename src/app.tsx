import { useState, useEffect } from 'react';
import { TicTacToe, GridSelector, MIN_GRID_SIZE } from '@/features/game';
import LoginPage from '@/pages/login-page';
import { getAuthenticatedUser, logout } from '@/services/auth';
import './app.css';

function App() {
    const [boardSize, setBoardSize] = useState(MIN_GRID_SIZE);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuthenticatedUser()
            .then(setUsername)
            .finally(() => setLoading(false));
    }, []);

    const handleSignOut = async () => {
        await logout();
        setUsername(null);
    };

    if (loading) return <div className="app-loading">Loading...</div>;

    if (!username) return <LoginPage onSuccess={setUsername} />;

    return (
        <>
            <div className="app-header">
                <span className="app-user">👤 {username}</span>
                <button className="app-signout" onClick={handleSignOut}>Sign Out</button>
            </div>
            <GridSelector gridSize={boardSize} onChange={setBoardSize} />
            <TicTacToe boardSize={boardSize} key={boardSize} />
        </>
    );
}

export default App;
