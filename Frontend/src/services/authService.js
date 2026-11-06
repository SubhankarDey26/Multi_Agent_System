import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../utils/firebase.js';
import api from '../../utils/axios.js';

export const authService = {
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
        // 2. Exchange Firebase token with backend gateway /auth/login
        const response = await api.post('/auth/login', { token: idToken });
        serverUser = response.data?.user;
      } catch (backendErr) {
        console.warn('Backend /auth/login request encountered error, using client fallback:', backendErr);
      }

      // 3. Construct user model
      const userData = {
        uid: serverUser?.firebaseUid || firebaseUser.uid,
        id: serverUser?._id,
        name: serverUser?.name || firebaseUser.displayName || 'Neural Architect',
        email: serverUser?.email || firebaseUser.email,
        photoURL:
          serverUser?.avatar ||
          firebaseUser.photoURL ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        plan: 'Pro Plan',
        isDemo: false,
      };

      localStorage.setItem('cortex_user', JSON.stringify(userData));
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
      plan: 'Pro Plan',
      isDemo: true,
    };

    localStorage.setItem('cortex_user', JSON.stringify(demoUser));
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
      plan: 'Pro Plan',
      isDemo: true,
    };
    localStorage.setItem('cortex_user', JSON.stringify(demoUser));
    localStorage.setItem('cortex_token', 'demo-jwt-token-xyz');
    return demoUser;
  },

  /**
   * Get current authenticated user from storage
   */
  getCurrentUser() {
    const raw = localStorage.getItem('cortex_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Logout user via Backend API + Firebase + Local Storage
   */
  async logout() {
    try {
      // Call backend /auth/logout (clears Redis session and session cookie)
      await api.get('/auth/logout');
    } catch (err) {
      console.warn('Backend /auth/logout warning:', err);
    }

    try {
      // Sign out from Firebase client
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut warning:', err);
    }

    // Clear client-side persisted session
    localStorage.removeItem('cortex_user');
    localStorage.removeItem('cortex_token');
    return true;
  },
};

export default authService;
