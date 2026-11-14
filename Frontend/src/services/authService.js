import { signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../utils/firebase.js';
import api from '../../utils/axios.js';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const authService = {
  /**
   * Fetch current authenticated user from Backend Gateway API (/api/me)
   * The browser automatically sends the HTTP-only 'session' cookie via withCredentials: true.
   * Gateway protect middleware verifies the session in Redis (7 days TTL) and returns req.user.
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/api/me');
      const data = response.data;

      if (!data) return null;

      const avatarUrl =
        data.avatar ||
        data.photoURL ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

      const userData = {
        id: data.userId || data._id || data.id,
        uid: data.userId || data.firebaseUid || data.uid,
        name: data.name || 'User',
        email: data.email,
        photoURL: avatarUrl,
        avatar: avatarUrl,
        isDemo: false,
      };

      // Persist for 7 days matching the Redis session expiration constraint
      const expiresAt = Date.now() + SEVEN_DAYS_MS;
      localStorage.setItem('cortex_user', JSON.stringify(userData));
      localStorage.setItem('cortex_session_expires', String(expiresAt));
      return userData;
    } catch (error) {
      const stored = authService.getStoredUser();

      // If user is operating in Demo mode, keep their session across refreshes
      if (stored?.isDemo) {
        return stored;
      }

      // If backend returned 400 (unauthorized or session expired in Redis)
      if (error.response?.status === 400 || error.response?.status === 401) {
        localStorage.removeItem('cortex_user');
        localStorage.removeItem('cortex_session_expires');
        localStorage.removeItem('cortex_token');
        return null;
      }

      // If backend was unreachable or network blip, preserve cached user within 7 days
      const expiresAt = localStorage.getItem('cortex_session_expires');
      if (stored && expiresAt && Date.now() < Number(expiresAt)) {
        return stored;
      }

      return stored;
    }
  },

  /**
   * Synchronously get cached user from localStorage (for instant initial render without vanish or flicker)
   */
  getStoredUser() {
    const raw = localStorage.getItem('cortex_user');
    if (!raw) return null;
    try {
      const expiresAt = localStorage.getItem('cortex_session_expires');
      if (expiresAt && Date.now() > Number(expiresAt)) {
        localStorage.removeItem('cortex_user');
        localStorage.removeItem('cortex_session_expires');
        localStorage.removeItem('cortex_token');
        return null;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Google Sign-in via REDIRECT (avoids popup unsafe-eval CSP restriction).
   * Step 1: Call initiateGoogleRedirect() to send browser to Google.
   * Step 2: On return, call handleGoogleRedirectResult() to complete sign-in.
   */
  initiateGoogleRedirect() {
    return signInWithRedirect(auth, googleProvider);
  },

  /**
   * Called on mount of LoginPage after Google redirects back.
   * Returns user data if redirect result is present, null otherwise.
   */
  async handleGoogleRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (!result) return null; // No pending redirect result

      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      let serverUser = null;
      try {
        // Exchange Firebase token with backend gateway /api/auth/login
        // Backend creates Redis session (7 days) and sets httpOnly session cookie
        const response = await api.post('/api/auth/login', { token: idToken });
        serverUser = response.data?.user;
      } catch (backendErr) {
        console.warn('Backend /api/auth/login error, using Firebase fallback:', backendErr);
      }

      const avatarUrl =
        serverUser?.avatar ||
        firebaseUser.photoURL ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

      const userData = {
        uid: serverUser?.firebaseUid || firebaseUser.uid,
        id: serverUser?._id,
        name: serverUser?.name || firebaseUser.displayName || 'User',
        email: serverUser?.email || firebaseUser.email,
        photoURL: avatarUrl,
        avatar: avatarUrl,
        isDemo: false,
      };

      const expiresAt = Date.now() + SEVEN_DAYS_MS;
      localStorage.setItem('cortex_user', JSON.stringify(userData));
      localStorage.setItem('cortex_session_expires', String(expiresAt));
      localStorage.setItem('cortex_token', idToken);
      return userData;
    } catch (error) {
      // Ignore cancelled-popup type errors from redirect — not applicable
      if (error.code === 'auth/popup-closed-by-user') return null;
      throw error;
    }
  },

  /**
   * Demo / Instant Sandbox Sign-in for immediate local prototype evaluation
   */
  loginDemo(email = 'developer@cortex.ai', name = 'Cortex Developer') {
    const demoUser = {
      uid: 'demo-user-123',
      name: name,
      email: email,
      photoURL:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      isDemo: true,
    };
    const expiresAt = Date.now() + SEVEN_DAYS_MS;
    localStorage.setItem('cortex_user', JSON.stringify(demoUser));
    localStorage.setItem('cortex_session_expires', String(expiresAt));
    localStorage.setItem('cortex_token', 'demo-jwt-token-xyz');
    return demoUser;
  },

  /**
   * Logout user via Backend API (/api/auth/logout) + Firebase + Local Storage
   */
  async logout() {
    try {
      // Call backend /api/auth/logout (clears Redis session and session cookie)
      await api.get('/api/auth/logout');
    } catch (err) {
      console.warn('Backend /api/auth/logout warning:', err);
    }

    try {
      // Sign out from Firebase client
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut warning:', err);
    }

    // Clear client-side persisted session
    localStorage.removeItem('cortex_user');
    localStorage.removeItem('cortex_session_expires');
    localStorage.removeItem('cortex_token');
    return true;
  },
};

export default authService;
