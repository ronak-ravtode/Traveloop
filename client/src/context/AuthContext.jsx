import { createContext, useContext, useState, useEffect } from 'react';
import { observeAuthState, logout as firebaseLogout } from '../firebase/auth';

// Set to false to use real Firebase authentication
const DEMO_MODE = false;
const DEMO_USER = {
  uid: 'demo-user-1',
  email: 'demo@traveloop.com',
  displayName: 'Demo User',
  photoURL: null,
};

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEMO_MODE ? DEMO_USER : null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState(null);

  // Get Firebase ID token for API requests
  const getIdToken = async () => {
    if (DEMO_MODE) {
      // Return mock token for demo mode
      return 'demo-mock-token';
    }
    if (user?.uid) {
      try {
        const { getIdToken: firebaseGetToken } = await import('../firebase/auth');
        // We need the auth instance to get token
        const token = localStorage.getItem('firebaseIdToken');
        return token;
      } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (DEMO_MODE) {
      setLoading(false);
      return;
    }

    // Listen to Firebase auth state
    const unsubscribe = observeAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        // Get ID token for API calls
        let token = null;
        try {
          token = await firebaseUser.getIdToken();
          localStorage.setItem('firebaseIdToken', token);
        } catch (error) {
          console.error('Error getting ID token:', error);
        }

        setIdToken(token);
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerId
        };
        setUser(userData);
        // Store user info for API calls (hackathon approach without Firebase Admin)
        localStorage.setItem('traveloop_user', JSON.stringify(userData));
      } else {
        setUser(null);
        setIdToken(null);
        localStorage.removeItem('firebaseIdToken');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await firebaseLogout();
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
    setUser(null);
    setIdToken(null);
    localStorage.removeItem('firebaseIdToken');
    localStorage.removeItem('traveloop_user');
  };

  const refreshToken = async () => {
    if (DEMO_MODE) return;
    try {
      const { auth } = await import('../firebase/config');
      if (auth?.currentUser) {
        const token = await auth.currentUser.getIdToken(true);
        localStorage.setItem('firebaseIdToken', token);
        setIdToken(token);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isDemoMode: DEMO_MODE,
    logout,
    getIdToken,
    refreshToken,
    idToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};