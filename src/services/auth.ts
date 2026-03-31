import {
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    fetchUserAttributes,
    resendSignUpCode,
} from 'aws-amplify/auth';

export async function login(email: string, password: string): Promise<string> {
    const { isSignedIn } = await signIn({ username: email, password });
    if (!isSignedIn) throw new Error('Sign in failed');
    const attrs = await fetchUserAttributes();
    return attrs.email ?? email;
}

export async function register(email: string, password: string) {
    await signUp({ username: email, password, options: { userAttributes: { email } } });
}

export async function confirmRegistration(email: string, code: string) {
    await confirmSignUp({ username: email, confirmationCode: code });
}

export async function resendCode(email: string) {
    await resendSignUpCode({ username: email });
}

export async function logout() {
    await signOut();
}

export async function getAuthenticatedUser(): Promise<string | null> {
    try {
        const attrs = await fetchUserAttributes();
        return attrs.email ?? null;
    } catch {
        return null;
    }
}
