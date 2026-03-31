import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://7qomogay07.execute-api.us-east-1.amazonaws.com/prod';

async function getToken(): Promise<string> {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (!token) throw new Error('No auth token available');
    return token;
}

export interface GameRecord {
    gameId: string;
    winner: string;
    boardSize: number;
    playedAt: string;
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    wins: number;
    draws: number;
    totalGames: number;
}

export async function saveGame(winner: string, boardSize: number, username: string): Promise<void> {
    const token = await getToken();
    const res = await fetch(`${API_URL}/games`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ winner, boardSize, username }),
    });
    if (!res.ok) throw new Error(`Failed to save game: ${res.status}`);
}

export async function fetchGames(): Promise<GameRecord[]> {
    const token = await getToken();
    const res = await fetch(`${API_URL}/games`, {
        headers: { 'Authorization': token },
    });
    if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
    return res.json();
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${API_URL}/leaderboard`);
    if (!res.ok) throw new Error(`Failed to fetch leaderboard: ${res.status}`);
    return res.json();
}
