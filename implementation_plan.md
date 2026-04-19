# FarmHith Backend — Implementation Plan (Phases 1–5)

## What's Already Done
- ✅ Phase 1.1 — Firebase wildcard exports removed (prev session)
- ✅ Phase 1.2 (partial) — pnpm version `9.0.0` in root `package.json` (Vercel uses pnpm@10 per lockfile — covered below)
- ✅ The `firestore.rules` file is already complete and production-ready

## User Review Required

> [!IMPORTANT]
> **You must provide two things before I can build Phase 3 & 5:**
> 1. **Firebase Service Account JSON** – Download from Firebase Console → Project Settings → Service Accounts → "Generate new private key". I need the full JSON content to configure the Admin SDK and `verifyToken`.
> 2. **Razorpay credentials** – `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` from your Razorpay dashboard. Phase 5 routes will be scaffolded but require these to execute.

> [!WARNING]
> **Two role inconsistencies found across the codebase that must be fixed before API routes work:**
> - `firestore.rules` uses `'SOIL_MITRA'` but `@farmhith/types/src/index.ts` `Role` type uses `'SOILMITRA'` (no underscore). The Firestore rules check `getUserRole() == 'SOIL_MITRA'` but Firestore documents will store the TypeScript `Role` value.
> - `packages/types/src/firestore.ts` exports its own `Role` type with `'SOIL_MITRA'` (different from the main `index.ts`).
> - **Decision needed**: Should the canonical role string be `'SOIL_MITRA'` or `'SOILMITRA'`? I propose **`'SOILMITRA'`** (no underscore) to match the existing app code and update rules + FS types accordingly.

> [!CAUTION]
> **Daily.co API key** (`DAILY_API_KEY`) is needed for Task 4.5 (video room creation). If you don't have it yet, I'll build the route but it will return an error until the key is added to `.env`.

---

## Proposed Changes

### Phase 1 — Remaining Build Fix

#### [MODIFY] [package.json](file:///c:/Users/mitta/Desktop/PROJECTS/FarmHith-2.0/package.json)
- Change `"pnpm": ">=9"` engine constraint + `"packageManager": "pnpm@10.0.0"` to match Vercel's runtime

---

### Phase 2 — Firestore Layer (Types + Rules consistency)

#### [MODIFY] [firestore.ts](file:///c:/Users/mitta/Desktop/PROJECTS/FarmHith-2.0/packages/types/src/firestore.ts)
- Change `Role` from `'SOIL_MITRA'` → `'SOILMITRA'` to match `index.ts`

#### [MODIFY] [firestore.rules](file:///c:/Users/mitta/Desktop/PROJECTS/FarmHith-2.0/firestore.rules)
- Change `isRole('SOIL_MITRA')` → `isRole('SOILMITRA')` everywhere (3 occurrences)
- Rules are otherwise complete — the main remaining step is publishing them via Firebase Console (manual)

#### [MODIFY] [seedFirestore.ts](file:///c:/Users/mitta/Desktop/PROJECTS/FarmHith-2.0/packages/utils/src/seedFirestore.ts)
- Fix `role: 'SOIL_MITRA'` → `role: 'SOILMITRA'` in seed data to match canonical type

---

### Phase 3 — Firebase Admin SDK

#### [NEW] `packages/firebase/src/admin.ts`
- Initializes Firebase Admin from `FIREBASE_SERVICE_ACCOUNT_JSON` env var
- Exports `adminAuth`, `adminDb` (server-side only)
- Guard: throws on import if not in Node.js context

#### [MODIFY] `packages/firebase/package.json`
- Add `firebase-admin` as a dependency
- Add `"./admin"` export condition pointing to `src/admin.ts`

#### [NEW] `packages/utils/src/verifyToken.ts`
- `verifyToken(request: Request): Promise<DecodedIdToken & { role: Role }>`
- Reads `Authorization: Bearer <token>` header
- Calls `adminAuth.verifyIdToken(token)`
- Fetches user doc from Firestore to get `role`
- Throws `Response` with 401/403 on failure (Next.js App Router pattern)

#### [MODIFY] `packages/utils/package.json`
- Add `firebase-admin` as dependency
- Add `"./verifyToken"` named export

---

### Phase 4 — API Routes

All routes follow this pattern:
```ts
export async function POST(request: Request) {
  const decoded = await verifyToken(request); // throws 401/403 if invalid
  // ... business logic
  return Response.json({ ... }, { status: 200 });
}
```

#### Service 1 — Soil Testing

**[NEW]** `apps/farmer/app/api/soil-test/bookings/route.ts` (Task 4.1)
- POST — FARMER role required
- Reads `labProfiles/{labId}` + `farmerProfiles/{uid}`
- Writes to `soilTestBookings` with `serverTimestamp()`
- Returns `{ bookingId, amount }`

**[NEW]** `apps/lab/app/api/reports/upload/route.ts` (Task 4.2)
- POST multipart — LAB role required
- Uploads PDF to Firebase Storage `reports/{bookingId}/{filename}`
- Writes to `soilTestBookings/{bookingId}/reports/{reportId}`
- Updates booking status → COMPLETED

**[NEW]** `apps/lab/app/api/bookings/[bookingId]/route.ts` (Task 4.3)
- PATCH — LAB role required
- Accepts `{ status: "ACCEPTED" | "CANCELLED" }`
- Updates booking in Firestore

#### Service 2 — Mitra Sessions

**[NEW]** `apps/farmer/app/api/mitra/bookings/route.ts` (Task 4.4)
- POST — FARMER role required
- Reads `soilmitraProfiles/{mitraId}` + `farmerProfiles/{uid}`
- Writes to `mitraBookings` with `videoRoomUrl: null`
- Returns `{ bookingId, amount }`

**[NEW]** `apps/farmer/app/api/mitra/create-room/route.ts` (Task 4.5)
- POST — FARMER role required
- Calls `https://api.daily.co/v1/rooms` with `DAILY_API_KEY`
- Updates `mitraBookings/{bookingId}.videoRoomUrl`
- Returns `{ videoRoomUrl }`

#### Service 3 — Bio-Pellet Marketplace

**[NEW]** `apps/farmer/app/api/marketplace/listings/route.ts` (Task 4.6)
- POST — FARMER role required
- Reads `biopelletProfiles` (first verified) for base rate
- Computes `farmhithPricePerTon = rate * 0.95`
- Writes `cropListings` with status ACTIVE

**[NEW]** `apps/biopellet/app/api/orders/route.ts` (Task 4.7)
- POST — BIOPELLET role required
- Reads listing for farmerId + price data
- Writes `procurementOrders` with status INTERESTED

---

### Phase 5 — Razorpay Payments

**[NEW]** `apps/farmer/app/api/payments/create-order/route.ts` (Task 5.2)
- POST — any authenticated user
- Creates Razorpay order via REST API
- Returns `{ razorpayOrderId, amount, currency: "INR" }`

**[NEW]** `apps/farmer/app/api/payments/verify/route.ts` (Task 5.3)
- POST — any authenticated user
- Verifies HMAC-SHA256 signature with `crypto.createHmac`
- Writes to `/payments` collection with commission calculation
- Updates booking status → CONFIRMED

**[NEW]** `apps/farmer/app/api/webhooks/razorpay/route.ts` (Task 5.4)
- POST — raw body, no JSON parse before signature check
- Verifies webhook signature
- On `payment.captured`: updates booking + payment status
- Returns 200 immediately

---

## Open Questions

> [!IMPORTANT]
> 1. **Role canonical form**: Confirm `'SOILMITRA'` (no underscore) as the standard across Firestore rules, types, and seed data?
> 2. **Do you have a Razorpay account?** Tasks 5.2–5.4 require `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Without them Phase 5 routes will be built but cannot execute.
> 3. **Do you have a Daily.co account?** Task 4.5 requires `DAILY_API_KEY`.
> 4. **Firebase Service Account JSON**: Do you have it downloaded? I need this for Phase 3.

---

## Verification Plan

### After Phase 3
- Run `pnpm dlx tsx packages/utils/src/seedFirestore.ts` with `GOOGLE_APPLICATION_CREDENTIALS` set — should populate all Firestore collections

### After Phase 4
- Test each route with `curl` or the test scripts already in the repo root (`test_login.mjs`, `test_headers.mjs`)

### After Phase 5
- Use Razorpay test mode + their webhook simulator to verify the full payment flow

---

## Phases I'll Execute (fully automated)
| Task | Status |
|---|---|
| 1.2 pnpm version fix | 🔄 Ready |
| 2 — Role consistency fix (types + rules + seed) | 🔄 Ready |
| 3.3 — Admin SDK package (`admin.ts`) | 🔄 Ready |
| 3.4 — `verifyToken` utility | 🔄 Ready |
| 4.1–4.7 — All 7 API routes | 🔄 Ready |
| 5.2–5.4 — Razorpay routes (scaffolded, need keys) | 🔄 Ready |

## Phases Requiring Manual Steps (Firebase Console / Vercel)
| Task | What you do |
|---|---|
| 2.1 — Publish Firestore rules | Copy `firestore.rules` → Firebase Console → Publish |
| 2.3 — Create 9 composite indexes | Firebase Console → Indexes (table in tasks file) |
| 2.4 — Run seed script | `pnpm dlx tsx packages/utils/src/seedFirestore.ts` |
| 3.1 — Download service account key | Firebase Console → Service Accounts |
| 3.2 — Add env vars to Vercel | Vercel dashboard per portal |
| 5.1 — Add Razorpay keys to `.env` | You provide keys |
| 7.x — Deploy verification | After all env vars set |
