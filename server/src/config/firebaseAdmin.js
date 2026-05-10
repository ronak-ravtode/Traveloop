import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseAdmin = null;

const initializeFirebase = () => {
  const hasCredentials = process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----') &&
    !process.env.FIREBASE_PRIVATE_KEY.includes('...');

  if (hasCredentials) {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    firebaseAdmin = admin;
    console.log('✓ Firebase Admin initialized');
  } else {
    console.log('⚠️  Firebase Admin not initialized - using mock auth for development');
    firebaseAdmin = {
      auth: () => ({
        verifyIdToken: async (token) => {
          if (token && token.startsWith('mock-')) {
            return { uid: token.replace('mock-', ''), email: 'demo@traveloop.com' };
          }
          throw new Error('Invalid token');
        },
      }),
    };
  }
};

initializeFirebase();

export default firebaseAdmin;