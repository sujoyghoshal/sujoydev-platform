import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/constants';
import { UserProfile } from '../types';

export interface GoogleSignInResult {
  profile: UserProfile;
  /** Google ID token — exchanged with the backend for a NurixSoft JWT. */
  idToken: string | null;
}

let configured = false;

export function isGoogleConfigured(): boolean {
  return GOOGLE_WEB_CLIENT_ID.length > 0;
}

function ensureConfigured(): void {
  if (!isGoogleConfigured()) {
    throw new Error(
      'Google Sign-In is not configured yet — add GOOGLE_WEB_CLIENT_ID in src/config/constants.ts (see docs/GOOGLE_AUTH.md), or continue as guest.',
    );
  }
  if (!configured) {
    GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
    configured = true;
  }
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  ensureConfigured();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (!isSuccessResponse(response)) {
    throw new Error('Google sign-in was cancelled');
  }
  const { user, idToken } = response.data;
  return {
    profile: {
      id: user.id,
      name: user.name ?? 'Google User',
      email: user.email,
      photoUrl: user.photo ?? undefined,
      provider: 'google',
    },
    idToken,
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
