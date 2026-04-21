# Farmhith — Backend & Database Setup Tasks

> This file tracks every backend task that needs to be completed.
> Work through phases in order. Do not skip ahead.
> Check off each task as it is completed.

---

## Phase 1 — Fix the Build (Blocker)
> Must be done before anything else. All portals fail to deploy until this is resolved.

- [x] **1.1** Fix wildcard Firebase exports in `packages/firebase/src/index.ts`
  - Remove all `export * from "firebase/auth"` and `export * from "firebase/firestore"` lines
  - Replace with named exports of initialized instances only: `auth`, `db`, `storage`, `app`
  - File location: `packages/firebase/src/index.ts`

- [x] **1.2** Fix pnpm version mismatch
  - Open root `package.json`
  - Change `"packageManager"` field to `"pnpm@10.0.0"`
  - Run `pnpm install` to regenerate lockfile
  - Commit both `package.json` and `pnpm-lock.yaml`

- [x] **1.3** Verify all 5 portals build cleanly
  - Run `pnpm build` from repo root
  - All 5 apps must show `✓ Compiled successfully`
  - Fix any remaining TypeScript or import errors before moving to Phase 2

---

## Phase 2 — Firestore Database Layer

### 2A — Security Rules
- [x] **2.1** Publish final security rules in Firebase Console
  - Go to Firebase Console → Firestore → Rules tab
  - Replace all existing rules with the role-based ruleset using `getUserRole()` helper
  - Click Publish
  - Rules must NOT be in test mode

- [x] **2.2** Test rules using Rules Playground
  - Firebase Console → Firestore → Rules → Rules Playground
  - Test 1: Farmer reads own `farmerProfiles/{uid}` → must Allow
  - Test 2: Farmer reads another farmer's profile → must Deny
  - Test 3: Lab updates `soilTestBookings/{id}` where `labId == uid` → must Allow
  - Test 4: Unauthenticated user reads `cropListings` → must Deny
  - Test 5: Admin reads any document → must Allow
  - All 5 tests must pass before continuing

### 2B — Composite Indexes
- [x] **2.3** Create all 9 composite indexes in Firebase Console
  - Go to Firebase Console → Firestore → Indexes → Add index
  - Create each index separately (one Create click per index):

  | # | Collection | Field 1 | Field 2 | Field 3 |
  |---|---|---|---|---|
  | 1 | soilTestBookings | farmerId ASC | createdAt DESC | — |
  | 2 | soilTestBookings | labId ASC | createdAt DESC | — |
  | 3 | soilTestBookings | status ASC | createdAt DESC | — |
  | 4 | mitraBookings | farmerId ASC | sessionDatetime ASC | — |
  | 5 | mitraBookings | mitraId ASC | sessionDatetime ASC | — |
  | 6 | cropListings | status ASC | residueType ASC | createdAt DESC |
  | 7 | cropListings | status ASC | farmerDistrict ASC | createdAt DESC |
  | 8 | procurementOrders | farmerId ASC | createdAt DESC | — |
  | 9 | procurementOrders | plantId ASC | createdAt DESC | — |

  - Wait for all indexes to show "Enabled" status (not "Building")

### 2C — Seed Data
- [x] **2.4** Run seed script to populate test documents
  - File: `packages/utils/src/seedFirestore.ts`
  - Run: `npx ts-node packages/utils/src/seedFirestore.ts`
  - Verify in Firebase Console that documents appear in each collection

- [x] **2.5** Manually create one verified lab in Firestore Console
  - Collection: `labProfiles` / Document ID: `seed_lab_001`
  - Fields: `labName: "AgriTest Lab"`, `state: "Delhi"`, `district: "New Delhi"`, `perTestPrice: 500`, `isVerified: true`, `dailyCapacity: 20`, `address: "123 Test Street"`
  - Also create matching: `users/seed_lab_001` with `role: "LAB"`, `preferredLang: "en"`, `createdAt: now`

- [x] **2.6** Manually create one verified Soil-Mitra in Firestore Console
  - Collection: `soilmitraProfiles` / Document ID: `seed_mitra_001`
  - Fields: `fullName: "Ramesh Kumar"`, `specialisation: ["paddy","wheat"]`, `languagesSpoken: ["en","hi"]`, `sessionFee: 300`, `rating: 4.5`, `totalSessions: 12`, `isVerified: true`, `availableSlots: []`
  - Also create matching: `users/seed_mitra_001` with `role: "SOILMITRA"`, `preferredLang: "hi"`, `createdAt: now`

---

## Phase 3 — Firebase Admin SDK Setup

- [x] **3.1** Generate Firebase service account key
  - Firebase Console → Project Settings → Service accounts tab
  - Click "Generate new private key" → download JSON file
  - DO NOT commit this file to git
  - Add to `.gitignore`: `**/serviceAccountKey.json`

- [x] **3.2** Add service account as environment variable
  - Open the downloaded JSON file
  - Copy entire contents as a single line
  - Add to each portal's `.env.local`:
    ```
    FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"farmhith-893f4",...}
    ```
  - Add to Vercel Environment Variables for each deployed portal

- [x] **3.3** Create Firebase Admin package
  - File: `packages/firebase/src/admin.ts`
  - Initialize Firebase Admin SDK using `FIREBASE_SERVICE_ACCOUNT_JSON` env variable
  - Export: `adminAuth`, `adminDb`
  - This file is server-side only — never import in client components

- [x] **3.4** Create token verification utility
  - File: `packages/firebase/src/verifyToken.ts`
  - Function: `verifyToken(request: Request)` 
  - Reads `Authorization: Bearer <token>` header
  - Verifies token using `adminAuth.verifyIdToken()`
  - Returns decoded token with `uid` and `role`
  - Throws 401 if token missing, 403 if invalid or wrong role

---

## Phase 4 — Next.js API Routes (Backend)

### Service 1: Soil Testing
- [x] **4.1** Create soil test booking route
  - File: `apps/farmer/app/api/soil-test/bookings/route.ts`
  - Method: POST
  - Auth: FARMER role required
  - Reads: `labProfiles/{labId}` for labName + perTestPrice
  - Reads: `farmerProfiles/{uid}` for farmerName
  - Writes: `/soilTestBookings` with status PENDING
  - Returns: `{ bookingId, amount }`

- [x] **4.2** Create report upload route (Lab portal)
  - File: `apps/lab/app/api/reports/upload/route.ts`
  - Method: POST
  - Auth: LAB role required
  - Accepts: bookingId + PDF file
  - Uploads PDF to Firebase Storage: `reports/{bookingId}/{filename}`
  - Writes to: `/soilTestBookings/{bookingId}/reports/{reportId}`
  - Updates booking status to COMPLETED
  - Returns: `{ reportUrl }`

- [x] **4.3** Create lab booking management route
  - File: `apps/lab/app/api/bookings/[bookingId]/route.ts`
  - Method: PATCH
  - Auth: LAB role required
  - Accepts: `{ status: "ACCEPTED" | "CANCELLED" }`
  - Updates booking status in Firestore
  - Returns: `{ success: true }`

### Service 2: Soil-Mitra Sessions
- [x] **4.4** Create Mitra booking route
  - File: `apps/farmer/app/api/mitra/bookings/route.ts`
  - Method: POST
  - Auth: FARMER role required
  - Reads: `soilmitraProfiles/{mitraId}` for mitraName + sessionFee
  - Reads: `farmerProfiles/{uid}` for farmerName
  - Writes: `/mitraBookings` with `videoRoomUrl: null`, status PENDING
  - Returns: `{ bookingId, amount }`

- [x] **4.5** Create Daily.co room generation route
  - File: `apps/farmer/app/api/mitra/create-room/route.ts`
  - Method: POST
  - Auth: FARMER role required (called after payment confirmed)
  - Calls Daily.co REST API: `POST https://api.daily.co/v1/rooms`
  - Updates `mitraBookings/{bookingId}` with `videoRoomUrl`
  - Returns: `{ videoRoomUrl }`
  - Env variable needed: `DAILY_API_KEY`

### Service 3: Bio-Pellet Marketplace
- [x] **4.6** Create crop listing route
  - File: `apps/farmer/app/api/marketplace/listings/route.ts`
  - Method: POST
  - Auth: FARMER role required
  - Uses fixed residue mapping table.
  - Calculates: `farmhithPricePerTon = baseRate * 0.95`
  - Reads: `farmerProfiles/{uid}` for farmerName + district
  - Writes: `/cropListings` with status ACTIVE
  - Returns: `{ listingId, farmhithPricePerTon }`

- [x] **4.7** Create procurement order route
  - File: `apps/biopellet/app/api/orders/route.ts`
  - Method: POST
  - Auth: BIOPELLET role required
  - Reads listing to copy farmerId + price
  - Writes: `/procurementOrders` with status INTERESTED
  - Returns: `{ orderId, totalAmount }`

---

## Phase 5 — Razorpay Payments

- [ ] **5.1** Add Razorpay credentials to environment
  - Add to each portal's `.env.local`:
    ```
    RAZORPAY_KEY_ID=rzp_test_xxx
    RAZORPAY_KEY_SECRET=xxx
    RAZORPAY_WEBHOOK_SECRET=xxx
    ```
  - Also add to Vercel Environment Variables

- [x] **5.2** Create payment order creation route
  - File: `apps/farmer/app/api/payments/create-order/route.ts`
  - Method: POST
  - Auth: Any authenticated user
  - Accepts: `{ amount, serviceType, serviceRefId }`
  - Creates Razorpay order server-side
  - Returns: `{ razorpayOrderId, amount, currency: "INR" }`

- [x] **5.3** Create payment verification route
  - File: `apps/farmer/app/api/payments/verify/route.ts`
  - Method: POST
  - Verifies Razorpay signature using `crypto.createHmac`
  - Calculates commission: SOIL_TEST 12%, MITRA_SESSION 18%, CROP_PROCUREMENT 5%
  - Writes to `/payments` collection
  - Updates booking status to CONFIRMED
  - Returns: `{ success: true }`

- [x] **5.4** Create Razorpay webhook handler
  - File: `apps/farmer/app/api/webhooks/razorpay/route.ts`
  - Method: POST
  - CRITICAL: Must read raw body BEFORE any JSON parsing
  - Verifies webhook signature
  - On `payment.captured`: updates booking + payment status in Firestore
  - Returns 200 OK immediately (Razorpay retries if no 200)

---

## Phase 6 — End-to-End Verification

- [ ] **6.1** Test full soil test booking flow locally
  - Farmer logs in → browses labs → books a test → payment succeeds
  - Firestore shows new document in `soilTestBookings`
  - Firestore shows new document in `payments`
  - Lab portal shows the booking in inbox

- [ ] **6.2** Test lab report upload
  - Lab accepts booking → uploads PDF → marks complete
  - Firestore shows document in `soilTestBookings/{id}/reports`
  - Firebase Storage shows PDF file at `reports/{bookingId}/`
  - Farmer portal shows report with download link

- [ ] **6.3** Test Mitra session booking
  - Farmer books Mitra → payment succeeds → videoRoomUrl generated
  - Both farmer and Mitra dashboards show "Join session" button
  - Session completes → farmerRating submitted → mitraProfile.rating updates

- [ ] **6.4** Test crop listing + procurement order
  - Farmer creates listing → appears in bio-pellet portal
  - Plant expresses interest → farmer confirms
  - Payment flows → order status updates to COMPLETED

- [ ] **6.5** Test admin oversight
  - All bookings, users, payments visible in admin dashboard
  - Admin can toggle `isVerified` on lab and Mitra profiles
  - Unverified labs disappear from farmer's lab browse page

---

## Phase 7 — Deploy

- [ ] **7.1** Add all environment variables to Vercel for each portal
  - NEXT_PUBLIC_FIREBASE_* (6 variables) — all 5 portals
  - FIREBASE_SERVICE_ACCOUNT_JSON — farmer, lab, biopellet, soilmitra, admin
  - RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET — farmer portal
  - DAILY_API_KEY — farmer portal

- [ ] **7.2** Confirm Root Directory is set correctly in each Vercel project
  - farmer → `apps/farmer`
  - lab → `apps/lab`
  - biopellet → `apps/biopellet`
  - soilmitra → `apps/soilmitra`
  - admin → `apps/admin`

- [ ] **7.3** Add production domains to Firebase authorized domains
  - Firebase Console → Authentication → Settings → Authorized domains
  - Add: `farmer.farmhith.com`, `lab.farmhith.com`, `plant.farmhith.com`, `mitra.farmhith.com`, `admin.farmhith.com`

- [ ] **7.4** Deploy all 5 portals and verify on production URLs
  - Each portal loads without errors
  - Login works on all 5
  - Firestore reads and writes work on production domains

---

## Quick Reference — Environment Variables

| Variable | Used by | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | All portals (client) | Firebase Console → Project Settings → Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | All portals (client) | Same as above |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | All portals (client) | Same as above |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | All portals (client) | Same as above |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | All portals (client) | Same as above |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | All portals (client) | Same as above |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | All portals (server) | Firebase Console → Project Settings → Service accounts |
| `RAZORPAY_KEY_ID` | farmer (server) | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | farmer (server) | Same as above |
| `RAZORPAY_WEBHOOK_SECRET` | farmer (server) | Razorpay Dashboard → Webhooks |
| `DAILY_API_KEY` | farmer (server) | dashboard.daily.co → Developers → API Keys |

---

## Progress Tracker

| Phase | Status |
|---|---|
| Phase 1 — Fix Build | ✅ Complete |
| Phase 2 — Firestore Layer | ✅ Complete |
| Phase 3 — Admin SDK | ✅ Complete |
| Phase 4 — API Routes | ✅ Complete |
| Phase 5 — Payments | 🚧 User actions pending |
| Phase 6 — E2E Testing | ⬜ Not started |
| Phase 7 — Deploy | ⬜ Not started |

---
*Last updated: April 2026*
*Project: Farmhith v1.0*
