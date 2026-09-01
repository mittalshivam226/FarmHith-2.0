<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg" alt="FarmHith Logo" width="80" height="80" />
  <h1>🌱 FarmHith 2.0</h1>
  <p><strong>A Next-Generation AgriTech Platform Empowering the Agricultural Ecosystem</strong></p>

  <p>
    <a href="#about-the-project">About</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#key-features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  </p>
</div>

---

## 📖 About the Project

**FarmHith 2.0** is an advanced, multi-tenant AgriTech platform designed to bridge the gap between farmers, soil testing laboratories, agricultural experts (Soil Mitras), and bio-pellet manufacturers. Built as a highly scalable **Turborepo monorepo**, it delivers specialized portals for different stakeholders while sharing a robust core of UI components, types, and backend services.

By combining real-time data processing, seamless payments, and video consultations, FarmHith modernizes agricultural operations and maximizes farmer profitability.

## 🏗️ Architecture

The project is structured as a Monorepo using **pnpm workspaces** and **Turborepo**, containing 5 distinct Next.js web applications and 7 shared internal packages.

### 📱 Applications (`/apps`)

| App | Description | Port |
| :--- | :--- | :--- |
| 🧑‍🌾 **Farmer Portal** | The main dashboard for farmers. Book soil tests, schedule expert consultations, and sell crop residue on the bio-pellet marketplace. | `3001` |
| 🔬 **Lab Portal** | Dedicated interface for soil testing laboratories to manage incoming samples, process tests, and upload digital PDF reports. | `3002` |
| 🌾 **Bio-Pellet Portal** | A marketplace for bio-pellet manufacturers to discover and procure agricultural crop residue directly from farmers. | `3003` |
| 👨‍🏫 **Soil Mitra Portal** | Portal for agricultural experts to manage appointments and host real-time video consultations with farmers. | `3004` |
| 🛡️ **Admin Dashboard** | Centralized control panel for platform administrators to monitor transactions, manage users, and enforce platform integrity. | `3005` |

### 📦 Shared Packages (`/packages`)

All business logic, UI, and configurations are abstracted into modular packages to ensure code reusability and maintainability.

- **`@farmhith/ui`**: Centralized design system with reusable React components (Tailwind CSS, Framer Motion, Radix UI).
- **`@farmhith/auth`**: Universal Firebase authentication hooks and context providers.
- **`@farmhith/firebase`**: Firebase client and Admin SDK initialization and configurations.
- **`@farmhith/types`**: Single source of truth for TypeScript interfaces, Firestore schemas, and RBAC Role definitions.
- **`@farmhith/hooks`**: Custom React hooks used across all applications.
- **`@farmhith/utils`**: Core utilities, token verification middleware, and database seed scripts.
- **`@farmhith/config`**: Shared `eslint`, `tsconfig`, and Prettier configurations.

## ✨ Key Features

*   **🌱 Comprehensive Soil Testing**: End-to-end workflow from booking a test to receiving digital reports, handled via Firebase Storage and Firestore.
*   **🎥 Real-Time Expert Consultations**: Integrated video calling powered by the **Daily.co API**, enabling face-to-face sessions between farmers and Soil Mitras.
*   **♻️ Bio-Pellet Marketplace**: A real-time procurement platform algorithmically calculating standard rates and facilitating direct trade of crop residue.
*   **💳 Secure Payment Gateway**: Integrated **Razorpay** checkout and automated webhook processing for seamless booking confirmations and commission distribution.
*   **🔐 Role-Based Access Control (RBAC)**: Strict security protocols enforced through Firebase Custom Claims, secure Next.js API Routes, and deep `firestore.rules`.
*   **⚡ Blazing Fast UI**: Leveraging Next.js App Router, React Server Components, and optimized Framer Motion animations for a premium user experience.

## 🛠️ Tech Stack

**Frontend Framework**
- [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- [React 18](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

**Backend & Database**
- [Firebase Firestore](https://firebase.google.com/docs/firestore) (NoSQL Database)
- [Firebase Auth](https://firebase.google.com/docs/auth) (Authentication)
- [Firebase Storage](https://firebase.google.com/docs/storage) (File Storage)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) (Server-side validation)

**Tooling & Infrastructure**
- [Turborepo](https://turbo.build/) (High-performance build system)
- [pnpm](https://pnpm.io/) (Fast, disk space efficient package manager)
- [TypeScript](https://www.typescriptlang.org/) (Strict type checking)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- **Node.js**: `>= 18.0.0`
- **pnpm**: `>= 10.0.0` (Install via `npm install -g pnpm`)

### 1. Clone & Install dependencies

```bash
git clone https://github.com/mittalshivam226/FarmHith-2.0.git
cd FarmHith-2.0

# Install dependencies across the entire monorepo
pnpm install
```

### 2. Environment Setup

Copy the example environment file and configure it with your credentials:

```bash
cp .env.example .env.local
```

**Required Third-Party Credentials:**
- **Firebase Project Config**: For client apps (`NEXT_PUBLIC_FIREBASE_...`).
- **Firebase Service Account**: Download the JSON from the Firebase Console (Settings > Service Accounts) and set `FIREBASE_SERVICE_ACCOUNT_JSON`.
- **Razorpay Keys**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` from your Razorpay Dashboard.
- **Daily.co API Key**: `DAILY_API_KEY` for video consultation rooms.

### 3. Database Initialization (Optional)

If you are setting up a fresh Firebase project, you can seed the database with initial mock data:

```bash
pnpm dlx tsx packages/utils/src/seedFirestore.ts
```
*(Ensure `GOOGLE_APPLICATION_CREDENTIALS` or the Admin JSON is correctly set).*

### 4. Running the Development Servers

To start all applications simultaneously:

```bash
pnpm dev
```

To run a specific application (e.g., the Farmer App):

```bash
pnpm dev:farmer
```

Available specific run commands:
- `pnpm dev:farmer` (Port 3001)
- `pnpm dev:lab` (Port 3002)
- `pnpm dev:biopellet` (Port 3003)
- `pnpm dev:soilmitra` (Port 3004)
- `pnpm dev:admin` (Port 3005)

---

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests to our repository. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
