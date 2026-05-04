/**
 * verifyToken — SERVER SIDE ONLY
 *
 * Import from '@farmhith/firebase/verifyToken' in Next.js API routes only.
 * NEVER import in client components, pages, or shared client packages.
 *
 * Usage in every API route:
 *   const decoded = await verifyToken(request);
 *   if (decoded.role !== 'FARMER') throw new ApiError(403, 'FARMER role required');
 */
import { adminAuth, adminDb } from './admin';
import type { Role } from '@farmhith/types';

// ─── Typed API error ─────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Decoded user shape ───────────────────────────────────────────────────────

export interface DecodedUser {
  uid: string;
  email: string | undefined;
  role: Role;
}

// ─── verifyToken ─────────────────────────────────────────────────────────────

/**
 * Verifies the Bearer token from the Authorization header and returns
 * the decoded user with their Firestore role attached.
 *
 * Throws ApiError(401) if the header is missing.
 * Throws ApiError(403) if the token is invalid, expired, or no Firestore profile exists.
 */
export async function verifyToken(request: Request): Promise<DecodedUser> {
  // 1. Read Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or malformed Authorization header. Make sure you are logged in.');
  }

  const idToken = authHeader.slice(7).trim();
  if (!idToken) {
    throw new ApiError(401, 'Empty token — please log out and log back in.');
  }

  // 2. Verify Firebase ID token
  let uid: string;
  let email: string | undefined;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken, /* checkRevoked */ true);
    uid   = decoded.uid;
    email = decoded.email;
  } catch (err: any) {
    const msg = err?.errorInfo?.code ?? err?.code ?? err?.message ?? 'unknown';
    // Surface a clear message — most common cause is an expired cached token
    throw new ApiError(
      403,
      `Firebase token verification failed (${msg}). ` +
      'The token may have expired — please refresh the page and try again.'
    );
  }

  // 3. Fetch role from /users/{uid}
  const userSnap = await adminDb.collection('users').doc(uid).get();
  if (!userSnap.exists) {
    throw new ApiError(
      403,
      `No /users/${uid} document found. Complete registration first.`
    );
  }

  const role = userSnap.data()!.role as Role;
  if (!role) {
    throw new ApiError(403, `User document exists but has no 'role' field.`);
  }

  return { uid, email, role };
}
