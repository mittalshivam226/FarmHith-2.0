import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ToastContainer } from '@farmhith/ui';
import { AuthProvider } from '@farmhith/auth';

export const metadata: Metadata = {
  title: 'FarmHith — Farmer Portal',
  description: 'Manage soil tests, Soil-Mitra sessions, and crop residue listings on FarmHith.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Razorpay checkout SDK — loaded once for the entire farmer portal */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <AuthProvider requiredRole="FARMER">
          <ToastContainer>
            {children}
          </ToastContainer>
        </AuthProvider>
      </body>
    </html>
  );
}

