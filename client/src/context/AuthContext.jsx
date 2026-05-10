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

  useEffect(() => {
    if (DEMO_MODE) {
      setLoading(false);
      return;
    }

    // Listen to Firebase auth state
    const unsubscribe = observeAuthState((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerId
        });
      } else {
        setUser(null);
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
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isDemoMode: DEMO_MODE,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};