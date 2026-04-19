/**
 * Firebase Admin SDK — SERVER SIDE ONLY
 *
 * Import from '@farmhith/firebase/admin' in Next.js API routes only.
 * NEVER import this file in client components, page components, or
 * any file inside packages/auth, packages/hooks, or packages/utils.
 */
import * as admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

function getAdminApp(): App {
  // Prevent double-initialization in Next.js dev hot-reload
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error(
      '[farmhith/firebase/admin] FIREBASE_SERVICE_ACCOUNT_JSON is not set. ' +
      'Add it to .env.local and Vercel environment variables.'
    );
  }

  let serviceAccount: object;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error(
      '[farmhith/firebase/admin] FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.'
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminApp = getAdminApp();

export const adminAuth    = admin.auth(adminApp);
export const adminDb      = admin.firestore(adminApp);
export const adminStorage = admin.storage(adminApp);
