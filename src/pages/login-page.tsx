import { useState } from 'react';
import { login, register, confirmRegistration, resendCode } from '@/services/auth';
import './login-page.css';

type Mode = 'login' | 'signup' | 'confirm';

interface LoginPageProps {
    onSuccess: (username: string) => void;
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                const username = await login(email, password);
                onSuccess(username);
            } else if (mode === 'signup') {
                await register(email, password);
                setMode('confirm');
            } else if (mode === 'confirm') {
                await confirmRegistration(email, code);
                const username = await login(email, password);
                onSuccess(username);
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Tic Tac Toe</h1>

            {mode !== 'confirm' && (
                <div className="login-tabs">
                    <button
                        className={mode === 'login' ? 'active' : ''}
                        onClick={() => { setMode('login'); setEmail(''); setPassword(''); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={mode === 'signup' ? 'active' : ''}
                        onClick={() => { setMode('signup'); setEmail(''); setPassword(''); setError(''); }}
                    >
                        Sign Up
                    </button>
                </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
                {mode === 'confirm' ? (
                    <>
                        <p className="confirm-hint">Check your email <strong>{email}</strong> for a verification code.</p>
                        <input
                            type="text"
                            placeholder="Verification code"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            required
                            autoFocus
                        />
                        <button type="button" className="resend-link" onClick={() => resendCode(email)}>
                            Resend code
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        {mode === 'signup' && (
                            <p className="password-hint">
                                Min 8 characters · uppercase &amp; lowercase · number · special character
                            </p>
                        )}
                    </>
                )}

                {error && <p className="login-error">{error}</p>}

                <button type="submit" className="login-submit" disabled={loading}>
                    {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Verify'}
                </button>
            </form>
        </div>
    );
}
