import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../utils/firebase.js';

export const authService = {
  /**
   * Google Sign-in with Firebase Auth
   */
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const userData = {
        uid: user.uid,
        name: user.displayName || 'Alex Vance',
        email: user.email,
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        plan: 'Pro Plan',
        isDemo: false,
      };
      localStorage.setItem('cortex_user', JSON.stringify(userData));
      localStorage.setItem('cortex_token', idToken);
      return userData;
    } catch (error) {
      console.warn('Firebase login failed or popup cancelled, falling back to Demo login if requested', error);
      throw error;
    }
  },

  /**
   * Demo / Guest Sign-in for immediate local prototype evaluation
   */
  loginDemo(email = 'alex.vance@cortex.ai', name = 'Alex Vance') {
    const demoUser = {
      uid: 'demo-user-123',
      name: name,
      email: email,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
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
   * Logout user
   */
  logout() {
    localStorage.removeItem('cortex_user');
    localStorage.removeItem('cortex_token');
    return true;
  },
};

export default authService;
