import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { UserProfile } from '../types';

/**
 * Set this to the OAuth 2.0 **Web client ID** from the Google Cloud console
 * (APIs & Services → Credentials) once the Firebase/Google project exists.
 * Google Sign-In also requires the app's SHA-1 registered on an Android
 * OAuth client in the same project.
 */
const WEB_CLIENT_ID = '';

let configured = false;

function ensureConfigured(): void {
  if (!WEB_CLIENT_ID) {
    throw new Error(
      'Google Sign-In is not configured yet. Add the Web Client ID in src/services/googleAuth.ts, or continue as guest.',
    );
  }
  if (!configured) {
    GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
    configured = true;
  }
}

export async function signInWithGoogle(): Promise<UserProfile> {
  ensureConfigured();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) {
    throw new Error('Google sign-in was cancelled');
  }
  const { user } = response.data;
  return {
    id: user.id,
    name: user.name ?? 'Google User',
    email: user.email,
    photoUrl: user.photo ?? undefined,
    provider: 'google',
  };
}

export async function signOutGoogle(): Promise<void> {
  if (configured) {
    try {
      await GoogleSignin.signOut();
    } catch {
      // Ignore sign-out failures; local session is cleared regardless.
    }
  }
}
