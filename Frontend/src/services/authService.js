import { signInWithPopup, signOut } from 'firebase/auth';
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
        name: data.name || 'Neural Architect',
        email: data.email,
        photoURL: avatarUrl,
        avatar: avatarUrl,
        plan: data.plan || 'Pro Plan',
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
   * Google Sign-in with Firebase Auth + Backend Auth API
   */
  async loginWithGoogle() {
    try {
      // 1. Authenticate with Firebase Google Provider popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      let serverUser = null;
      try {
        // 2. Exchange Firebase token with backend gateway /api/auth/login
        // Backend creates Redis session (7 days) and sets httpOnly session cookie
        const response = await api.post('/api/auth/login', { token: idToken });
        serverUser = response.data?.user;
      } catch (backendErr) {
        console.warn('Backend /api/auth/login request encountered error, using client fallback:', backendErr);
      }

      // 3. Construct user model
      const avatarUrl =
        serverUser?.avatar ||
        firebaseUser.photoURL ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

      const userData = {
        uid: serverUser?.firebaseUid || firebaseUser.uid,
        id: serverUser?._id,
        name: serverUser?.name || firebaseUser.displayName || 'Neural Architect',
        email: serverUser?.email || firebaseUser.email,
        photoURL: avatarUrl,
        avatar: avatarUrl,
        plan: 'Pro Plan',
        isDemo: false,
      };

      const expiresAt = Date.now() + SEVEN_DAYS_MS;
      localStorage.setItem('cortex_user', JSON.stringify(userData));
      localStorage.setItem('cortex_session_expires', String(expiresAt));
      localStorage.setItem('cortex_token', idToken);
      return userData;
    } catch (error) {
      console.error('Login with Google error:', error);
      throw error;
    }
  },

  /**
   * Email/Password Sign-in simulation / instant access
   */
  async loginWithEmail(email, password) {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }
    const cleanName = email.split('@')[0].replace(/[._-]/g, ' ') || 'Enterprise Operator';
    const formattedName = cleanName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const demoUser = {
      uid: 'email-usr-' + Date.now(),
      name: formattedName,
      email: email,
      photoURL:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      plan: 'Pro Plan',
      isDemo: true,
    };

    const expiresAt = Date.now() + SEVEN_DAYS_MS;
    localStorage.setItem('cortex_user', JSON.stringify(demoUser));
    localStorage.setItem('cortex_session_expires', String(expiresAt));
    localStorage.setItem('cortex_token', 'enterprise-session-token');
    return demoUser;
  },

  /**
   * Demo / Instant Sandbox Sign-in for immediate local prototype evaluation
   */
  loginDemo(email = 'alex.vance@cortex.ai', name = 'Alex Vance') {
    const demoUser = {
      uid: 'demo-user-123',
      name: name,
      email: email,
      photoURL:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      plan: 'Pro Plan',
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
