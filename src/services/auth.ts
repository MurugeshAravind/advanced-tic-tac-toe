import {
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    getCurrentUser,
    resendSignUpCode,
} from 'aws-amplify/auth';

export async function login(email: string, password: string) {
    const { isSignedIn } = await signIn({ username: email, password });
    if (!isSignedIn) throw new Error('Sign in failed');
    const user = await getCurrentUser();
    return user.username;
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
        const user = await getCurrentUser();
        return user.username;
    } catch {
        return null;
    }
}
