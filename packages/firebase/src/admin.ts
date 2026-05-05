/**
 * Firebase Admin SDK — SERVER SIDE ONLY
 *
 * Import from '@farmhith/firebase/admin' in Next.js API routes only.
 * NEVER import this file in client components, page components, or
 * any file inside packages/auth, packages/hooks, or packages/utils.
 *
 * ⚠️  Lazy initialization: getAdminApp() is intentionally NOT called at module
 * load time. Next.js executes module-level code during `next build` static
 * analysis, before environment variables are available. All admin service
 * exports use a Proxy so that Firebase Admin only initializes on the first
 * property access inside an actual request handler.
 */
import * as admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

let _app: App | undefined;

function getAdminApp(): App {
  // Return cached instance (handles Next.js dev hot-reload)
  if (_app) return _app;
  if (admin.apps.length > 0) return (_app = admin.apps[0]!);

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

  // The firebase-admin SDK needs the GCS bucket name in the legacy appspot.com format.
  // Projects created after 2023 may have a `.firebasestorage.app` domain in their config
  // but the underlying GCS bucket is still `<projectId>.appspot.com`.
  const storageBucketEnv = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '';
  const storageBucket = storageBucketEnv.includes('appspot.com')
    ? storageBucketEnv
    : `${projectId}.appspot.com`;

  _app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket,
  });

  return _app;
}

/**
 * Creates a Proxy that defers factory() until the first property access.
 * This means the admin SDK is only initialized inside request handlers,
 * never during `next build` module evaluation.
 */
function lazyService<T extends object>(factory: () => T): T {
  let instance: T | undefined;
  return new Proxy({} as T, {
    get(_target, prop: string | symbol) {
      if (!instance) instance = factory();
      const value = (instance as Record<string | symbol, unknown>)[prop];
      return typeof value === 'function' ? (value as Function).bind(instance) : value;
    },
  });
}

// Lazy singletons — getAdminApp() is only called when a property is accessed
// inside a request handler, not during build-time module evaluation.
export const adminAuth    = lazyService<admin.auth.Auth>(() => admin.auth(getAdminApp()));
export const adminDb      = lazyService<admin.firestore.Firestore>(() => admin.firestore(getAdminApp()));
export const adminStorage = lazyService<admin.storage.Storage>(() => admin.storage(getAdminApp()));

// FieldValue and FieldPath are STATIC utilities on admin.firestore — they do
// NOT require an initialized app, so they're safe to export directly.
export const { FieldValue, FieldPath } = admin.firestore;
