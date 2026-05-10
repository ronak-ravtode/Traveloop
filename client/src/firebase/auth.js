import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';

export const googleProvider = new GoogleAuthProvider();

// Helper to check if auth is available
const checkAuth = () => {
  if (!auth) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }
  return auth;
};

export const registerWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(checkAuth(), email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
};

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(checkAuth(), email, password);
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  const userCredential = await signInWithPopup(checkAuth(), googleProvider);
  return userCredential.user;
};

export const logout = async () => {
  await signOut(checkAuth());
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(checkAuth(), email);
};

export const observeAuthState = (callback) => {
  if (!auth) {
    console.warn('Firebase auth not initialized');
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};