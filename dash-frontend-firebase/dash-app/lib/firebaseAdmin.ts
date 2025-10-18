import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string;
    let serviceAccount;

    try {
      // First, try to parse the string directly
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (e) {
      // If parsing fails, assume it's a Base64 encoded string and decode it
      const decodedJson = Buffer.from(serviceAccountJson, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(decodedJson);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
